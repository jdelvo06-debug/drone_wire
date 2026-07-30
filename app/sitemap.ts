import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

// Refresh data-driven URLs without querying Prisma on every crawler request.
export const revalidate = 3600

function getBaseUrl(): string {
  const raw = process.env.SITE_URL || 'https://dronewire.org'
  return raw.replace(/\/+$/, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  // --- Static routes -------------------------------------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/systems`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/threats`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explainers`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contracts`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  const [articles, systems, explainers, newestContract] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.system.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.explainer.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.contract.findFirst({
      select: { updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ])

  // --- Dynamic article URLs (only published) -------------------------------
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: article.updatedAt || article.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // --- Dynamic system URLs -------------------------------------------------
  const systemUrls: MetadataRoute.Sitemap = systems.map((system) => ({
    url: `${baseUrl}/systems/${system.slug}`,
    lastModified: system.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // --- Dynamic explainer URLs ----------------------------------------------
  const explainerUrls: MetadataRoute.Sitemap = explainers.map((explainer) => ({
    url: `${baseUrl}/explainers/${explainer.slug}`,
    lastModified: explainer.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const newestDate = (dates: Array<Date | null | undefined>) => {
    const timestamps = dates
      .filter((date): date is Date => date instanceof Date)
      .map((date) => date.getTime())
    return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined
  }

  const listingDates = {
    articles: newestDate(articles.flatMap((article) => [article.updatedAt, article.publishedAt])),
    systems: newestDate(systems.map((system) => system.updatedAt)),
    explainers: newestDate(explainers.map((explainer) => explainer.updatedAt)),
    contracts: newestContract?.updatedAt,
  }

  const setStaticLastModified = (path: string, lastModified?: Date) => {
    if (!lastModified) return
    const entry = staticRoutes.find((route) => route.url === `${baseUrl}${path}`)
    if (entry) entry.lastModified = lastModified
  }

  setStaticLastModified('/articles', listingDates.articles)
  setStaticLastModified('/systems', listingDates.systems)
  setStaticLastModified('/explainers', listingDates.explainers)
  setStaticLastModified('/contracts', listingDates.contracts)
  setStaticLastModified(
    '/',
    newestDate(Object.values(listingDates)),
  )

  return [...staticRoutes, ...articleUrls, ...systemUrls, ...explainerUrls]
}