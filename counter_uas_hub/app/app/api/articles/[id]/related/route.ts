import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '5')

    // Get the source article with its embedding
    const sourceArticle = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        embedding: true,
        category: true,
        tags: {
          select: {
            tag: {
              select: { id: true }
            }
          }
        }
      }
    })

    if (!sourceArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Get candidate articles (published, not the same article)
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
        embedding: true,
        tags: {
          select: {
            tag: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: 50, // Get more candidates for better matching
    })

    let relatedArticles: typeof candidates[number][] = []

    // If source article has an embedding, use cosine similarity
    if (sourceArticle.embedding && sourceArticle.embedding.length > 0) {
      const articlesWithSimilarity = candidates
        .filter(article => article.embedding && article.embedding.length > 0)
        .map(article => ({
          ...article,
          similarity: cosineSimilarity(
            sourceArticle.embedding as number[],
            article.embedding as number[]
          )
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)

      relatedArticles = articlesWithSimilarity
    } else {
      // Fallback: match by category and tags
      const sourceTagIds = sourceArticle.tags.map(t => t.tag.id)

      const scoredArticles = candidates.map(article => {
        let score = 0

        // Category match
        if (article.category === sourceArticle.category) {
          score += 2
        }

        // Tag overlap
        const articleTagIds = article.tags.map(t => t.tag.id)
        const tagOverlap = sourceTagIds.filter(id => articleTagIds.includes(id)).length
        score += tagOverlap

        return { ...article, similarity: score }
      })
      .filter(a => a.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

      relatedArticles = scoredArticles
    }

    // Format response
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
    console.error('Error fetching related articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch related articles' },
      { status: 500 }
    )
  }
}
