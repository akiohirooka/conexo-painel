import { clerkClient } from '@clerk/nextjs/server'

export type ClerkUserProfile = {
  email: string | null
  firstName: string | null
  lastName: string | null
}

export async function getClerkUserProfile(clerkUserId: string): Promise<ClerkUserProfile | null> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(clerkUserId)

    return {
      email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
    }
  } catch {
    return null
  }
}

export function getUsersFallbackEmail() {
  return 'pending-email@placeholder.local'
}
