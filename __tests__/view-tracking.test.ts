/** @jest-environment node */

jest.mock('botid/server', () => ({
  checkBotId: jest.fn(),
}))

jest.mock('@/lib/db', () => ({
  prisma: {
    requestRateLimit: { upsert: jest.fn() },
    article: { update: jest.fn() },
    system: { update: jest.fn() },
    explainer: { update: jest.fn() },
  },
}))

import { NextRequest } from 'next/server'
import { checkBotId } from 'botid/server'
import { prisma } from '@/lib/db'
import { POST } from '@/app/api/views/route'

function request(body: unknown) {
  return new NextRequest('https://dronewire.org/api/views', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-vercel-forwarded-for': '203.0.113.4',
    },
    body: JSON.stringify(body),
  })
}

describe('idempotent view tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.VERCEL_ENV = 'production'
    process.env.RATE_LIMIT_SECRET = 'test-rate-limit-secret'
    ;(checkBotId as jest.Mock).mockResolvedValue({ isBot: false })
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockImplementation(({ create }: { create: { route: string } }) => (
      Promise.resolve({ count: create.route.startsWith('view:') ? 1 : 1 })
    ))
    ;(prisma.article.update as jest.Mock).mockResolvedValue({})
  })

  afterEach(() => {
    delete process.env.VERCEL_ENV
    delete process.env.RATE_LIMIT_SECRET
  })

  it('increments a valid entity once', async () => {
    const response = await POST(request({ entityType: 'article', entityId: 'article-1' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true, tracked: true })
    expect(prisma.article.update).toHaveBeenCalledWith({
      where: { id: 'article-1' },
      data: { views: { increment: 1 } },
    })
  })

  it('returns a successful no-op in Preview without protection or database writes', async () => {
    process.env.VERCEL_ENV = 'preview'

    const response = await POST(request({ entityType: 'article', entityId: 'article-1' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true, tracked: false })
    expect(checkBotId).not.toHaveBeenCalled()
    expect(prisma.requestRateLimit.upsert).not.toHaveBeenCalled()
    expect(prisma.article.update).not.toHaveBeenCalled()
    expect(prisma.system.update).not.toHaveBeenCalled()
    expect(prisma.explainer.update).not.toHaveBeenCalled()
  })

  it('treats a repeat from the same client and day as a successful no-op', async () => {
    ;(prisma.requestRateLimit.upsert as jest.Mock).mockImplementation(({ create }: { create: { route: string } }) => (
      Promise.resolve({ count: create.route.startsWith('view:') ? 2 : 1 })
    ))

    const response = await POST(request({ entityType: 'article', entityId: 'article-1' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true, tracked: false })
    expect(prisma.article.update).not.toHaveBeenCalled()
  })

  it('rejects unsupported entity types without updating data', async () => {
    const response = await POST(request({ entityType: 'contract', entityId: 'contract-1' }))

    expect(response.status).toBe(400)
    expect(prisma.article.update).not.toHaveBeenCalled()
    expect(prisma.system.update).not.toHaveBeenCalled()
    expect(prisma.explainer.update).not.toHaveBeenCalled()
  })
})
