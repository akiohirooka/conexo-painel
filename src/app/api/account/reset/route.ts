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
  await db.$transaction(async (tx) => {
    await tx.usageHistory.deleteMany({
      where: { userId },
    })

    await tx.storageObject.deleteMany({
      where: { userId },
    })

    await tx.creditBalance.deleteMany({
      where: { userId },
    })

    await tx.subscriptionEvent.updateMany({
      where: { clerkUserId },
      data: { userId: null },
    })

    await tx.users.delete({
      where: { id: userId },
    })
  })
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

    const user = await db.users.findUnique({
      where: { clerk_user_id: clerkUserId },
      select: {
        id: true,
        clerk_user_id: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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

    await deleteUserData(user.id, clerkUserId)

    const clerk = createClerkClient({ secretKey: clerkSecretKey })
    await clerk.users.deleteUser(clerkUserId)

    // Defensive cleanup: remove any residual local records and re-check.
    await db.users.deleteMany({ where: { clerk_user_id: clerkUserId } })
    await wait(POST_DELETE_SWEEP_DELAY_MS)
    await db.users.deleteMany({ where: { clerk_user_id: clerkUserId } })

    const remainingUsers = await db.users.count({
      where: { clerk_user_id: clerkUserId },
    })
    if (remainingUsers > 0) {
      return NextResponse.json(
        {
          error: 'Failed to fully remove users record',
          remainingUsers,
        },
        { status: 500 },
      )
    }

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
