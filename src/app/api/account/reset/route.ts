import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { auth, createClerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withApiLogging } from '@/lib/logging/api'
import { r2 } from '@/lib/r2'

export const runtime = 'nodejs'

const ALLOWED_KEY_PREFIXES = ['business/', 'events/', 'jobs/'] as const
const POST_DELETE_SWEEP_DELAY_MS = 1200

function resolveAllowedCdnHosts() {
  const hosts = new Set<string>()

  function addHost(host?: string | null) {
    const normalized = (host || '').trim().toLowerCase()
    if (!normalized) return
    hosts.add(normalized)
  }

  function addHostFromUrl(rawUrl?: string | null) {
    if (!rawUrl) return
    try {
      addHost(new URL(rawUrl).hostname)
    } catch {
      // ignore invalid URL
    }
  }

  addHost('cdn.conexo.jp')
  addHostFromUrl(process.env.R2_PUBLIC_BASE_URL)
  addHostFromUrl(process.env.NEXT_PUBLIC_R2_BASE_URL)

  const customHosts = process.env.ACCOUNT_RESET_ALLOWED_CDN_HOSTS
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) || []
  for (const host of customHosts) {
    addHost(host)
  }

  return hosts
}

function normalizeR2KeyFromValue(rawValue: string, allowedHosts: Set<string>) {
  const value = rawValue.trim()
  if (!value) return null

  let key = value

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value)
      const host = parsed.hostname.toLowerCase()
      if (!allowedHosts.has(host)) {
        return null
      }
      key = decodeURIComponent(parsed.pathname).replace(/^\/+/, '')
    } catch {
      return null
    }
  } else {
    key = key.replace(/^\/+/, '')
  }

  const hasAllowedPrefix = ALLOWED_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))
  if (!hasAllowedPrefix) return null

  return key
}

async function collectMediaUrls(clerkUserId: string) {
  const [businessRows, eventRows, jobRows] = await Promise.all([
    db.businesses.findMany({
      where: { clerk_user_id: clerkUserId },
      select: {
        cover_image_url: true,
        logo_url: true,
        gallery_images: true,
      },
    }),
    db.events.findMany({
      where: { clerk_user_id: clerkUserId },
      select: {
        cover_image_url: true,
        gallery_images: true,
      },
    }),
    db.jobs.findMany({
      where: { clerk_user_id: clerkUserId },
      select: {
        cover_image_url: true,
        gallery_images: true,
      },
    }),
  ])

  const urls: string[] = []

  for (const business of businessRows) {
    if (business.cover_image_url) urls.push(business.cover_image_url)
    if (business.logo_url) urls.push(business.logo_url)
    for (const image of business.gallery_images || []) {
      if (image) urls.push(image)
    }
  }

  for (const event of eventRows) {
    if (event.cover_image_url) urls.push(event.cover_image_url)
    for (const image of event.gallery_images || []) {
      if (image) urls.push(image)
    }
  }

  for (const job of jobRows) {
    if (job.cover_image_url) urls.push(job.cover_image_url)
    for (const image of job.gallery_images || []) {
      if (image) urls.push(image)
    }
  }

  return urls
}

async function deleteR2Keys(keys: string[]) {
  if (!keys.length) {
    return { deletedCount: 0, failedKeys: [] as string[] }
  }

  const bucket = process.env.R2_BUCKET
  if (!bucket) {
    throw new Error('R2_BUCKET environment variable is missing')
  }

  const results = await Promise.allSettled(
    keys.map((key) =>
      r2.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      ),
    ),
  )

  const failedKeys: string[] = []
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const key = keys[index]
      failedKeys.push(key)
      console.error('Failed to delete R2 object:', key, result.reason)
    }
  })

  return {
    deletedCount: keys.length - failedKeys.length,
    failedKeys,
  }
}

async function deleteUserData(userId: string, clerkUserId: string) {
  try {
    await db.$transaction(async (tx) => {
      // Check if user still exists (webhook might have deleted it already)
      const userExists = await tx.users.findUnique({
        where: { id: userId },
        select: { id: true },
      })

      if (!userExists) {
        console.log('[Account Reset] User already deleted (likely by webhook), skipping')
        return
      }

      console.log('[Account Reset] Deleting UsageHistory:', { userId })
      const deletedUsageHistory = await tx.usageHistory.deleteMany({
        where: { userId },
      })
      console.log('[Account Reset] Deleted UsageHistory count:', deletedUsageHistory.count)

      console.log('[Account Reset] Deleting StorageObject:', { userId })
      const deletedStorageObjects = await tx.storageObject.deleteMany({
        where: { userId },
      })
      console.log('[Account Reset] Deleted StorageObject count:', deletedStorageObjects.count)

      console.log('[Account Reset] Deleting CreditBalance:', { userId })
      const deletedCreditBalance = await tx.creditBalance.deleteMany({
        where: { userId },
      })
      console.log('[Account Reset] Deleted CreditBalance count:', deletedCreditBalance.count)

      console.log('[Account Reset] Updating SubscriptionEvent:', { clerkUserId })
      const updatedSubscriptionEvents = await tx.subscriptionEvent.updateMany({
        where: { clerkUserId },
        data: { userId: null },
      })
      console.log('[Account Reset] Updated SubscriptionEvent count:', updatedSubscriptionEvents.count)

      console.log('[Account Reset] Deleting user record:', { id: userId, clerkUserId })
      await tx.users.delete({
        where: { id: userId },
      })
      console.log('[Account Reset] User record deleted successfully')
    })
  } catch (error) {
    console.error('[Account Reset] Transaction failed:', error)
    // If error is "Record to delete does not exist", that's OK (webhook deleted it)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      console.log('[Account Reset] User was already deleted, continuing...')
      return
    }
    throw error
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function handleAccountReset() {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY is not configured' },
        { status: 500 },
      )
    }

    // Check for multiple users with same clerk_user_id (should never happen)
    const allMatchingUsers = await db.users.findMany({
      where: { clerk_user_id: clerkUserId },
      select: {
        id: true,
        clerk_user_id: true,
        role: true,
      },
    })

    console.log('[Account Reset] Found users with clerk_user_id:', {
      clerkUserId,
      count: allMatchingUsers.length,
      users: allMatchingUsers,
    })

    if (allMatchingUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (allMatchingUsers.length > 1) {
      console.error('[Account Reset] Multiple users found!', {
        clerkUserId,
        count: allMatchingUsers.length,
      })
    }

    const user = allMatchingUsers[0]

    if (user.role !== 'deleted') {
      return NextResponse.json(
        { error: 'Account is not marked for deletion' },
        { status: 403 },
      )
    }

    const urls = await collectMediaUrls(clerkUserId)
    const allowedHosts = resolveAllowedCdnHosts()

    const r2Keys = Array.from(
      new Set(
        urls
          .map((url) => normalizeR2KeyFromValue(url, allowedHosts))
          .filter((key): key is string => Boolean(key)),
      ),
    )

    const { deletedCount, failedKeys } = await deleteR2Keys(r2Keys)
    if (failedKeys.length > 0) {
      console.error('[Account Reset] Failed to delete R2 objects:', {
        clerkUserId,
        failedCount: failedKeys.length,
        failedKeys: failedKeys.slice(0, 20),
      })
      return NextResponse.json(
        {
          error: 'Failed to delete all objects from R2',
          deletedCount,
          failedCount: failedKeys.length,
          failedKeys: failedKeys.slice(0, 20),
        },
        { status: 502 },
      )
    }

    console.log('[Account Reset] Deleting from Clerk FIRST to prevent webhooks:', {
      clerkUserId,
    })

    const clerk = createClerkClient({ secretKey: clerkSecretKey })

    try {
      await clerk.users.deleteUser(clerkUserId)
      console.log('[Account Reset] User deleted from Clerk successfully')
    } catch (clerkError) {
      console.error('[Account Reset] Failed to delete from Clerk:', clerkError)
      // Continue anyway - user might already be deleted from Clerk
    }

    console.log('[Account Reset] Now deleting user data from database:', {
      userId: user.id,
      clerkUserId,
    })

    await deleteUserData(user.id, clerkUserId)

    console.log('[Account Reset] User data deleted, running defensive cleanup:', {
      clerkUserId,
    })

    // Aggressive defensive cleanup: remove any residual local records multiple times
    for (let i = 0; i < 3; i++) {
      const deleted = await db.users.deleteMany({ where: { clerk_user_id: clerkUserId } })
      console.log(`[Account Reset] Cleanup iteration ${i + 1}: deleted ${deleted.count} records`)
      if (deleted.count === 0) break
      await wait(POST_DELETE_SWEEP_DELAY_MS)
    }

    const remainingUsers = await db.users.count({
      where: { clerk_user_id: clerkUserId },
    })

    console.log('[Account Reset] Final check:', {
      clerkUserId,
      remainingUsers,
    })

    if (remainingUsers > 0) {
      console.error('[Account Reset] Users still remain after deletion!', {
        clerkUserId,
        remainingUsers,
      })
      return NextResponse.json(
        {
          error: 'Failed to fully remove users record',
          remainingUsers,
        },
        { status: 500 },
      )
    }

    console.log('[Account Reset] Account reset completed successfully:', {
      clerkUserId,
      deletedR2Objects: deletedCount,
    })

    return NextResponse.json({
      success: true,
      deletedR2Objects: deletedCount,
      reset: true,
    })
  } catch (error) {
    console.error('Failed to reset account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const POST = withApiLogging(handleAccountReset, {
  method: 'POST',
  route: '/api/account/reset',
  feature: 'account_reset',
})
