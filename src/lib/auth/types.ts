/**
 * User Role Types
 * 
 * Defines the possible roles a user can have in the system.
 * - 'user': Regular user (default role for new signups)
 * - 'business': Business owner with access to business management features
 */
export type UserRole = 'user' | 'business'

/**
 * Current User Object
 * 
 * Standardized structure returned by getCurrentUser()
 * Contains both Clerk and database identifiers plus the user's role.
 */
export interface CurrentUser {
    /** Clerk user ID (used for authentication) */
    clerkUserId: string
    /** Database user ID (UUID from users table) */
    dbUserId: string
    /** User's role in the system */
    role: UserRole
    /** User's email address */
    email: string
    /** User's first name (if set) */
    firstName: string | null
    /** User's last name (if set) */
    lastName: string | null
}

/**
 * Result type for getCurrentUser()
 * Returns null if user is not authenticated
 */
export type GetCurrentUserResult = CurrentUser | null
