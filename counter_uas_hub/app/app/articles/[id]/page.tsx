import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ArticleContent from '@/components/articles/article-content'
import ArticleSidebar from '@/components/articles/article-sidebar'

interface ArticlePageProps {
  params: {
    id: string
  }
}

async function getArticle(id: string) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!article) return null

  // Increment view count (fire and forget)
  prisma.article.update({
    where: { id },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  return {
    ...article,
    tags: article.tags.map((at) => at.tag.name),
  }
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0

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

async function getRelatedArticles(articleId: string, category: string, limit = 3) {
  // Get source article embedding
  const sourceArticle = await prisma.article.findUnique({
    where: { id: articleId },
    select: { embedding: true, tags: { select: { tagId: true } } },
  })

  // Get candidate articles
  const candidates = await prisma.article.findMany({
    where: {
      id: { not: articleId },
      status: 'published',
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    select: {
      id: true,
      title: true,
      excerpt: true,
      aiSummary: true,
      imageUrl: true,
      publishedAt: true,
      category: true,
      embedding: true,
      tags: { select: { tagId: true } },
    },
  })

  let relatedArticles: typeof candidates

  // Use embedding similarity if available
  if (sourceArticle?.embedding && sourceArticle.embedding.length > 0) {
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
    // Fallback: category + tag matching
    const sourceTagIds = sourceArticle?.tags.map(t => t.tagId) || []

    const scoredArticles = candidates.map(article => {
      let score = 0
      if (article.category === category) score += 2
      const articleTagIds = article.tags.map(t => t.tagId)
      score += sourceTagIds.filter(id => articleTagIds.includes(id)).length
      return { ...article, similarity: score }
    })
    .filter(a => a.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)

    relatedArticles = scoredArticles
  }

  // Return formatted articles
  return relatedArticles.map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || article.aiSummary,
    imageUrl: article.imageUrl,
    publishedAt: article.publishedAt,
    category: article.category,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.id)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.title,
    description: article.excerpt || article.aiSummary || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.aiSummary || undefined,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.aiSummary || undefined,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.id)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(params.id, article.category)

  // Transform to match component interface
  const articleData = {
    id: article.id,
    title: article.title,
    content: article.content || '',
    excerpt: article.excerpt || '',
    sourceName: article.sourceName,
    sourceUrl: article.sourceUrl || '#',
    publishedAt: article.publishedAt || new Date(),
    imageUrl: article.imageUrl || undefined,
    category: article.category,
    tags: article.tags,
    aiSummary: article.aiSummary || undefined,
    whyItMatters: article.whyItMatters || undefined,
    keyPoints: article.keyPoints || undefined,
    author: 'DroneWire Intelligence',
    readTime: article.readTime || 5,
    views: article.views,
    confidence: article.confidence || undefined,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ArticleContent article={articleData} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ArticleSidebar article={articleData} relatedArticles={relatedArticles} />
          </div>
        </div>
      </div>
    </div>
  )
}
