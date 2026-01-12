import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface HealthCheck {
  name: string
  status: 'ok' | 'error'
  message?: string
  latency?: number
}

export async function GET() {
  const checks: HealthCheck[] = []
  const startTime = Date.now()

  // 1. Database Connection Check
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.push({
      name: 'database',
      status: 'ok',
      message: 'Connected to Supabase',
      latency: Date.now() - dbStart,
    })
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'error',
      message: error instanceof Error ? error.message : 'Connection failed',
    })
  }

  // 2. Articles Count Check
  try {
    const dbStart = Date.now()
    const count = await prisma.article.count()
    checks.push({
      name: 'articles',
      status: count > 0 ? 'ok' : 'error',
      message: `${count} articles in database`,
      latency: Date.now() - dbStart,
    })
  } catch (error) {
    checks.push({
      name: 'articles',
      status: 'error',
      message: error instanceof Error ? error.message : 'Query failed',
    })
  }

  // 3. Explainers Count Check
  try {
    const dbStart = Date.now()
    const count = await prisma.explainer.count()
    checks.push({
      name: 'explainers',
      status: count > 0 ? 'ok' : 'error',
      message: `${count} explainers in database`,
      latency: Date.now() - dbStart,
    })
  } catch (error) {
    checks.push({
      name: 'explainers',
      status: 'error',
      message: error instanceof Error ? error.message : 'Query failed',
    })
  }

  // 4. Contracts Count Check
  try {
    const dbStart = Date.now()
    const count = await prisma.contract.count()
    checks.push({
      name: 'contracts',
      status: 'ok',
      message: `${count} contracts in database`,
      latency: Date.now() - dbStart,
    })
  } catch (error) {
    checks.push({
      name: 'contracts',
      status: 'error',
      message: error instanceof Error ? error.message : 'Query failed',
    })
  }

  // 5. RSS Feeds Check
  try {
    const dbStart = Date.now()
    const activeFeeds = await prisma.rssFeed.count({ where: { isActive: true } })
    const totalFeeds = await prisma.rssFeed.count()
    checks.push({
      name: 'rss_feeds',
      status: activeFeeds > 0 ? 'ok' : 'error',
      message: `${activeFeeds}/${totalFeeds} active feeds`,
      latency: Date.now() - dbStart,
    })
  } catch (error) {
    checks.push({
      name: 'rss_feeds',
      status: 'error',
      message: error instanceof Error ? error.message : 'Query failed',
    })
  }

  // 6. Recent Article Check (pipeline health)
  try {
    const dbStart = Date.now()
    const recentArticle = await prisma.article.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, title: true },
    })

    if (recentArticle) {
      const hoursSinceLastArticle = Math.round(
        (Date.now() - new Date(recentArticle.createdAt).getTime()) / (1000 * 60 * 60)
      )
      checks.push({
        name: 'pipeline',
        status: hoursSinceLastArticle < 48 ? 'ok' : 'error',
        message: `Last article: ${hoursSinceLastArticle}h ago`,
        latency: Date.now() - dbStart,
      })
    } else {
      checks.push({
        name: 'pipeline',
        status: 'error',
        message: 'No articles found',
      })
    }
  } catch (error) {
    checks.push({
      name: 'pipeline',
      status: 'error',
      message: error instanceof Error ? error.message : 'Query failed',
    })
  }

  // Calculate overall status
  const allPassed = checks.every((c) => c.status === 'ok')
  const totalLatency = Date.now() - startTime

  const response = {
    status: allPassed ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    totalLatency: `${totalLatency}ms`,
    checks,
  }

  return NextResponse.json(response, {
    status: allPassed ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
