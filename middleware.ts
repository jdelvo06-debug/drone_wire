import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'dw-admin-session'

// Web Crypto API — compatible with Next.js Edge Runtime
export async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode('droneware-admin-session-v1'))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only intercept admin routes, leave login page open
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSecret = process.env.ADMIN_SECRET
    const sessionToken = request.cookies.get(ADMIN_COOKIE)?.value

    if (!adminSecret) {
      return new NextResponse('Admin access not configured. Set ADMIN_SECRET env var.', { status: 503 })
    }

    const expected = await generateSessionToken(adminSecret)

    if (!sessionToken || sessionToken !== expected) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', encodeURIComponent(pathname))
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
