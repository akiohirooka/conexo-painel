import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {
  ACCOUNT_DELETED_DECISION_PATH,
  ACCOUNT_REACTIVATE_API_PATH,
  buildAccountDeletedDecisionPath,
  type AccountAccessState,
} from '@/lib/auth/deleted-account'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/internal/auth/user-status(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAccountDeletedDecisionRoute = createRouteMatcher([
  `${ACCOUNT_DELETED_DECISION_PATH}(.*)`,
])
const isDeletedAccountAllowedApiRoute = createRouteMatcher([
  `${ACCOUNT_REACTIVATE_API_PATH}(.*)`,
])

const E2E_BYPASS = process.env.E2E_AUTH_BYPASS === '1'

export default E2E_BYPASS
  ? function middleware() {
    return NextResponse.next()
  }
  : clerkMiddleware(async (auth, request) => {
    const pathname = request.nextUrl.pathname

    // Never gate Next.js internals/static assets
    if (pathname.startsWith('/_next')) {
      return NextResponse.next()
    }

    // Allow public routes
    if (isPublicRoute(request)) {
      return NextResponse.next()
    }

    // Protect all other routes
    const authObject = await auth()
    if (!authObject.userId) {
      const url = new URL('/sign-in', request.url)
      return NextResponse.redirect(url)
    }

    if (!isAccountDeletedDecisionRoute(request) && !isDeletedAccountAllowedApiRoute(request)) {
      const statusUrl = new URL('/api/internal/auth/user-status', request.url)
      const isApiRoute = pathname.startsWith('/api')

      try {
        const statusResponse = await fetch(statusUrl, {
          method: 'GET',
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
          cache: 'no-store',
        })

        if (statusResponse.status === 401) {
          const url = new URL('/sign-in', request.url)
          return NextResponse.redirect(url)
        }

        if (!statusResponse.ok) {
          throw new Error(`Status check failed (${statusResponse.status})`)
        }

        const accountStatus = await statusResponse.json() as {
          status: AccountAccessState
          clerkUserId?: string
          email?: string | null
        }

        if (accountStatus.status === 'deleted') {
          const redirectTo = buildAccountDeletedDecisionPath({
            clerkUserId: accountStatus.clerkUserId || authObject.userId,
            email: accountStatus.email,
          })

          if (isApiRoute) {
            return NextResponse.json(
              { error: 'account_deleted', redirectTo },
              { status: 403 },
            )
          }

          return NextResponse.redirect(new URL(redirectTo, request.url))
        }
      } catch (error) {
        console.error('Middleware account status check failed:', error)

        if (isApiRoute) {
          return NextResponse.json(
            { error: 'account_status_check_failed' },
            { status: 503 },
          )
        }

        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    }

    // Quick guard for admin routes to reduce UI flash
    if (isAdminRoute(request)) {
      // Optional: only enforce ADMIN_USER_IDS here to avoid extra lookups
      const adminUserIds = process.env.ADMIN_USER_IDS?.split(',').filter(Boolean) || []
      if (adminUserIds.length > 0 && !adminUserIds.includes(authObject.userId)) {
        const url = new URL('/', request.url)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  })

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
