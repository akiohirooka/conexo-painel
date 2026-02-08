import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

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
