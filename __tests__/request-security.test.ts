/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    requestRateLimit: {
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

jest.mock('botid/server', () => ({
  checkBotId: jest.fn(),
}))

import { NextRequest } from 'next/server'
import { checkBotId } from 'botid/server'
import { prisma } from '@/lib/db'
import {
  checkRateLimit,
  cleanupExpiredRequestLimits,
  enforcePublicRequest,
  getClientIp,
  hashRateLimitIdentifier,
  parseBoundedJson,
} from '@/lib/security/request-guard'

describe('public request security', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RATE_LIMIT_SECRET = 'test-rate-limit-secret'
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: false })
  })

  afterEach(() => {
    delete process.env.RATE_LIMIT_SECRET
  })

  it('uses Vercel client IP metadata ahead of fallbacks', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '203.0.113.4',
      'x-forwarded-for': '198.51.100.3',
      'x-real-ip': '192.0.2.2',
    })

    expect(getClientIp(headers)).toBe('203.0.113.4')
  })

  it('hashes request identities without retaining the raw value', () => {
    const first = hashRateLimitIdentifier('203.0.113.4', 'test-secret')
    const second = hashRateLimitIdentifier('203.0.113.4', 'test-secret')

    expect(first).toBe(second)
    expect(first).toMatch(/^[a-f0-9]{64}$/)
    expect(first).not.toContain('203.0.113.4')
  })

  it('allows requests through the configured limit', async () => {
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockResolvedValue({ count: 3 })

    await expect(checkRateLimit({
      route: 'search',
      identifier: '203.0.113.4',
      limit: 20,
      windowSeconds: 60,
      now: new Date('2026-08-22T12:34:56.000Z'),
      secret: 'test-secret',
    })).resolves.toMatchObject({ allowed: true, remaining: 17 })
  })

  it('rejects requests above the limit with a bounded retry time', async () => {
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockResolvedValue({ count: 21 })

    await expect(checkRateLimit({
      route: 'search',
      identifier: '203.0.113.4',
      limit: 20,
      windowSeconds: 60,
      now: new Date('2026-08-22T12:34:56.000Z'),
      secret: 'test-secret',
    })).resolves.toMatchObject({ allowed: false, remaining: 0, retryAfter: 4 })
  })

  it('rejects automated clients before performing a rate-limit write', async () => {
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: true })

    const response = await enforcePublicRequest(
      new NextRequest('https://dronewire.org/api/search?q=radar'),
      { route: 'search', limit: 20, windowSeconds: 60 },
    )

    expect(response?.status).toBe(403)
    expect(prisma.requestRateLimit.upsert).not.toHaveBeenCalled()
  })

  it('returns 429 and Retry-After when the persistent quota is exceeded', async () => {
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockResolvedValue({ count: 21 })

    const response = await enforcePublicRequest(
      new NextRequest('https://dronewire.org/api/search?q=radar', {
        headers: { 'x-vercel-forwarded-for': '203.0.113.4' },
      }),
      { route: 'search', limit: 20, windowSeconds: 60 },
    )

    expect(response?.status).toBe(429)
    expect(Number(response?.headers.get('retry-after'))).toBeGreaterThan(0)
  })

  it('can enforce an address quota independently of the request IP', async () => {
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockResolvedValue({ count: 1 })

    const response = await enforcePublicRequest(
      new NextRequest('https://dronewire.org/api/newsletter/subscribe', {
        headers: { 'x-vercel-forwarded-for': '203.0.113.22' },
      }),
      {
        route: 'newsletter-welcome',
        limit: 1,
        windowSeconds: 86400,
        identifier: 'reader@example.com',
        checkBot: false,
      },
    )

    expect(response).toBeNull()
    const call = (prisma.requestRateLimit.upsert as jest.Mock).mock.calls[0][0]
    expect(call.where.route_keyHash_windowStart.keyHash).toBe(
      hashRateLimitIdentifier('reader@example.com', 'test-rate-limit-secret'),
    )
  })

  it('rejects JSON bodies larger than the endpoint limit', async () => {
    const request = new NextRequest('https://dronewire.org/api/contact', {
      method: 'POST',
      body: JSON.stringify({ message: 'x'.repeat(200) }),
      headers: { 'content-type': 'application/json' },
    })

    await expect(parseBoundedJson(request, 64)).rejects.toMatchObject({ status: 413 })
  })

  it('removes only expired persistent quota windows', async () => {
    ;(prisma.requestRateLimit.deleteMany as jest.Mock).mockResolvedValue({ count: 12 })
    const cutoff = new Date('2026-08-22T12:00:00.000Z')

    await expect(cleanupExpiredRequestLimits(cutoff)).resolves.toBe(12)
    expect(prisma.requestRateLimit.deleteMany).toHaveBeenCalledWith({
      where: { expiresAt: { lt: cutoff } },
    })
  })
})
