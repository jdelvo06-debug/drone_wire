jest.mock('@/lib/db', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}))

jest.mock('@/lib/services/content-extractor', () => ({
  extractContentFromUrl: jest.fn(),
}))

import { prisma } from '@/lib/db'
import { extractContentFromUrl } from '@/lib/services/content-extractor'
import { reprocessArticlesForImages } from '@/lib/services/image-reprocessor'

describe('image reprocessing quality gate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([{
      id: 'article-1',
      title: 'Article with an uncertain image',
      sourceUrl: 'https://news.example/article',
      imageUrl: null,
    }])
  })

  it('does not persist an image that requires manual review', async () => {
    ;(extractContentFromUrl as jest.Mock).mockResolvedValue({
      content: 'Trusted article content',
      imageUrl: 'https://cdn.example.com/possible-image.jpg',
      wordCount: 3,
      quality: 'manual-review-required',
      qualityReasons: ['thin-content'],
      extractionMethod: 'semantic-selector',
      imageQuality: 'usable',
      imageReasons: ['verified-jpeg-1200x675'],
    })

    const result = await reprocessArticlesForImages(1)

    expect(result).toMatchObject({ processed: 1, updated: 0, failed: 0 })
    expect(prisma.article.update).not.toHaveBeenCalled()
  })

  it('persists an image only after it is classified usable', async () => {
    ;(extractContentFromUrl as jest.Mock).mockResolvedValue({
      content: 'Trusted article content',
      imageUrl: 'https://cdn.example.com/article-image.jpg',
      wordCount: 3,
      quality: 'clean',
      qualityReasons: [],
      extractionMethod: 'semantic-selector',
      imageQuality: 'usable',
      imageReasons: ['image/jpeg'],
    })
    ;(prisma.article.update as jest.Mock).mockResolvedValue({})

    const result = await reprocessArticlesForImages(1)

    expect(result).toMatchObject({ processed: 1, updated: 1, failed: 0 })
    expect(prisma.article.update).toHaveBeenCalledWith({
      where: { id: 'article-1' },
      data: { imageUrl: 'https://cdn.example.com/article-image.jpg' },
    })
  })
})
