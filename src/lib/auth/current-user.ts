import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import type { CurrentUser, GetCurrentUserResult, UserRole } from './types'
import { getClerkUserProfile, getUsersFallbackEmail } from '@/lib/auth/clerk-user-profile'

/**
 * Gets the currently authenticated user with their role.
 * 
 * This is a server-side helper that:
 * 1. Uses Clerk auth() to get the authenticated user's clerk_user_id
 * 2. Fetches the user record from the database
 * 3. Auto-creates a user record with role='user' if one doesn't exist
 * 
 * @returns CurrentUser object with clerkUserId, dbUserId, and role, or null if not authenticated
 * 
 * @example
 * ```ts
 * // In a server component or server action
 * const user = await getCurrentUser()
 * if (!user) {
 *   redirect('/sign-in')
 * }
 * console.log(user.role) // 'user' or 'business'
 * ```
 */
export async function getCurrentUser(): Promise<GetCurrentUserResult> {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
        return null
    }

    // First, try to find the existing user
    let user = await db.users.findUnique({
        where: { clerk_user_id: clerkUserId },
        select: {
            id: true,
            clerk_user_id: true,
            role: true,
            email: true,
            first_name: true,
            last_name: true,
        },
    })

    if (user && (user.email.endsWith('@placeholder.local') || !user.email.includes('@'))) {
        const clerkProfile = await getClerkUserProfile(clerkUserId)
        if (clerkProfile?.email) {
            user = await db.users.update({
                where: { id: user.id },
                data: { email: clerkProfile.email },
                select: {
                    id: true,
                    clerk_user_id: true,
                    role: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            })
        }
    }

    // If user doesn't exist in our database, create them with default role
    if (!user) {
        const clerkProfile = await getClerkUserProfile(clerkUserId)

        // Get additional info from Clerk if needed
        // For now, we create with minimal data - the webhook or other processes
        // should update the user with full details
        user = await db.users.create({
            data: {
                clerk_user_id: clerkUserId,
                email: clerkProfile?.email ?? getUsersFallbackEmail(),
                first_name: clerkProfile?.firstName ?? null,
                last_name: clerkProfile?.lastName ?? null,
                role: 'user',
            },
            select: {
                id: true,
                clerk_user_id: true,
                role: true,
                email: true,
                first_name: true,
                last_name: true,
            },
        })
    }

    return {
        clerkUserId: user.clerk_user_id,
        dbUserId: user.id,
        role: user.role as UserRole,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
    }
}

/**
 * Checks if a user has a specific role
 * 
 * @param user - The current user object
 * @param requiredRole - The role to check for
 * @returns true if user has the required role
 */
export function hasRole(user: CurrentUser | null, requiredRole: UserRole): boolean {
    if (!user) return false
    return user.role === requiredRole
}

/**
 * Checks if a user has any of the specified roles
 * 
 * @param user - The current user object
 * @param roles - Array of roles to check
 * @returns true if user has any of the specified roles
 */
export function hasAnyRole(user: CurrentUser | null, roles: UserRole[]): boolean {
    if (!user) return false
    return roles.includes(user.role)
}
