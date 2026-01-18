/**
 * Usage Examples for Auth Helpers
 * 
 * This file shows how to use the auth utilities in your server components
 * and server actions. These are examples only - DO NOT import this file directly.
 */

// ============================================================================
// EXAMPLE 1: Basic getCurrentUser() usage in a Server Component
// ============================================================================

/*
// app/(dashboard)/profile/page.tsx

import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Welcome, {user.firstName || 'User'}!</h1>
      <p>Your role: {user.role}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 2: Using requireRole() to protect a business-only page
// ============================================================================

/*
// app/(dashboard)/business-dashboard/page.tsx

import { requireRole } from '@/lib/auth'

export default async function BusinessDashboard() {
  // This will redirect to /sign-in if not logged in
  // or to /no-access if user doesn't have 'business' role
  const user = await requireRole('business')

  return (
    <div>
      <h1>Business Dashboard</h1>
      <p>Welcome, {user.firstName}!</p>
      {/* Business-specific content here * /}
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 3: Using requireAuth() when any role is acceptable
// ============================================================================

/*
// app/(dashboard)/settings/page.tsx

import { requireAuth } from '@/lib/auth'

export default async function SettingsPage() {
  // Just needs to be logged in, any role is fine
  const user = await requireAuth()

  return (
    <div>
      <h1>Settings</h1>
      <p>Account: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 4: Using hasRole() for conditional content in a page
// ============================================================================

/*
// app/(dashboard)/dashboard/page.tsx

import { getCurrentUser, hasRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      {hasRole(user, 'business') && (
        <section>
          <h2>Business Tools</h2>
          {/* Business-specific widgets * /}
        </section>
      )}

      {hasRole(user, 'user') && (
        <section>
          <h2>User Content</h2>
          {/* Regular user content * /}
        </section>
      )}
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 5: Using in a Server Action
// ============================================================================

/*
// actions/business-actions.ts

'use server'

import { getCurrentUser, hasRole } from '@/lib/auth'

export async function createBusinessListing(data: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!hasRole(user, 'business')) {
    return { success: false, error: 'Business role required' }
  }

  // Proceed with creating the business listing
  // using user.dbUserId as the owner
  
  return { success: true }
}
*/

// ============================================================================
// EXAMPLE 6: Using requireAnyRole() for pages accessible by multiple roles
// ============================================================================

/*
// app/(dashboard)/listings/page.tsx

import { requireAnyRole } from '@/lib/auth'

export default async function ListingsPage() {
  // Both 'user' and 'business' can view listings
  const user = await requireAnyRole(['user', 'business'])

  return (
    <div>
      <h1>Listings</h1>
      <p>Viewing as: {user.role}</p>
    </div>
  )
}
*/

export { } // Make this a module
