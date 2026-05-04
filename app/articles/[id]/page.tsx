import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getRelatedArticles as getRelatedByEmbedding } from '@/lib/services/semantic-search'

export const dynamic = 'force-dynamic'
import ArticleContent from '@/components/articles/article-content'
import ArticleSidebar from '@/components/articles/article-sidebar'

interface ArticlePageProps {
  params: {
    id: string
  }
}

// Cache the article fetch to prevent duplicate queries between generateMetadata and page render
const getArticle = cache(async (id: string) => {
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

  // View tracking is now handled client-side in ArticleContent component
  // to avoid race conditions and duplicate counting

  return {
    ...article,
    tags: article.tags.map((at) => at.tag.name),
  }
})


async function getTrendingTopics(limit = 5) {
  // Get tags with article counts, ordered by count
  const tagsWithCounts = await prisma.tag.findMany({
    select: {
      name: true,
      _count: {
        select: { articles: true },
      },
    },
    orderBy: {
      articles: { _count: 'desc' },
    },
    take: limit,
  })

  return tagsWithCounts.map((tag) => ({
    name: tag.name,
    count: tag._count.articles,
  }))
}

async function getRelatedExplainers(category: string, limit = 3) {
  // Map article categories to explainer categories
  const categoryMap: Record<string, string[]> = {
    'counter-uas': ['countermeasures', 'systems'],
    'drone-warfare': ['threats', 'systems'],
    'contracts': ['systems', 'countermeasures'],
    'policy': ['policy'],
    'general': ['systems', 'countermeasures', 'threats'],
  }

  const explainerCategories = categoryMap[category] || ['systems', 'countermeasures']

  const explainers = await prisma.explainer.findMany({
    where: {
      category: { in: explainerCategories },
    },
    orderBy: { views: 'desc' },
    take: limit,
    select: {
      slug: true,
      title: true,
      difficulty: true,
      readTime: true,
      category: true,
    },
  })

  return explainers
}

async function getRelatedArticles(articleId: string, category: string, limit = 3) {
  // Try pgvector-powered related articles first
  const pgvectorResults = await getRelatedByEmbedding(articleId, limit)
  if (pgvectorResults.length > 0) {
    return pgvectorResults.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || article.aiSummary,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt,
      category: article.category,
    }))
  }

  // Fallback: category + tag matching (when pgvector is not yet enabled)
  const sourceArticle = await prisma.article.findUnique({
    where: { id: articleId },
    select: { tags: { select: { tagId: true } } },
  })

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
      tags: { select: { tagId: true } },
    },
  })

  const sourceTagIds = sourceArticle?.tags.map(t => t.tagId) || []

  const relatedArticles = candidates.map(article => {
    let score = 0
    if (article.category === category) score += 2
    const articleTagIds = article.tags.map(t => t.tagId)
    score += sourceTagIds.filter(id => articleTagIds.includes(id)).length
    return { ...article, score }
  })
  .filter(a => a.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)

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

  const [relatedArticles, relatedExplainers, trendingTopics] = await Promise.all([
    getRelatedArticles(params.id, article.category),
    getRelatedExplainers(article.category),
    getTrendingTopics(),
  ])

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
            <ArticleSidebar article={articleData} relatedArticles={relatedArticles} relatedExplainers={relatedExplainers} trendingTopics={trendingTopics} />
          </div>
        </div>
      </div>
    </div>
  )
}
