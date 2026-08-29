/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    article: { findMany: jest.fn() },
  },
}))

import { prisma } from '@/lib/db'
import { GET } from '@/app/feed.xml/route'

describe('RSS feed hardening', () => {
  it('uses an existing logo and preserves CDATA boundaries safely', async () => {
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([{
      id: 'article-1',
      title: 'Test article',
      excerpt: null,
      aiSummary: 'Safe ]]> still safe',
      sourceUrl: 'https://example.com/story',
      sourceName: 'Example',
      publishedAt: new Date('2026-08-22T00:00:00Z'),
      category: 'counter-uas',
      imageUrl: null,
    }])

    const response = await GET()
    const xml = await response.text()

    expect(xml).toContain('https://dronewire.org/images/drone-swarm-formation.jpg')
    expect(xml).toContain('Safe ]]]]><![CDATA[> still safe')
    expect(xml).not.toContain('<![CDATA[Safe ]]> still safe]]>')
  })
})
