import {
  ARTICLE_CATEGORIES,
  isArticleCategory,
  requireArticleCategory,
  normalizeArticleClassification,
  summarizeArticleCategoryOrigins,
} from '@/lib/article-category'

describe('article taxonomy boundary', () => {
  it('contains the five supported categories', () => {
    expect(ARTICLE_CATEGORIES).toEqual([
      'counter-uas',
      'drone-warfare',
      'contracts',
      'policy',
      'general',
    ])
  })

  it('rejects composite and unknown category values', () => {
    expect(isArticleCategory('counter-uas')).toBe(true)
    expect(isArticleCategory('counter-uas|policy')).toBe(false)
    expect(isArticleCategory('technology')).toBe(false)
  })

  it('fails closed instead of silently rewriting invalid values', () => {
    expect(() => requireArticleCategory('counter-uas|policy')).toThrow('Invalid article category')
  })

  it('keeps an already canonical single value distinct from normalized inputs', () => {
    expect(normalizeArticleClassification('counter-uas')).toEqual({
      category: 'counter-uas',
      topics: [],
      classificationLabel: 'partially-sourced',
      categoryOrigin: 'canonical',
      unrecognizedParts: [],
      usesGeneralFallback: false,
    })
  })

  it('marks a real pipe-delimited value as composite even when its first token is canonical', () => {
    expect(normalizeArticleClassification('counter-uas|drone-warfare|contracts|policy|general')).toEqual({
      category: 'counter-uas',
      topics: ['drone-warfare', 'contracts', 'policy', 'general'],
      classificationLabel: 'partially-sourced',
      categoryOrigin: 'composite',
      unrecognizedParts: [],
      usesGeneralFallback: false,
    })
  })

  it('marks a single alias as normalized without calling it composite', () => {
    expect(normalizeArticleClassification('procurement')).toEqual({
      category: 'contracts',
      topics: [],
      classificationLabel: 'partially-sourced',
      categoryOrigin: 'normalized-alias',
      unrecognizedParts: [],
      usesGeneralFallback: false,
    })
  })

  it('retains unknown tokens from a mixed real-world composite for reporting', () => {
    expect(normalizeArticleClassification('drone-warfare|procurement|military-policy')).toEqual({
      category: 'drone-warfare',
      topics: ['contracts'],
      classificationLabel: 'partially-sourced',
      categoryOrigin: 'composite',
      unrecognizedParts: ['military-policy'],
      usesGeneralFallback: false,
    })
  })

  it('uses general plus an unverified label when nothing is recognized', () => {
    expect(normalizeArticleClassification('technology')).toEqual({
      category: 'general',
      topics: [],
      classificationLabel: 'unverified',
      categoryOrigin: 'unrecognized',
      unrecognizedParts: ['technology'],
      usesGeneralFallback: true,
    })
  })

  it('reports canonical, composite, alias, unknown-token, and fallback counts separately', () => {
    expect(summarizeArticleCategoryOrigins([
      { category: 'counter-uas', count: 10 },
      { category: 'counter-uas|drone-warfare|contracts|policy|general', count: 589 },
      { category: 'procurement', count: 3 },
      { category: 'drone-warfare|procurement|military-policy', count: 1 },
      { category: 'technology', count: 2 },
    ])).toEqual({
      canonicalSingleCount: 10,
      compositeCount: 590,
      aliasCount: 3,
      valuesWithUnknownPartsCount: 3,
      generalFallbackCount: 2,
    })
  })
})
