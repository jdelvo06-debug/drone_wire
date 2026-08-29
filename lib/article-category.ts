export const ARTICLE_CATEGORIES = [
  'counter-uas',
  'drone-warfare',
  'contracts',
  'policy',
  'general',
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]

export function isArticleCategory(value: unknown): value is ArticleCategory {
  return typeof value === 'string' && ARTICLE_CATEGORIES.includes(value as ArticleCategory)
}

export function requireArticleCategory(value: unknown): ArticleCategory {
  if (!isArticleCategory(value)) {
    throw new Error('Invalid article category')
  }
  return value
}

const CATEGORY_ALIASES: Record<string, ArticleCategory> = {
  'counter uas': 'counter-uas',
  'counter-uas': 'counter-uas',
  'counter drone': 'counter-uas',
  'counter-drone': 'counter-uas',
  cuas: 'counter-uas',
  drones: 'drone-warfare',
  'drone warfare': 'drone-warfare',
  'drone-warfare': 'drone-warfare',
  uas: 'drone-warfare',
  contract: 'contracts',
  contracts: 'contracts',
  procurement: 'contracts',
  policy: 'policy',
  'policy & regulation': 'policy',
  regulation: 'policy',
  legislation: 'policy',
  general: 'general',
}

export function normalizeArticleClassification(value: string): {
  category: ArticleCategory
  topics: ArticleCategory[]
  classificationLabel: 'partially-sourced' | 'unverified'
  categoryOrigin: 'canonical' | 'composite' | 'normalized-alias' | 'unrecognized'
  unrecognizedParts: string[]
  usesGeneralFallback: boolean
} {
  const rawParts = value.split(/[|;,]/).map((part) => part.trim()).filter(Boolean)
  const normalizedParts = rawParts.map((part) => part.toLowerCase())
  const recognized = normalizedParts
    .map((part) => CATEGORY_ALIASES[part])
    .filter((part): part is ArticleCategory => Boolean(part))
  const unique = Array.from(new Set(recognized))
  const unrecognizedParts = Array.from(new Set(
    normalizedParts.filter((part) => !CATEGORY_ALIASES[part]),
  ))

  if (unique.length === 0) {
    return {
      category: 'general',
      topics: [],
      classificationLabel: 'unverified',
      categoryOrigin: 'unrecognized',
      unrecognizedParts,
      usesGeneralFallback: true,
    }
  }

  const isComposite = /[|;,]/.test(value)
  const trimmedValue = value.trim()
  return {
    category: unique[0],
    topics: unique.slice(1),
    classificationLabel: 'partially-sourced',
    categoryOrigin: isComposite
      ? 'composite'
      : isArticleCategory(trimmedValue)
        ? 'canonical'
        : 'normalized-alias',
    unrecognizedParts,
    usesGeneralFallback: false,
  }
}

export function summarizeArticleCategoryOrigins(
  values: Array<{ category: string; count: number }>,
): {
  canonicalSingleCount: number
  compositeCount: number
  aliasCount: number
  valuesWithUnknownPartsCount: number
  generalFallbackCount: number
} {
  const summary = {
    canonicalSingleCount: 0,
    compositeCount: 0,
    aliasCount: 0,
    valuesWithUnknownPartsCount: 0,
    generalFallbackCount: 0,
  }

  for (const value of values) {
    const classification = normalizeArticleClassification(value.category)
    if (classification.categoryOrigin === 'canonical') summary.canonicalSingleCount += value.count
    if (classification.categoryOrigin === 'composite') summary.compositeCount += value.count
    if (classification.categoryOrigin === 'normalized-alias') summary.aliasCount += value.count
    if (classification.unrecognizedParts.length > 0) summary.valuesWithUnknownPartsCount += value.count
    if (classification.usesGeneralFallback) summary.generalFallbackCount += value.count
  }

  return summary
}
