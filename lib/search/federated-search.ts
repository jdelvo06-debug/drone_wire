export type SearchEntityType = 'article' | 'system' | 'explainer' | 'contract'

export interface FederatedSearchResult {
  entityType: SearchEntityType
  id: string
  title: string
  href: string
  snippet: string
  category: string | null
  imageUrl: string | null
  provenanceLabel: string
  score: number
}

export type RankedSearchCandidate = Omit<FederatedSearchResult, 'score'>

export interface SearchRankings {
  exact: RankedSearchCandidate[]
  fullText: RankedSearchCandidate[]
  trigram: RankedSearchCandidate[]
  vector: RankedSearchCandidate[]
}

export function reciprocalRankFusion(rankings: SearchRankings, k = 60): FederatedSearchResult[] {
  const scores = new Map<string, { candidate: RankedSearchCandidate; score: number }>()

  const addRanking = (items: RankedSearchCandidate[], weight: number) => {
    items.forEach((candidate, index) => {
      const key = `${candidate.entityType}:${candidate.id}`
      const current = scores.get(key) || { candidate, score: 0 }
      current.score += weight / (k + index + 1)
      scores.set(key, current)
    })
  }

  // Exact title and alias matches must always outrank the fused retrieval channels.
  addRanking(rankings.exact, 10_000)
  addRanking(rankings.fullText, 1)
  addRanking(rankings.trigram, 1)
  addRanking(rankings.vector, 1)

  return Array.from(scores.values())
    .map(({ candidate, score }) => ({ ...candidate, score }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
}
