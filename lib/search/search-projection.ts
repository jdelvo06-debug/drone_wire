import { createHash } from 'node:crypto'

export type SearchProjectionEntityType = 'article' | 'system' | 'explainer' | 'contract'

interface ProjectionBaseSource {
  id: string
  category: string | null
  imageUrl: string | null
  updatedAt: Date
}

export interface SearchProjectionSourceData {
  articles: Array<ProjectionBaseSource & {
    status: string
    title: string
    content: string | null
    excerpt: string | null
    aiSummary: string | null
    sourceName: string
    topics: string[]
    provenanceLabel: string
  }>
  systems: Array<ProjectionBaseSource & {
    slug: string
    name: string
    description: string
    content: string
    manufacturer: string
    country: string
    status: string
    relatedSystems: string[]
    specifications: string[]
    provenanceLabel: string
  }>
  explainers: Array<ProjectionBaseSource & {
    slug: string
    title: string
    description: string
    content: string
    relatedSystems: string[]
    keyFeatures: string[]
    difficulty: string
    provenanceLabel: string
  }>
  contracts: Array<{
    id: string
    contractNumber: string | null
    title: string
    description: string | null
    company: string
    agency: string
    office: string | null
    location: string | null
    relatedSystems: string[]
    status: string
    category: string
    sourceUrl: string | null
    updatedAt: Date
  }>
}

export interface SearchProjectionDocument {
  entityType: SearchProjectionEntityType
  entityId: string
  title: string
  href: string
  aliases: string[]
  category: string | null
  imageUrl: string | null
  facets: Record<string, string | null>
  searchableText: string
  provenanceLabel: string
  embedding: null
  sourceUpdatedAt: Date
}

export interface ExistingSearchProjection {
  entityType: string
  entityId: string
  embedding: string | null
}

export interface SearchProjectionStore {
  loadSources(): Promise<SearchProjectionSourceData>
  loadExisting(): Promise<ExistingSearchProjection[]>
  loadCheckpoint?(): Promise<Array<Record<string, unknown>>>
  upsertProjection(documents: SearchProjectionDocument[]): Promise<void>
  deleteStaleProjection(expectedKeys: Set<string>): Promise<number>
}

export interface SearchProjectionPlan {
  documents: SearchProjectionDocument[]
  projectionSha256: string
  counts: {
    articles: number
    excludedArticles: number
    systems: number
    explainers: number
    contracts: number
    total: number
  }
}

export type SearchProjectionMode = 'dry-run' | 'projection' | 'delete-stale'

export function isLocalDatabaseUrl(value: string | undefined): boolean {
  if (!value) return false
  try {
    const hostname = new URL(value).hostname.toLocaleLowerCase()
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return false
  }
}

function searchableText(parts: Array<string | null | undefined> | string[]): string {
  return parts.filter((part): part is string => Boolean(part?.trim())).join(' ')
}

function projectionKey(document: Pick<SearchProjectionDocument, 'entityType' | 'entityId'>): string {
  return `${document.entityType}:${document.entityId}`
}

function contractHref(contractNumber: string | null): string {
  return contractNumber ? `/contracts?search=${encodeURIComponent(contractNumber)}` : '/contracts'
}

export function buildSearchProjection(sources: SearchProjectionSourceData): SearchProjectionPlan {
  const publishedArticles = sources.articles.filter((article) => article.status === 'published')
  const documents: SearchProjectionDocument[] = [
    ...publishedArticles.map((article): SearchProjectionDocument => ({
      entityType: 'article', entityId: article.id, title: article.title, href: `/articles/${article.id}`,
      aliases: article.topics, category: article.category, imageUrl: article.imageUrl,
      facets: { source: article.sourceName },
      searchableText: searchableText([article.title, article.excerpt, article.aiSummary, article.content, article.sourceName, ...article.topics]),
      provenanceLabel: article.provenanceLabel, embedding: null, sourceUpdatedAt: article.updatedAt,
    })),
    ...sources.systems.map((system): SearchProjectionDocument => ({
      entityType: 'system', entityId: system.id, title: system.name, href: `/systems/${system.slug}`,
      aliases: [system.slug, ...system.relatedSystems], category: system.category, imageUrl: system.imageUrl,
      facets: { manufacturer: system.manufacturer, country: system.country, status: system.status },
      searchableText: searchableText([system.name, system.description, system.content, system.manufacturer, system.country, ...system.relatedSystems, ...system.specifications]),
      provenanceLabel: system.provenanceLabel, embedding: null, sourceUpdatedAt: system.updatedAt,
    })),
    ...sources.explainers.map((explainer): SearchProjectionDocument => ({
      entityType: 'explainer', entityId: explainer.id, title: explainer.title, href: `/explainers/${explainer.slug}`,
      aliases: [explainer.slug, ...explainer.relatedSystems], category: explainer.category, imageUrl: explainer.imageUrl,
      facets: { difficulty: explainer.difficulty },
      searchableText: searchableText([explainer.title, explainer.description, explainer.content, ...explainer.relatedSystems, ...explainer.keyFeatures]),
      provenanceLabel: explainer.provenanceLabel, embedding: null, sourceUpdatedAt: explainer.updatedAt,
    })),
    ...sources.contracts.map((contract): SearchProjectionDocument => ({
      entityType: 'contract', entityId: contract.id, title: contract.title,
      href: contractHref(contract.contractNumber),
      aliases: contract.contractNumber ? [contract.contractNumber, ...contract.relatedSystems] : contract.relatedSystems,
      category: contract.category, imageUrl: null,
      facets: { agency: contract.agency, company: contract.company, status: contract.status },
      searchableText: searchableText([
        contract.title, contract.description, contract.company, contract.agency, contract.office,
        contract.location, contract.contractNumber, ...contract.relatedSystems,
      ]),
      provenanceLabel: contract.sourceUrl ? 'secondary-source-backed' : 'unverified', embedding: null,
      sourceUpdatedAt: contract.updatedAt,
    })),
  ].sort((left, right) => projectionKey(left).localeCompare(projectionKey(right)))

  const keys = new Set<string>()
  for (const document of documents) {
    const key = projectionKey(document)
    if (keys.has(key)) throw new Error(`Duplicate search projection key: ${key}`)
    keys.add(key)
  }

  return {
    documents,
    projectionSha256: createHash('sha256').update(JSON.stringify(documents)).digest('hex'),
    counts: {
      articles: publishedArticles.length,
      excludedArticles: sources.articles.length - publishedArticles.length,
      systems: sources.systems.length,
      explainers: sources.explainers.length,
      contracts: sources.contracts.length,
      total: documents.length,
    },
  }
}

export async function executeSearchProjection(
  store: SearchProjectionStore,
  options: {
    mode?: SearchProjectionMode
    apply?: boolean
    expectedTotal?: number
    expectedCounts?: Partial<Pick<SearchProjectionPlan['counts'], 'articles' | 'systems' | 'explainers' | 'contracts'>>
    expectedProjectionSha256?: string
  } = {},
) {
  const mode = options.mode || 'dry-run'
  const apply = options.apply === true
  const [sources, existing] = await Promise.all([store.loadSources(), store.loadExisting()])
  const plan = buildSearchProjection(sources)
  const expectedKeys = new Set(plan.documents.map(projectionKey))
  let deleted = 0

  if (apply && options.expectedTotal !== undefined && plan.counts.total !== options.expectedTotal) {
    throw new Error(`Expected ${options.expectedTotal} projection rows but found ${plan.counts.total}; no database writes were attempted`)
  }
  if (apply && options.expectedCounts) {
    for (const entityType of ['articles', 'systems', 'explainers', 'contracts'] as const) {
      const expected = options.expectedCounts[entityType]
      if (expected !== undefined && plan.counts[entityType] !== expected) {
        throw new Error(`Expected ${expected} ${entityType} but found ${plan.counts[entityType]}; no database writes were attempted`)
      }
    }
  }
  if (apply && options.expectedProjectionSha256 !== undefined && plan.projectionSha256 !== options.expectedProjectionSha256) {
    throw new Error(`Projection SHA-256 mismatch; no database writes were attempted`)
  }

  if (apply && mode === 'projection') await store.upsertProjection(plan.documents)
  if (apply && mode === 'delete-stale') deleted = await store.deleteStaleProjection(expectedKeys)

  return {
    mode,
    apply,
    counts: plan.counts,
    projectionSha256: plan.projectionSha256,
    existing: existing.length,
    stale: existing.filter((document) => !expectedKeys.has(`${document.entityType}:${document.entityId}`)).length,
    deleted,
  }
}
