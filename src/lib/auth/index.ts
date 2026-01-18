/**
 * Auth Utilities
 * 
 * Centralized authentication and authorization helpers for server-side use.
 * 
 * @example
 * ```ts
 * import { getCurrentUser, requireRole, hasRole } from '@/lib/auth'
 * 
 * // Get current user (may be null)
 * const user = await getCurrentUser()
 * 
 * // Require specific role (redirects if not met)
 * const businessUser = await requireRole('business')
 * 
 * // Check role without redirecting
 * if (hasRole(user, 'business')) {
 *   // Show business features
 * }
 * ```
 */

export * from './types'
export * from './current-user'
export * from './require-role'
