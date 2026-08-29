import { ARTICLE_CATEGORIES } from '@/lib/article-category'

export interface DigestArticle {
  id: string
  title: string
  href: string
  sourceName: string
  category: string
  sourceUrl: string | null
  confidence: number | null
  relevanceScore: number | null
  eventClusterId: string | null
  isClusterRepresentative: boolean
  provenanceLabel: string
}

export interface DigestContract {
  id: string
  title: string
  href: string
}

export interface DigestKnowledge {
  id: string
  title: string
  href: string
  entityType: 'system' | 'explainer'
  provenanceLabel: string
}

export interface WeeklyDigestSelection {
  articles: DigestArticle[]
  contracts: DigestContract[]
  knowledge: DigestKnowledge[]
}

const PUBLICLY_SOURCED = new Set([
  'primary-source-backed',
  'vendor-reported',
  'secondary-source-backed',
  'partially-sourced',
  'conflicting',
])

function easternDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day), weekday: parts.weekday }
}

export function buildWeekKey(now = new Date()): string {
  const parts = easternDateParts(now)
  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)
  const daysSinceMonday = (weekdayIndex + 6) % 7
  const monday = new Date(Date.UTC(parts.year, parts.month - 1, parts.day - daysSinceMonday, 12))
  return monday.toISOString().slice(0, 10)
}

export function selectWeeklyDigest(input: {
  articles: DigestArticle[]
  contracts: DigestContract[]
  knowledge: DigestKnowledge[]
}): WeeklyDigestSelection {
  const clusters = new Set<string>()
  const sourceCounts = new Map<string, number>()
  const articles: DigestArticle[] = []

  for (const article of input.articles) {
    if (articles.length >= 5) break
    if (
      !article.isClusterRepresentative ||
      !article.sourceUrl ||
      (article.confidence || 0) < 0.8 ||
      (article.relevanceScore || 0) < 0.5 ||
      !ARTICLE_CATEGORIES.includes(article.category as (typeof ARTICLE_CATEGORIES)[number]) ||
      !PUBLICLY_SOURCED.has(article.provenanceLabel)
    ) continue

    const clusterKey = article.eventClusterId || `article:${article.id}`
    if (clusters.has(clusterKey)) continue
    const sourceCount = sourceCounts.get(article.sourceName) || 0
    if (sourceCount >= 2) continue

    clusters.add(clusterKey)
    sourceCounts.set(article.sourceName, sourceCount + 1)
    articles.push(article)
  }

  return {
    articles,
    contracts: input.contracts.slice(0, 2),
    knowledge: input.knowledge.filter((item) => PUBLICLY_SOURCED.has(item.provenanceLabel)).slice(0, 1),
  }
}
