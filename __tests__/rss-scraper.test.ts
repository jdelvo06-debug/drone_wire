// Mock rss-parser before importing the module under test
const mockParseURL = jest.fn()
jest.mock('rss-parser', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      parseString: mockParseURL,
    })),
  }
})

const makeXmlResponse = () => ({
  status: 200,
  ok: true,
  headers: { get: (name: string) => name.toLowerCase() === 'content-type' ? 'application/rss+xml' : null },
  text: async () => '<rss/>',
})
const mockFetchPinnedExternal = jest.fn().mockResolvedValue(makeXmlResponse())
jest.mock('@/lib/services/content-extractor', () => ({
  fetchPinnedExternal: (...args: unknown[]) => mockFetchPinnedExternal(...args),
}))

// Mock prisma
const mockPrisma = {
  rssFeed: {
    findMany: jest.fn(),
    update: jest.fn(),
  },
  article: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}
jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock relevance filter — allow everything by default, controllable per test
const mockIsRelevantContent = jest.fn().mockReturnValue(true)
jest.mock('@/lib/constants/rss-feeds', () => ({
  isRelevantContent: mockIsRelevantContent,
}))

// Mock image URL check
jest.mock('@/lib/constants/images', () => ({
  isImageUrl: jest.fn().mockReturnValue(true),
}))

// Mock categorizeArticle
jest.mock('@/lib/utils', () => ({
  categorizeArticle: jest.fn().mockReturnValue('counter-uas'),
}))

// Import after mocks
const {
  scrapeRssFeeds,
  chunkArray,
  FEED_CONCURRENCY,
} = require('@/lib/services/rss-scraper')

afterEach(() => {
  jest.clearAllMocks()
  mockFetchPinnedExternal.mockResolvedValue(makeXmlResponse())
})

describe('chunkArray', () => {
  it('splits an array into chunks of the given size', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns a single chunk when items fit within limit', () => {
    expect(chunkArray([1, 2, 3], 5)).toEqual([[1, 2, 3]])
  })

  it('returns empty array for empty input', () => {
    expect(chunkArray([], 3)).toEqual([])
  })

  it('throws for limit < 1', () => {
    expect(() => chunkArray([1], 0)).toThrow('limit must be >= 1')
  })
})

describe('scrapeRssFeeds', () => {
  function makeFeed(id: string, name: string, url: string, errorCount = 0) {
    return { id, name, url, errorCount }
  }

  function makeItem(title: string, link: string, snippet = 'drone counter-UAS content') {
    return { title, link, contentSnippet: snippet, content: snippet, isoDate: '2025-01-01T00:00:00Z' }
  }

  it('returns empty result when no active feeds exist', async () => {
    mockPrisma.rssFeed.findMany.mockResolvedValue([])

    const result = await scrapeRssFeeds()

    expect(result.feedsProcessed).toBe(0)
    expect(result.articlesAdded).toBe(0)
    expect(result.errors).toHaveLength(0)
    expect(mockParseURL).not.toHaveBeenCalled()
  })

  it('fetches feeds concurrently without exceeding the configured limit', async () => {
    const feeds = Array.from({ length: FEED_CONCURRENCY + 2 }, (_, index) =>
      makeFeed(
        `f${index + 1}`,
        `Feed ${index + 1}`,
        `http://example.com/${index + 1}`,
      ),
    )
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })

    let activeFetches = 0
    let maxActiveFetches = 0
    mockParseURL.mockImplementation(async () => {
      activeFetches++
      maxActiveFetches = Math.max(maxActiveFetches, activeFetches)
      await new Promise((resolve) => setTimeout(resolve, 10))
      activeFetches--
      return { items: [] }
    })

    await scrapeRssFeeds()

    expect(mockParseURL).toHaveBeenCalledTimes(feeds.length)
    expect(maxActiveFetches).toBe(FEED_CONCURRENCY)
  })

  it('processes successful feeds serially for DB dedupe safety', async () => {
    const feeds = [makeFeed('f1', 'Feed 1', 'http://example.com/1')]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })

    const items = [makeItem('Article A', 'http://src/a'), makeItem('Article B', 'http://src/b')]
    mockParseURL.mockResolvedValue({ items })

    mockPrisma.article.findFirst
      .mockResolvedValueOnce(null) // Article A doesn't exist
      .mockResolvedValueOnce({ id: 'existing' }) // Article B exists

    const result = await scrapeRssFeeds()

    expect(result.feedsProcessed).toBe(1)
    expect(result.articlesAdded).toBe(1)
    expect(result.articlesSkipped).toBe(1)
    expect(mockPrisma.article.create).toHaveBeenCalledTimes(1)
    // Verify the created article has the right sourceUrl
    const createCall = mockPrisma.article.create.mock.calls[0][0]
    expect(createCall.data.sourceUrl).toBe('http://src/a')
    expect(createCall.data.status).toBe('pending_ai')
  })

  it('records errors for feeds that fail to fetch/parse', async () => {
    const feeds = [
      makeFeed('f1', 'Feed 1', 'http://example.com/1'),
      makeFeed('f2', 'Feed 2', 'http://example.com/2'),
    ]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 1 })

    mockParseURL
      .mockRejectedValueOnce(new Error('Network timeout'))
      .mockResolvedValueOnce({ items: [] })

    const result = await scrapeRssFeeds()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].feed).toBe('Feed 1')
    expect(result.errors[0].error).toBe('Network timeout')
    expect(result.feedsProcessed).toBe(1) // only Feed 2 succeeded
  })

  it('rejects unsafe feed destinations before parsing', async () => {
    const feeds = [makeFeed('f1', 'Unsafe Feed', 'http://127.0.0.1/feed')]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 1 })
    mockFetchPinnedExternal.mockResolvedValueOnce(null)

    const result = await scrapeRssFeeds()

    expect(result.errors).toEqual([{ feed: 'Unsafe Feed', error: 'Feed URL is not a safe external destination' }])
    expect(mockParseURL).not.toHaveBeenCalled()
  })

  it('uses Unknown error for non-Error parser rejections', async () => {
    const feeds = [makeFeed('f1', 'Feed 1', 'http://example.com/1')]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 1 })
    mockParseURL.mockRejectedValueOnce('timeout')

    const result = await scrapeRssFeeds()

    expect(result.errors).toEqual([{ feed: 'Feed 1', error: 'Unknown error' }])
  })

  it('preserves feed-order errors and original processed-count semantics', async () => {
    const feeds = [
      makeFeed('f1', 'Parse Failure', 'http://example.com/1'),
      makeFeed('f2', 'DB Failure', 'http://example.com/2'),
    ]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 1 })
    mockParseURL
      .mockRejectedValueOnce(new Error('Parse error'))
      .mockResolvedValueOnce({ items: [makeItem('Article A', 'http://src/a')] })
    mockPrisma.article.findFirst.mockRejectedValueOnce(new Error('Database error'))

    const result = await scrapeRssFeeds()

    expect(result.errors.map((error: { feed: string }) => error.feed)).toEqual([
      'Parse Failure',
      'DB Failure',
    ])
    expect(result.feedsProcessed).toBe(1)
  })

  it('increments errorCount and disables feeds after 5 errors', async () => {
    const feeds = [makeFeed('f1', 'Failing Feed', 'http://example.com/1', 4)]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    // First update increments errorCount to 5
    mockPrisma.rssFeed.update
      .mockResolvedValueOnce({ errorCount: 5 })
      .mockResolvedValueOnce({ errorCount: 5 })

    mockParseURL.mockRejectedValue(new Error('Connection refused'))

    const result = await scrapeRssFeeds()

    expect(result.errors).toHaveLength(1)
    // First update: increment errorCount
    expect(mockPrisma.rssFeed.update).toHaveBeenCalledWith({
      where: { id: 'f1' },
      data: { lastChecked: expect.any(Date), errorCount: { increment: 1 } },
    })
    // Second update: disable the feed
    expect(mockPrisma.rssFeed.update).toHaveBeenCalledWith({
      where: { id: 'f1' },
      data: { isActive: false },
    })
  })

  it('respects relevance filtering — skips irrelevant articles', async () => {
    const feeds = [makeFeed('f1', 'Feed 1', 'http://example.com/1')]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })

    const items = [
      makeItem('Relevant Article', 'http://src/relevant'),
      makeItem('Irrelevant Article', 'http://src/irrelevant', 'cooking recipe pasta'),
    ]
    mockParseURL.mockResolvedValue({ items })

    mockIsRelevantContent
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)

    const result = await scrapeRssFeeds()

    expect(result.articlesAdded).toBe(1)
    expect(result.articlesSkipped).toBe(1) // irrelevant one skipped
    expect(mockPrisma.article.create).toHaveBeenCalledTimes(1)
  })

  it('resets errorCount to 0 on successful feed processing', async () => {
    const feeds = [makeFeed('f1', 'Feed 1', 'http://example.com/1', 3)]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })

    mockParseURL.mockResolvedValue({ items: [] })

    await scrapeRssFeeds()

    // Verify success update resets errorCount to 0
    const successUpdate = mockPrisma.rssFeed.update.mock.calls.find(
      (c: any[]) => c[0].data.errorCount === 0
    )
    expect(successUpdate).toBeDefined()
    expect(successUpdate[0].data.lastSuccess).toBeInstanceOf(Date)
  })

  it('handles mixed success and failure across multiple feeds', async () => {
    const feeds = [
      makeFeed('f1', 'Feed 1', 'http://example.com/1'),
      makeFeed('f2', 'Feed 2', 'http://example.com/2'),
      makeFeed('f3', 'Feed 3', 'http://example.com/3'),
    ]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })

    mockParseURL
      .mockResolvedValueOnce({ items: [makeItem('A1', 'http://a/1')] })
      .mockRejectedValueOnce(new Error('Parse error'))
      .mockResolvedValueOnce({ items: [makeItem('A2', 'http://a/2')] })

    mockPrisma.article.findFirst.mockResolvedValue(null)

    const result = await scrapeRssFeeds()

    expect(result.feedsProcessed).toBe(2) // f1 and f3
    expect(result.articlesAdded).toBe(2)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].feed).toBe('Feed 2')
  })

  it('does not call setTimeout for a 1-second delay between feeds', async () => {
    const feeds = [makeFeed('f1', 'Feed 1', 'http://example.com/1')]
    mockPrisma.rssFeed.findMany.mockResolvedValue(feeds)
    mockPrisma.rssFeed.update.mockResolvedValue({ errorCount: 0 })
    mockParseURL.mockResolvedValue({ items: [] })

    // Spy on setTimeout to ensure no 1000ms delay is used
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout')

    await scrapeRssFeeds()

    // setTimeout may be called by internals, but no call should have a 1000ms delay
    const delayCalls = setTimeoutSpy.mock.calls.filter((c) => c[1] === 1000)
    expect(delayCalls).toHaveLength(0)

    setTimeoutSpy.mockRestore()
  })
})
