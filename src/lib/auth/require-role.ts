import { redirect } from 'next/navigation'
import { getCurrentUser } from './current-user'
import type { CurrentUser, UserRole } from './types'
import { buildAccountDeletedDecisionPath } from './deleted-account'

function redirectIfDeleted(user: CurrentUser) {
    if (user.role === 'deleted') {
        redirect(buildAccountDeletedDecisionPath({
            clerkUserId: user.clerkUserId,
            email: user.email,
        }))
    }
}

/**
 * Requires a specific role for accessing a server page or action.
 * 
 * This helper is designed for use in server components to protect
 * role-specific routes. It handles authentication and authorization
 * in one step.
 * 
 * Behavior:
 * - If user is not logged in: redirects to /sign-in
 * - If user doesn't have required role: redirects to appropriate home page
 * - If user has required role: returns the CurrentUser object
 * 
 * @param requiredRole - The role required to access this page
 * @returns CurrentUser object if access is granted
 * 
 * @example
 * ```tsx
 * // In a server component (e.g., app/business-dashboard/page.tsx)
 * export default async function BusinessDashboard() {
 *   const user = await requireRole('business')
 *   // If we get here, user has 'business' role
 *   return <div>Welcome, business owner!</div>
 * }
 * ```
 */
export async function requireRole(requiredRole: UserRole): Promise<CurrentUser> {
    const user = await getCurrentUser()

    if (!user) {
        // User not authenticated - redirect to Clerk sign-in
        redirect('/sign-in')
    }

    redirectIfDeleted(user)

    if (user.role !== requiredRole) {
        // User authenticated but doesn't have required role
        // Redirect to appropriate home based on actual role
        if (user.role === 'user') {
            redirect('/home')
        } else {
            redirect('/dashboard')
        }
    }

    return user
}

/**
 * Requires any of the specified roles for accessing a server page or action.
 * 
 * Similar to requireRole but accepts multiple allowed roles.
 * 
 * @param allowedRoles - Array of roles that are allowed to access this page
 * @returns CurrentUser object if access is granted
 * 
 * @example
 * ```tsx
 * // Allow both 'user' and 'business' roles
 * const user = await requireAnyRole(['user', 'business'])
 * ```
 */
export async function requireAnyRole(allowedRoles: UserRole[]): Promise<CurrentUser> {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    redirectIfDeleted(user)

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate home based on actual role
        if (user.role === 'user') {
            redirect('/home')
        } else {
            redirect('/dashboard')
        }
    }

    return user
}

/**
 * Requires user to be authenticated (any role).
 * 
 * Use this when you just need to ensure the user is logged in,
 * regardless of their role.
 * 
 * @returns CurrentUser object if authenticated
 * 
 * @example
 * ```tsx
 * const user = await requireAuth()
 * // User is logged in, proceed with any role
 * ```
 */
export async function requireAuth(): Promise<CurrentUser> {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    redirectIfDeleted(user)

    return user
}
