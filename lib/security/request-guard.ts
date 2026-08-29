import { createHmac } from 'node:crypto'
import { checkBotId } from 'botid/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export interface RateLimitOptions {
  route: string
  identifier: string
  limit: number
  windowSeconds: number
  now?: Date
  secret?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number
}

export interface PublicRequestPolicy {
  route: string
  limit: number
  windowSeconds: number
  identifier?: string
  identifierSuffix?: string
  checkBot?: boolean
}

export class RequestBodyError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'RequestBodyError'
  }
}

export function isVercelPreview(): boolean {
  return process.env.VERCEL_ENV === 'preview'
}

export function getClientIp(headers: Headers): string {
  const value =
    headers.get('x-vercel-forwarded-for') ||
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    'local'

  return value.split(',')[0].trim() || 'local'
}

export function hashRateLimitIdentifier(identifier: string, secret: string): string {
  return createHmac('sha256', secret).update(identifier).digest('hex')
}

export function getRateLimitSecret(): string {
  const secret = process.env.RATE_LIMIT_SECRET || (
    process.env.NODE_ENV === 'production' ? undefined : process.env.ADMIN_SECRET
  )
  if (!secret) {
    throw new Error('Rate limiting is not configured')
  }
  return secret
}

export async function checkRateLimit({
  route,
  identifier,
  limit,
  windowSeconds,
  now = new Date(),
  secret = getRateLimitSecret(),
}: RateLimitOptions): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs)
  const expiresAt = new Date(windowStart.getTime() + windowMs)
  const keyHash = hashRateLimitIdentifier(identifier, secret)

  const entry = await prisma.requestRateLimit.upsert({
    where: {
      route_keyHash_windowStart: {
        route,
        keyHash,
        windowStart,
      },
    },
    create: {
      route,
      keyHash,
      windowStart,
      expiresAt,
      count: 1,
    },
    update: {
      count: { increment: 1 },
      expiresAt,
    },
    select: { count: true },
  })

  const allowed = entry.count <= limit
  return {
    allowed,
    remaining: allowed ? Math.max(0, limit - entry.count) : 0,
    retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)),
  }
}

export async function cleanupExpiredRequestLimits(cutoff = new Date()): Promise<number> {
  const result = await prisma.requestRateLimit.deleteMany({
    where: { expiresAt: { lt: cutoff } },
  })
  return result.count
}

export async function enforcePublicRequest(
  request: NextRequest,
  policy: PublicRequestPolicy,
): Promise<NextResponse | null> {
  if (policy.checkBot !== false) {
    try {
      const verification = await checkBotId()
      if (verification.isBot) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    } catch {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Request verification unavailable' }, { status: 503 })
      }
    }
  }

  try {
    const ip = getClientIp(request.headers)
    const identifier = policy.identifier ?? (
      policy.identifierSuffix ? `${ip}:${policy.identifierSuffix}` : ip
    )
    const result = await checkRateLimit({
      route: policy.route,
      identifier,
      limit: policy.limit,
      windowSeconds: policy.windowSeconds,
    })

    if (!result.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.retryAfter),
            'Cache-Control': 'no-store',
          },
        },
      )
    }
  } catch {
    return NextResponse.json({ error: 'Request protection unavailable' }, { status: 503 })
  }

  return null
}

export async function parseBoundedJson<T>(request: NextRequest, maxBytes: number): Promise<T> {
  const declaredLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError('Request body too large', 413)
  }

  const text = await request.text()
  if (Buffer.byteLength(text, 'utf8') > maxBytes) {
    throw new RequestBodyError('Request body too large', 413)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new RequestBodyError('Invalid JSON body', 400)
  }
}
