/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    newsletterSubscriber: { updateMany: jest.fn() },
  },
}))

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import {
  createUnsubscribeToken,
  createPreferenceToken,
  createUnsubscribeUrl,
  verifyUnsubscribeToken,
} from '@/lib/security/unsubscribe-token'
import { POST as unsubscribe } from '@/app/api/newsletter/unsubscribe/route'

describe('unsubscribe token lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.UNSUBSCRIBE_SECRET = 'test-unsubscribe-secret-with-sufficient-length'
    process.env.SITE_URL = 'https://dronewire.org'
  })

  afterEach(() => {
    delete process.env.UNSUBSCRIBE_SECRET
    delete process.env.SITE_URL
  })

  it('round-trips a subscriber id without exposing it as plain text', () => {
    const token = createUnsubscribeToken('subscriber-123', 4)

    expect(token).not.toContain('subscriber-123')
    expect(verifyUnsubscribeToken(token, 'unsubscribe')).toMatchObject({ subscriberId: 'subscriber-123', tokenRevision: 4 })
  })

  it('rejects tampered and malformed tokens', () => {
    const token = createUnsubscribeToken('subscriber-123', 0)
    const tampered = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`

    expect(verifyUnsubscribeToken(tampered, 'unsubscribe')).toBeNull()
    expect(verifyUnsubscribeToken('not-a-token', 'unsubscribe')).toBeNull()
  })

  it('rejects wrong-purpose and expired tokens', () => {
    const issuedAt = new Date('2026-01-01T00:00:00.000Z')
    const preferenceToken = createPreferenceToken('subscriber-123', 2, issuedAt)
    expect(verifyUnsubscribeToken(preferenceToken, 'unsubscribe', issuedAt)).toBeNull()
    expect(verifyUnsubscribeToken(preferenceToken, 'preferences', new Date('2027-01-01T00:00:00.000Z'))).toBeNull()
  })

  it('creates a same-site unsubscribe URL containing the signed token', () => {
    const url = new URL(createUnsubscribeUrl('subscriber-123', 0))

    expect(url.origin).toBe('https://dronewire.org')
    expect(url.pathname).toBe('/unsubscribe')
    expect(verifyUnsubscribeToken(url.searchParams.get('token') || '', 'unsubscribe')?.subscriberId).toBe('subscriber-123')
  })

  it('idempotently suppresses future email for a valid token', async () => {
    ;(prisma.newsletterSubscriber.updateMany as jest.Mock).mockResolvedValue({ count: 1 })
    const token = createUnsubscribeToken('subscriber-123', 0)

    const response = await unsubscribe(new NextRequest(
      'https://dronewire.org/api/newsletter/unsubscribe',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      },
    ))

    expect(response.status).toBe(200)
    expect(prisma.newsletterSubscriber.updateMany).toHaveBeenCalledWith({
      where: { id: 'subscriber-123', preferenceTokenRevision: 0, status: { not: 'unsubscribed' } },
      data: {
        status: 'unsubscribed',
        alertsEnabled: false,
        weeklyDigestEnabled: false,
        breakingAlertsEnabled: false,
        breakingAlertsConsentedAt: null,
        preferenceTokenRevision: { increment: 1 },
      },
    })
  })

  it('rejects an invalid token without querying subscriber data', async () => {
    const response = await unsubscribe(new NextRequest(
      'https://dronewire.org/api/newsletter/unsubscribe',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: 'invalid' }),
      },
    ))

    expect(response.status).toBe(400)
    expect(prisma.newsletterSubscriber.updateMany).not.toHaveBeenCalled()
  })
})
