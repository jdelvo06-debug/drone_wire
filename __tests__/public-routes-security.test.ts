/** @jest-environment node */

jest.mock('botid/server', () => ({
  checkBotId: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    requestRateLimit: { upsert: jest.fn() },
    contactSubmission: { create: jest.fn() },
    newsletterSubscriber: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))

jest.mock('@/lib/services/email', () => ({
  sendContactNotification: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}))

jest.mock('@/lib/services/federated-search', () => ({
  federatedSearch: jest.fn(),
  isSearchEntityType: (value: string) => ['article', 'system', 'explainer', 'contract'].includes(value),
}))

import { NextRequest } from 'next/server'
import { checkBotId } from 'botid/server'
import { prisma } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/services/email'
import { federatedSearch } from '@/lib/services/federated-search'
import { POST as contact } from '@/app/api/contact/route'
import { POST as subscribe } from '@/app/api/newsletter/subscribe/route'
import { GET as search } from '@/app/api/search/route'
import { POST as adminLogin } from '@/app/api/admin/auth/route'

describe('public route protection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VERCEL_ENV = 'production'
    process.env.RATE_LIMIT_SECRET = 'test-rate-limit-secret'
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: false })
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockResolvedValue({ count: 1 })
  })

  afterEach(() => {
    delete process.env.VERCEL_ENV
    delete process.env.RATE_LIMIT_SECRET
  })

  it('rejects oversized contact fields before persisting them', async () => {
    const response = await contact(new NextRequest('https://dronewire.org/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Question',
        type: 'general',
        message: 'x'.repeat(5001),
      }),
    }))

    expect(response.status).toBe(400)
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled()
  })

  it('signs the welcome email for the created subscriber', async () => {
    ;(prisma.newsletterSubscriber.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.newsletterSubscriber.create as jest.Mock).mockResolvedValue({
      id: 'subscriber-123',
      email: 'test@example.com',
      preferenceTokenRevision: 0,
    })
    ;(sendWelcomeEmail as jest.Mock).mockResolvedValue({ success: true })

    const response = await subscribe(new NextRequest('https://dronewire.org/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', firstName: 'Test' }),
    }))

    expect(response.status).toBe(200)
    expect(sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test', 'subscriber-123', 0)
  })

  it('blocks bot-classified semantic searches before incurring embedding cost', async () => {
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: true })

    const response = await search(new NextRequest('https://dronewire.org/api/search?q=radar'))

    expect(response.status).toBe(403)
    expect(federatedSearch).not.toHaveBeenCalled()
  })

  it('allows Preview searches without BotID or persistent rate-limit writes', async () => {
    process.env.VERCEL_ENV = 'preview'
    ;(federatedSearch as jest.Mock).mockResolvedValue([])

    const response = await search(new NextRequest('https://dronewire.org/api/search?q=radar'))

    expect(response.status).toBe(200)
    expect(federatedSearch).toHaveBeenCalledWith('radar', [], 10, 'lexical')
    expect(checkBotId).not.toHaveBeenCalled()
    expect(prisma.requestRateLimit.upsert).not.toHaveBeenCalled()
  })

  it('returns 400 for an empty or whitespace-only search query', async () => {
    const response = await search(new NextRequest('https://dronewire.org/api/search?q=%20%20%20'))

    expect(response.status).toBe(400)
    expect(federatedSearch).not.toHaveBeenCalled()
  })

  it('returns the explicit federated result contract with a trimmed query', async () => {
    ;(federatedSearch as jest.Mock).mockResolvedValue([{
      entityType: 'system', id: 'system-1', title: 'KuRFS', href: '/systems/kurfs',
      snippet: 'Radar system', category: 'sensor', imageUrl: null,
      provenanceLabel: 'partially-sourced', score: 100,
    }])

    const response = await search(new NextRequest('https://dronewire.org/api/search?q=%20KuRFS%20&types=system,invalid'))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload.query).toBe('KuRFS')
    expect(payload.results[0]).toMatchObject({ entityType: 'system', provenanceLabel: 'partially-sourced', href: '/systems/kurfs' })
    expect(federatedSearch).toHaveBeenCalledWith('KuRFS', ['system'], 10, 'lexical')
  })

  it('blocks bot-classified admin login attempts', async () => {
    process.env.ADMIN_SECRET = 'admin-secret-for-test'
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: true })

    const response = await adminLogin(new NextRequest('https://dronewire.org/api/admin/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: 'guess' }),
    }))

    expect(response.status).toBe(403)
    delete process.env.ADMIN_SECRET
  })
})
