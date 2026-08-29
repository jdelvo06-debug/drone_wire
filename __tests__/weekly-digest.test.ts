import { buildWeekKey, selectWeeklyDigest } from '@/lib/newsletter/weekly-digest'
import { coverageDatesForWeek } from '@/lib/services/weekly-digest'

describe('weekly digest selection', () => {
  it('uses an Eastern-time Monday week key and seven-day coverage', () => {
    expect(buildWeekKey(new Date('2026-08-24T12:00:00.000Z'))).toBe('2026-08-24')
    expect(coverageDatesForWeek('2026-08-24')).toEqual({
      coverageStart: new Date('2026-08-17T04:00:00.000Z'),
      coverageEnd: new Date('2026-08-24T04:00:00.000Z'),
    })
    expect(coverageDatesForWeek('2026-01-12')).toEqual({
      coverageStart: new Date('2026-01-05T05:00:00.000Z'),
      coverageEnd: new Date('2026-01-12T05:00:00.000Z'),
    })
  })

  it('selects only eligible representative articles and deduplicates event clusters', () => {
    const selected = selectWeeklyDigest({
      articles: [
        { id: 'a1', title: 'A', href: '/articles/a1', sourceName: 'Official', category: 'counter-uas', sourceUrl: 'https://example.gov/a', confidence: 0.95, relevanceScore: 0.9, eventClusterId: 'cluster-1', isClusterRepresentative: true, provenanceLabel: 'primary-source-backed' },
        { id: 'a2', title: 'Duplicate', href: '/articles/a2', sourceName: 'Other', category: 'counter-uas', sourceUrl: 'https://example.gov/b', confidence: 0.99, relevanceScore: 0.99, eventClusterId: 'cluster-1', isClusterRepresentative: false, provenanceLabel: 'primary-source-backed' },
        { id: 'a3', title: 'Unsourced', href: '/articles/a3', sourceName: 'Unknown', category: 'general', sourceUrl: null, confidence: 0.99, relevanceScore: 0.99, eventClusterId: null, isClusterRepresentative: true, provenanceLabel: 'unverified' },
      ],
      contracts: [],
      knowledge: [],
    })

    expect(selected.articles.map((article) => article.id)).toEqual(['a1'])
  })

  it('caps the issue at five articles, two contracts, and one sourced knowledge record', () => {
    const articles = Array.from({ length: 8 }, (_, index) => ({
      id: `a${index}`,
      title: `Article ${index}`,
      href: `/articles/a${index}`,
      sourceName: `Source ${index}`,
      category: 'counter-uas',
      sourceUrl: `https://example.gov/${index}`,
      confidence: 0.9,
      relevanceScore: 0.9,
      eventClusterId: `cluster-${index}`,
      isClusterRepresentative: true,
      provenanceLabel: 'primary-source-backed',
    }))
    const contracts = Array.from({ length: 3 }, (_, index) => ({ id: `c${index}`, title: `Contract ${index}`, href: '/contracts' }))
    const knowledge = [
      { id: 's1', title: 'System', href: '/systems/system', entityType: 'system' as const, provenanceLabel: 'unverified' },
      { id: 'e1', title: 'Explainer', href: '/explainers/explainer', entityType: 'explainer' as const, provenanceLabel: 'primary-source-backed' },
    ]

    const selected = selectWeeklyDigest({ articles, contracts, knowledge })
    expect(selected.articles).toHaveLength(5)
    expect(selected.contracts).toHaveLength(2)
    expect(selected.knowledge.map((item) => item.id)).toEqual(['e1'])
  })
})
