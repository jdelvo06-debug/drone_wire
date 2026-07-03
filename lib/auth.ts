import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'dw-admin-session'

/**
 * Timing-safe string comparison using Web Crypto (Edge-runtime compatible).
 * Avoids leaking length/content via timing side-channels.
 */
export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const guard = encoder.encode('droneware-timing-guard')
  const [keyA, keyB] = await Promise.all([
    crypto.subtle.importKey('raw', encoder.encode(a), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
    crypto.subtle.importKey('raw', encoder.encode(b), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']),
  ])
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign('HMAC', keyA, guard),
    crypto.subtle.sign('HMAC', keyB, guard),
  ])
  const arrA = new Uint8Array(sigA)
  const arrB = new Uint8Array(sigB)
  if (arrA.length !== arrB.length) return false
  let diff = 0
  for (let i = 0; i < arrA.length; i++) diff |= arrA[i] ^ arrB[i]
  return diff === 0
}

/**
 * Generates the expected admin session token from ADMIN_SECRET via HMAC-SHA256.
 * Web Crypto only — no Node crypto.
 */
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

/**
 * Validates that the request has a valid admin session cookie.
 * Returns null if authorized, or a 401 NextResponse if not.
 * Defense-in-depth for route handlers that are also covered by middleware.
 */
export async function requireAdmin(
  req: NextRequest,
  cookieName: string = ADMIN_COOKIE
): Promise<NextResponse | null> {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
  }
  const sessionToken = req.cookies.get(cookieName)?.value
  if (!sessionToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const expected = await generateSessionToken(adminSecret)
  const ok = await timingSafeEqual(sessionToken, expected)
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/**
 * Validates an admin request via Bearer token (ADMIN_SECRET).
 * For API routes not using the session cookie flow.
 */
export async function requireAdminBearer(
  req: NextRequest
): Promise<NextResponse | null> {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
  }
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.slice(7)
  const ok = await timingSafeEqual(token, adminSecret)
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/**
 * Validates that a redirect path is same-origin and restricted to /admin.
 * Rejects protocol-relative URLs like //evil.com and open redirects.
 */
export function isValidAdminRedirect(path: string | undefined): boolean {
  if (!path || typeof path !== 'string') return false
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (!path.startsWith('/admin')) return false
  return true
}