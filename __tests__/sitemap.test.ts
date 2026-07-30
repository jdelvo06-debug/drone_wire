import type { MetadataRoute } from 'next'

// Mock prisma
const mockPrisma = {
  article: {
    findMany: jest.fn(),
  },
  system: {
    findMany: jest.fn(),
  },
  explainer: {
    findMany: jest.fn(),
  },
  contract: {
    findFirst: jest.fn(),
  },
}

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

// Import after mock
const sitemapModule = require('@/app/sitemap')
const sitemap = sitemapModule.default
const sitemapRevalidate = sitemapModule.revalidate

const ORIGINAL_SITE_URL = process.env.SITE_URL

afterEach(() => {
  jest.clearAllMocks()
  if (ORIGINAL_SITE_URL !== undefined) {
    process.env.SITE_URL = ORIGINAL_SITE_URL
  } else {
    delete process.env.SITE_URL
  }
})

describe('sitemap', () => {
  it('revalidates data-driven URLs hourly', () => {
    expect(sitemapRevalidate).toBe(3600)
  })

  it('includes canonical static routes with correct URLs', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    const urls = result.map((r: MetadataRoute.Sitemap[number]) => r.url)
    expect(urls).toContain('https://dronewire.org/')
    expect(urls).toContain('https://dronewire.org/articles')
    expect(urls).toContain('https://dronewire.org/systems')
    expect(urls).toContain('https://dronewire.org/threats')
    expect(urls).toContain('https://dronewire.org/explainers')
    expect(urls).toContain('https://dronewire.org/contracts')
    expect(urls).toContain('https://dronewire.org/about')
    expect(urls).toContain('https://dronewire.org/privacy')
  })

  it('normalizes trailing slash from SITE_URL', async () => {
    process.env.SITE_URL = 'https://dronewire.org/'
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    const urls = result.map((r: MetadataRoute.Sitemap[number]) => r.url)
    // No URL should have double slashes from the base
    expect(urls).toContain('https://dronewire.org/articles')
    expect(urls.some((u: string) => u.includes('//articles'))).toBe(false)
  })

  it('only includes published articles (not draft/archived)', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockImplementation((opts: any) => {
      // Verify the where clause filters for published
      expect(opts.where).toEqual({ status: 'published' })
      return Promise.resolve([
        { id: 'article-1', updatedAt: new Date('2025-01-01'), publishedAt: new Date('2025-01-01') },
        { id: 'article-2', updatedAt: new Date('2025-02-01'), publishedAt: new Date('2025-01-15') },
      ])
    })
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    const articleUrls = result.filter((r: any) => r.url.includes('/articles/'))
    expect(articleUrls).toHaveLength(2)
    expect(articleUrls[0].url).toBe('https://dronewire.org/articles/article-1')
    expect(articleUrls[1].url).toBe('https://dronewire.org/articles/article-2')
    // lastModified should use updatedAt
    expect(articleUrls[0].lastModified).toEqual(new Date('2025-01-01'))
  })

  it('falls back to publishedAt when updatedAt is missing for articles', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockResolvedValue([
      { id: 'a1', updatedAt: null, publishedAt: new Date('2025-03-01') },
    ])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    const articleEntry = result.find((r: any) => r.url.includes('/articles/a1'))
    expect(articleEntry).toBeDefined()
    expect(articleEntry!.lastModified).toEqual(new Date('2025-03-01'))
  })

  it('includes dynamic system and explainer URLs by slug', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([
      { slug: 'system-a', updatedAt: new Date('2025-06-01') },
    ])
    mockPrisma.explainer.findMany.mockResolvedValue([
      { slug: 'explainer-b', updatedAt: new Date('2025-06-02') },
    ])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    expect(result.some((r: any) => r.url === 'https://dronewire.org/systems/system-a')).toBe(true)
    expect(result.some((r: any) => r.url === 'https://dronewire.org/explainers/explainer-b')).toBe(true)
  })

  it('derives /contracts lastModified from newest Contract.updatedAt', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    const contractDate = new Date('2025-07-15T12:00:00Z')
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockImplementation((opts: any) => {
      // Verify ordering by updatedAt desc
      expect(opts.orderBy).toEqual({ updatedAt: 'desc' })
      return Promise.resolve({ updatedAt: contractDate })
    })

    const result = await sitemap()

    const contractsEntry = result.find((r: any) => r.url === 'https://dronewire.org/contracts')
    expect(contractsEntry).toBeDefined()
    expect(contractsEntry!.lastModified).toEqual(contractDate)
  })

  it('does NOT include /contracts/[id] detail URLs', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    const urls = result.map((r: MetadataRoute.Sitemap[number]) => r.url)
    expect(urls.some((u: string) => u.match(/\/contracts\/[^$]/))).toBe(false)
  })

  it('falls back to https://dronewire.org when SITE_URL is not set', async () => {
    delete process.env.SITE_URL
    mockPrisma.article.findMany.mockResolvedValue([])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    expect(result[0].url).toBe('https://dronewire.org/')
  })

  it('includes changeFrequency and priority without fabricating static timestamps', async () => {
    process.env.SITE_URL = 'https://dronewire.org'
    mockPrisma.article.findMany.mockResolvedValue([
      { id: 'a1', updatedAt: new Date('2025-01-01'), publishedAt: new Date('2025-01-01') },
    ])
    mockPrisma.system.findMany.mockResolvedValue([])
    mockPrisma.explainer.findMany.mockResolvedValue([])
    mockPrisma.contract.findFirst.mockResolvedValue(null)

    const result = await sitemap()

    for (const entry of result) {
      expect(entry.url).toBeDefined()
      expect(entry.changeFrequency).toBeDefined()
      expect(entry.priority).toBeGreaterThan(0)
      expect(entry.priority).toBeLessThanOrEqual(1)
    }

    const aboutEntry = result.find(
      (entry: MetadataRoute.Sitemap[number]) => entry.url === 'https://dronewire.org/about',
    )
    expect(aboutEntry?.lastModified).toBeUndefined()

    const articlesEntry = result.find(
      (entry: MetadataRoute.Sitemap[number]) => entry.url === 'https://dronewire.org/articles',
    )
    expect(articlesEntry?.lastModified).toEqual(new Date('2025-01-01'))
  })
})