import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, generateSessionToken, timingSafeEqual } from '@/lib/auth'

// Re-export for route handlers that import from middleware
export { ADMIN_COOKIE, generateSessionToken }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API routes that perform their own authentication.
  // /api/admin/auth handles login/logout; the maintenance routes use bearer tokens.
  if (
    pathname === '/api/admin/auth' ||
    pathname.startsWith('/api/admin/reprocess-images') ||
    pathname.startsWith('/api/admin/seed-explainers')
  ) {
    return NextResponse.next()
  }

  // Protect admin pages (except login) and remaining API admin routes
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminPage || isAdminApi) {
    const adminSecret = process.env.ADMIN_SECRET
    const sessionToken = request.cookies.get(ADMIN_COOKIE)?.value

    if (!adminSecret) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
      }
      return new NextResponse('Admin access not configured. Set ADMIN_SECRET env var.', { status: 503 })
    }

    const expected = await generateSessionToken(adminSecret)

    if (!sessionToken || !(await timingSafeEqual(sessionToken, expected))) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', encodeURIComponent(pathname))
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
