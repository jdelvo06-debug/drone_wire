import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, generateSessionToken } from '@/middleware'

export const dynamic = 'force-dynamic'

// Constant-time comparison using Web Crypto to prevent timing attacks
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
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

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
  }

  let body: { password?: string; from?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { password, from } = body

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const isValid = await timingSafeEqual(password, adminSecret)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const sessionToken = await generateSessionToken(adminSecret)
  const redirectTo = from && from.startsWith('/') ? from : '/admin'

  const response = NextResponse.json({ success: true, redirect: redirectTo })
  response.cookies.set(ADMIN_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(ADMIN_COOKIE)
  return response
}
