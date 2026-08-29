/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    article: { count: jest.fn(), findFirst: jest.fn() },
    explainer: { count: jest.fn() },
    contract: { count: jest.fn() },
    rssFeed: { count: jest.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { GET } from '@/app/api/health/route'

describe('public health response', () => {
  it('does not disclose provider names or raw database errors', async () => {
    ;(prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('postgresql://user:secret@private-host/db'))
    ;(prisma.article.count as jest.Mock).mockRejectedValue(new Error('sensitive article query detail'))
    ;(prisma.explainer.count as jest.Mock).mockResolvedValue(40)
    ;(prisma.contract.count as jest.Mock).mockResolvedValue(228)
    ;(prisma.rssFeed.count as jest.Mock)
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(13)
    ;(prisma.article.findFirst as jest.Mock).mockResolvedValue({ createdAt: new Date() })

    const response = await GET()
    const body = await response.text()

    expect(body).not.toContain('Supabase')
    expect(body).not.toContain('secret')
    expect(body).not.toContain('private-host')
    expect(body).toContain('Database check failed')
  })
})
