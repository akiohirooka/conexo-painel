import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

type RestoredRole = 'user' | 'business'

function getRedirectPathByRole(role: RestoredRole): string {
  return role === 'business' ? '/dashboard' : '/home'
}

async function resolveHistoricalRole(clerkUserId: string): Promise<RestoredRole> {
  const [businessesCount, eventsCount, jobsCount] = await Promise.all([
    db.businesses.count({ where: { clerk_user_id: clerkUserId } }),
    db.events.count({ where: { clerk_user_id: clerkUserId } }),
    db.jobs.count({ where: { clerk_user_id: clerkUserId } }),
  ])

  const hasBusinessHistory = businessesCount > 0 || eventsCount > 0 || jobsCount > 0
  return hasBusinessHistory ? 'business' : 'user'
}

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { clerk_user_id: userId },
      select: {
        clerk_user_id: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role !== 'deleted') {
      const activeRole: RestoredRole = user.role === 'business' ? 'business' : 'user'
      return NextResponse.json({
        success: true,
        role: activeRole,
        redirectTo: getRedirectPathByRole(activeRole),
      })
    }

    const restoredRole = await resolveHistoricalRole(user.clerk_user_id)

    await db.users.update({
      where: { clerk_user_id: user.clerk_user_id },
      data: {
        role: restoredRole,
        deletion_requested_at: null,
      },
    })

    return NextResponse.json({
      success: true,
      role: restoredRole,
      redirectTo: getRedirectPathByRole(restoredRole),
    })
  } catch (error) {
    console.error('Failed to reactivate account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
