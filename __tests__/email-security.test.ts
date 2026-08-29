/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    article: { findMany: jest.fn(), update: jest.fn() },
    newsletterSubscriber: { findMany: jest.fn(), update: jest.fn() },
  },
}))

jest.mock('@/lib/services/email', () => ({
  sendEmail: jest.fn(),
}))

import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/services/email'
import { getAlertEmailHtml, sendArticleAlert } from '@/lib/services/alerts'

describe('alert email rendering', () => {
  it('escapes external article fields and excludes unsafe URLs', () => {
    const html = getAlertEmailHtml({
      id: 'article-1',
      title: '<img src=x onerror=alert(1)>',
      aiSummary: '<script>alert(1)</script>',
      whyItMatters: 'A & B',
      keyPoints: ['<b>Injected</b>'],
      category: '<svg onload=alert(1)>',
      confidence: 0.9,
      sourceName: '<em>Source</em>',
      sourceUrl: 'javascript:alert(1)',
      imageUrl: 'data:text/html,bad',
      publishedAt: new Date('2026-08-22T00:00:00Z'),
    }, 'Test <User>', 'https://dronewire.org/unsubscribe?token=signed')

    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img src=x')
    expect(html).not.toContain('<svg')
    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('data:text/html')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('https://dronewire.org/unsubscribe?token=signed')
  })

  it('returns generic delivery failure codes without subscriber identifiers', async () => {
    process.env.UNSUBSCRIBE_SECRET = 'test-alert-token-secret'
    ;(prisma.newsletterSubscriber.findMany as jest.Mock).mockResolvedValue([{
      id: 'private-subscriber-id',
      email: 'recipient@example.test',
      firstName: null,
      preferenceTokenRevision: 0,
      minConfidence: 0.8,
      alertCategories: [],
    }])
    ;(sendEmail as jest.Mock).mockResolvedValue({ success: false })
    ;(prisma.article.update as jest.Mock).mockResolvedValue({})

    const result = await sendArticleAlert({
      id: 'article-1',
      title: 'Test article',
      aiSummary: 'Summary',
      whyItMatters: null,
      keyPoints: [],
      category: 'counter-uas',
      confidence: 0.9,
      sourceName: 'Source',
      sourceUrl: 'https://example.test/source',
      imageUrl: null,
      publishedAt: new Date('2026-08-22T00:00:00Z'),
    })

    expect(result.errors).toEqual(['provider-send-failed'])
    expect(JSON.stringify(result)).not.toContain('private-subscriber-id')
  })
})
