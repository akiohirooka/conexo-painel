import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getAccountStatusByClerkUserId } from '@/lib/auth/account-status'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountStatus = await getAccountStatusByClerkUserId(userId)
    return NextResponse.json(accountStatus, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Failed to resolve internal user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
