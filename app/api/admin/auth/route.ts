import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, generateSessionToken, timingSafeEqual, isValidAdminRedirect } from '@/lib/auth'
import {
  enforcePublicRequest,
  parseBoundedJson,
  RequestBodyError,
} from '@/lib/security/request-guard'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
  }

  const blocked = await enforcePublicRequest(req, {
    route: 'admin-login',
    limit: 5,
    windowSeconds: 15 * 60,
  })
  if (blocked) return blocked

  let body: { password?: string; from?: string }
  try {
    body = await parseBoundedJson(req, 4 * 1024)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof RequestBodyError ? error.message : 'Invalid request' },
      { status: error instanceof RequestBodyError ? error.status : 400 },
    )
  }

  const { password, from } = body

  if (!password || typeof password !== 'string' || password.length > 512) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  const isValid = await timingSafeEqual(password, adminSecret)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const sessionToken = await generateSessionToken(adminSecret)
  const redirectTo = isValidAdminRedirect(from) ? from : '/admin'

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
