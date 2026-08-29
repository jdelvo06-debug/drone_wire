export interface ClusterCandidate {
  id: string
  contentCompleteness: number
  sourceQuality: number
  publishedAt: Date
}

export function selectClusterRepresentative<T extends ClusterCandidate>(candidates: T[]): T | null {
  return [...candidates].sort((a, b) =>
    b.contentCompleteness - a.contentCompleteness ||
    b.sourceQuality - a.sourceQuality ||
    b.publishedAt.getTime() - a.publishedAt.getTime() ||
    a.id.localeCompare(b.id)
  )[0] || null
}

const RELEVANCE_TERMS = [
  'counter uas', 'counter-uas', 'c-uas', 'drone', 'unmanned aircraft', 'uas', 'uav',
  'air defense', 'electronic warfare', 'jammer', 'interceptor', 'directed energy',
]

export function eventFingerprint(title: string): string {
  return title.toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !['the', 'and', 'for', 'with', 'from', 'that', 'this'].includes(token))
    .slice(0, 12)
    .sort()
    .join('-') || 'untitled'
}

export function scoreArticleRelevance(text: string): number {
  const normalized = text.toLowerCase()
  const matches = RELEVANCE_TERMS.filter((term) => normalized.includes(term)).length
  return Math.min(1, matches / 4)
}
