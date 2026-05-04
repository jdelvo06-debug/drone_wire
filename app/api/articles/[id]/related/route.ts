import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { getRelatedArticles as getRelatedByEmbedding } from '@/lib/services/semantic-search'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params
    const limit = Math.min(20, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') || '5', 10)))

    // Verify article exists
    const sourceArticle = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        category: true,
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    })

    if (!sourceArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Try pgvector-powered related articles first
    const pgvectorResults = await getRelatedByEmbedding(articleId, limit)
    if (pgvectorResults.length > 0) {
      return NextResponse.json(
        pgvectorResults.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.aiSummary,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
          category: article.category,
          sourceName: article.sourceName,
          tags: [] as string[],
        }))
      )
    }

    // Fallback: category + tag matching (when pgvector is not enabled)
    const sourceTagIds = sourceArticle.tags.map(t => t.tag.id)

    const candidates = await prisma.article.findMany({
      where: {
        id: { not: articleId },
        status: 'published',
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        aiSummary: true,
        imageUrl: true,
        publishedAt: true,
        category: true,
        sourceName: true,
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    })

    const relatedArticles = candidates.map(article => {
      let score = 0
      if (article.category === sourceArticle.category) score += 2
      const articleTagIds = article.tags.map(t => t.tag.id)
      score += sourceTagIds.filter(id => articleTagIds.includes(id)).length
      return { ...article, score }
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

    const response = relatedArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || article.aiSummary,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt,
      category: article.category,
      sourceName: article.sourceName,
      tags: article.tags.map(t => t.tag.name),
    }))

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Error fetching related articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related articles' },
      { status: 500 }
    )
  }
}
