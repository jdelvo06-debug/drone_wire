import { prisma } from '@/lib/db'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import StatsCards from '@/components/admin/stats-cards'
import Charts from '@/components/admin/charts'
import RecentActivity from '@/components/admin/recent-activity'
import DashboardHeader from '@/components/admin/dashboard-header'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getStats() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Core counts
  const [
    totalArticles,
    publishedArticles,
    pendingArticles,
    totalExplainers,
    totalSubscribers,
    totalContacts,
    totalFeeds,
    totalTags,
    articlesWithAI,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'pending' } }),
    prisma.explainer.count(),
    prisma.newsletterSubscriber.count(),
    prisma.contactSubmission.count(),
    prisma.rssFeed.count(),
    prisma.tag.count(),
    prisma.article.count({ where: { aiSummary: { not: null } } }),
  ])

  const aiProcessingRate = totalArticles > 0
    ? Math.round((articlesWithAI / totalArticles) * 100)
    : 0

  // Articles by source
  const articlesBySource = await prisma.article.groupBy({
    by: ['sourceName'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  })

  // Articles by category
  const articlesByCategory = await prisma.article.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  // Top tags
  const topTags = await prisma.articleTag.groupBy({
    by: ['tagId'],
    _count: { articleId: true },
    orderBy: { _count: { articleId: 'desc' } },
    take: 10,
  })

  const tagIds = topTags.map((t) => t.tagId)
  const tags = await prisma.tag.findMany({
    where: { id: { in: tagIds } },
  })
  const tagMap = new Map(tags.map((t) => [t.id, t.name]))

  const topTagsWithNames = topTags.map((t) => ({
    name: tagMap.get(t.tagId) || 'Unknown',
    count: t._count.articleId,
  }))

  // Articles over time
  const articlesLast7Days = await prisma.article.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  })

  const dailyCounts: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    dailyCounts[dateStr] = 0
  }

  articlesLast7Days.forEach((article) => {
    const dateStr = article.createdAt.toISOString().split('T')[0]
    if (dailyCounts[dateStr] !== undefined) {
      dailyCounts[dateStr]++
    }
  })

  const articlesOverTime = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    articles: count,
  }))

  // Confidence distribution
  const articlesWithConfidence = await prisma.article.findMany({
    where: { confidence: { not: null } },
    select: { confidence: true },
  })

  const confidenceDistribution = {
    high: articlesWithConfidence.filter((a) => (a.confidence ?? 0) >= 0.8).length,
    medium: articlesWithConfidence.filter((a) => (a.confidence ?? 0) >= 0.5 && (a.confidence ?? 0) < 0.8).length,
    low: articlesWithConfidence.filter((a) => (a.confidence ?? 0) < 0.5).length,
  }

  // Recent articles
  const recentArticles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      sourceName: true,
      status: true,
      createdAt: true,
    },
  })

  // Subscriber growth
  const subscribersLast30Days = await prisma.newsletterSubscriber.findMany({
    where: { subscriptionDate: { gte: thirtyDaysAgo } },
    select: { subscriptionDate: true },
  })

  const weeklySubscribers: Record<string, number> = {
    'Week 1': 0,
    'Week 2': 0,
    'Week 3': 0,
    'Week 4': 0,
  }

  subscribersLast30Days.forEach((sub) => {
    const weeksAgo = Math.floor((now.getTime() - sub.subscriptionDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    if (weeksAgo < 4) {
      const weekStr = `Week ${4 - weeksAgo}`
      if (weeklySubscribers[weekStr] !== undefined) {
        weeklySubscribers[weekStr]++
      }
    }
  })

  const subscriberGrowth = Object.entries(weeklySubscribers).map(([week, count]) => ({
    week,
    subscribers: count,
  }))

  // Feed health
  const feeds = await prisma.rssFeed.findMany({
    select: {
      isActive: true,
      errorCount: true,
    },
  })

  const feedHealth = {
    active: feeds.filter((f) => f.isActive).length,
    inactive: feeds.filter((f) => !f.isActive).length,
    withErrors: feeds.filter((f) => f.errorCount > 0).length,
  }

  return {
    overview: {
      totalArticles,
      publishedArticles,
      pendingArticles,
      totalExplainers,
      totalSubscribers,
      totalContacts,
      totalFeeds,
      totalTags,
      aiProcessingRate,
    },
    articlesBySource: articlesBySource.map((s) => ({
      name: s.sourceName,
      count: s._count.id,
    })),
    articlesByCategory: articlesByCategory.map((c) => ({
      name: c.category,
      count: c._count.id,
    })),
    topTags: topTagsWithNames,
    articlesOverTime,
    confidenceDistribution,
    recentArticles: recentArticles.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
    })),
    subscriberGrowth,
    feedHealth,
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] rounded-lg" />
        ))}
      </div>
    </div>
  )
}

async function Dashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <StatsCards overview={stats.overview} />

      <Charts
        articlesBySource={stats.articlesBySource}
        articlesByCategory={stats.articlesByCategory}
        topTags={stats.topTags}
        articlesOverTime={stats.articlesOverTime}
        confidenceDistribution={stats.confidenceDistribution}
        subscriberGrowth={stats.subscriberGrowth}
      />

      <RecentActivity
        recentArticles={stats.recentArticles}
        feedHealth={stats.feedHealth}
      />
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <DashboardHeader />

      <Suspense fallback={<LoadingSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}
