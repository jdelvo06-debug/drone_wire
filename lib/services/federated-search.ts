import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import {
  reciprocalRankFusion,
  type FederatedSearchResult,
  type RankedSearchCandidate,
  type SearchEntityType,
} from '@/lib/search/federated-search'

interface SearchRow extends RankedSearchCandidate {}

interface SourceCandidate {
  candidate: RankedSearchCandidate
  aliases: string[]
}

const ALLOWED_TYPES: SearchEntityType[] = ['article', 'system', 'explainer', 'contract']

export function isSearchEntityType(value: string): value is SearchEntityType {
  return ALLOWED_TYPES.includes(value as SearchEntityType)
}

function normalizeTypes(types: SearchEntityType[]): SearchEntityType[] {
  const valid = types.filter(isSearchEntityType)
  return valid.length > 0 ? Array.from(new Set(valid)) : ALLOWED_TYPES
}

function contractHref(contractNumber: string | null): string {
  return contractNumber ? `/contracts?search=${encodeURIComponent(contractNumber)}` : '/contracts'
}

function interleave<T>(groups: T[][]): T[] {
  const items: T[] = []
  const longest = Math.max(0, ...groups.map((group) => group.length))
  for (let index = 0; index < longest; index += 1) {
    for (const group of groups) {
      if (group[index]) items.push(group[index])
    }
  }
  return items
}

async function sourceCandidates(
  query: string,
  types: SearchEntityType[],
  take: number,
  broadTypes: SearchEntityType[] = types,
) {
  const wants = (type: SearchEntityType) => types.includes(type)
  const wantsBroad = (type: SearchEntityType) => broadTypes.includes(type)
  const [articles, systems, explainers, contracts, exactArticles, exactSystems, exactExplainers, exactContracts] = await Promise.all([
    wantsBroad('article') ? prisma.article.findMany({
      where: { status: 'published', OR: [
        { title: { contains: query, mode: 'insensitive' } }, { excerpt: { contains: query, mode: 'insensitive' } },
        { aiSummary: { contains: query, mode: 'insensitive' } }, { content: { contains: query, mode: 'insensitive' } },
        { sourceName: { contains: query, mode: 'insensitive' } }, { topics: { has: query } },
      ] },
      select: { id: true, title: true, excerpt: true, aiSummary: true, sourceName: true, sourceUrl: true, topics: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wantsBroad('system') ? prisma.system.findMany({
      where: { OR: [
        { name: { contains: query, mode: 'insensitive' } }, { slug: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }, { content: { contains: query, mode: 'insensitive' } },
        { manufacturer: { contains: query, mode: 'insensitive' } }, { country: { contains: query, mode: 'insensitive' } },
        { primaryCapability: { contains: query, mode: 'insensitive' } }, { relatedSystems: { has: query } },
        { specifications: { has: query } },
      ] },
      select: { id: true, slug: true, name: true, description: true, manufacturer: true, country: true, relatedSystems: true, specifications: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wantsBroad('explainer') ? prisma.explainer.findMany({
      where: { OR: [
        { title: { contains: query, mode: 'insensitive' } }, { slug: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }, { content: { contains: query, mode: 'insensitive' } },
        { relatedSystems: { has: query } }, { keyFeatures: { has: query } },
      ] },
      select: { id: true, slug: true, title: true, description: true, relatedSystems: true, keyFeatures: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wantsBroad('contract') ? prisma.contract.findMany({
      where: { OR: [
        { title: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } },
        { company: { contains: query, mode: 'insensitive' } }, { agency: { contains: query, mode: 'insensitive' } },
        { office: { contains: query, mode: 'insensitive' } }, { location: { contains: query, mode: 'insensitive' } },
        { contractNumber: { contains: query, mode: 'insensitive' } }, { relatedSystems: { has: query } },
      ] },
      select: { id: true, contractNumber: true, title: true, description: true, company: true, agency: true, category: true, sourceUrl: true },
      take,
    }) : [],
    wants('article') ? prisma.article.findMany({
      where: { status: 'published', OR: [
        { title: { equals: query, mode: 'insensitive' } },
        { sourceName: { equals: query, mode: 'insensitive' } },
        { topics: { has: query } },
      ] },
      select: { id: true, title: true, excerpt: true, aiSummary: true, sourceName: true, sourceUrl: true, topics: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wants('system') ? prisma.system.findMany({
      where: { OR: [
        { name: { equals: query, mode: 'insensitive' } }, { slug: { equals: query, mode: 'insensitive' } },
        { manufacturer: { equals: query, mode: 'insensitive' } }, { country: { equals: query, mode: 'insensitive' } },
        { relatedSystems: { has: query } }, { specifications: { has: query } },
      ] },
      select: { id: true, slug: true, name: true, description: true, manufacturer: true, country: true, relatedSystems: true, specifications: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wants('explainer') ? prisma.explainer.findMany({
      where: { OR: [
        { title: { equals: query, mode: 'insensitive' } }, { slug: { equals: query, mode: 'insensitive' } },
        { relatedSystems: { has: query } }, { keyFeatures: { has: query } },
      ] },
      select: { id: true, slug: true, title: true, description: true, relatedSystems: true, keyFeatures: true, category: true, imageUrl: true, provenanceLabel: true },
      take,
    }) : [],
    wants('contract') ? prisma.contract.findMany({
      where: { OR: [
        { title: { equals: query, mode: 'insensitive' } }, { contractNumber: { equals: query, mode: 'insensitive' } },
        { company: { equals: query, mode: 'insensitive' } }, { agency: { equals: query, mode: 'insensitive' } },
        { office: { equals: query, mode: 'insensitive' } }, { location: { equals: query, mode: 'insensitive' } },
        { relatedSystems: { has: query } },
      ] },
      select: { id: true, contractNumber: true, title: true, description: true, company: true, agency: true, category: true, sourceUrl: true },
      take,
    }) : [],
  ])

  const mapArticles = (items: typeof articles): SourceCandidate[] => items.map((item) => ({
      candidate: { entityType: 'article' as const, id: item.id, title: item.title, href: `/articles/${item.id}`, snippet: item.aiSummary || item.excerpt || '', category: item.category, imageUrl: item.imageUrl, provenanceLabel: item.provenanceLabel },
      aliases: [item.sourceName, ...item.topics],
    }))
  const mapSystems = (items: typeof systems): SourceCandidate[] => items.map((item) => ({
      candidate: { entityType: 'system' as const, id: item.id, title: item.name, href: `/systems/${item.slug}`, snippet: item.description, category: item.category, imageUrl: item.imageUrl, provenanceLabel: item.provenanceLabel },
      aliases: [item.slug, item.manufacturer, item.country, ...item.relatedSystems, ...item.specifications],
    }))
  const mapExplainers = (items: typeof explainers): SourceCandidate[] => items.map((item) => ({
      candidate: { entityType: 'explainer' as const, id: item.id, title: item.title, href: `/explainers/${item.slug}`, snippet: item.description, category: item.category, imageUrl: item.imageUrl, provenanceLabel: item.provenanceLabel },
      aliases: [item.slug, ...item.relatedSystems, ...item.keyFeatures],
    }))
  const mapContracts = (items: typeof contracts): SourceCandidate[] => items.map((item) => ({
      candidate: { entityType: 'contract' as const, id: item.id, title: item.title, href: contractHref(item.contractNumber), snippet: item.description || '', category: item.category, imageUrl: null, provenanceLabel: item.sourceUrl ? 'secondary-source-backed' : 'unverified' },
      aliases: [item.contractNumber, item.company, item.agency].filter((value): value is string => Boolean(value)),
    }))
  const articleCandidates = mapArticles(articles)
  const systemCandidates = mapSystems(systems)
  const explainerCandidates = mapExplainers(explainers)
  const contractCandidates = mapContracts(contracts)
  const candidateGroups = [articleCandidates, systemCandidates, explainerCandidates, contractCandidates]
  return {
    exact: [
      ...mapArticles(exactArticles), ...mapSystems(exactSystems),
      ...mapExplainers(exactExplainers), ...mapContracts(exactContracts),
    ].map(({ candidate }) => candidate),
    fullText: interleave(candidateGroups.map((group) => group.map(({ candidate }) => candidate))),
  }
}

const selectFields = Prisma.sql`
  "entityType", "entityId" AS "id", "title", "href",
  LEFT("searchableText", 280) AS "snippet", "category", "imageUrl", "provenanceLabel"
`

function isProjectionCompatibilityError(error: unknown): boolean {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  return code === 'P2010' || code === 'P2021' || code === 'P2022'
}

export async function federatedSearch(
  query: string,
  types: SearchEntityType[],
  limit: number,
  mode: 'hybrid' | 'lexical' = 'hybrid',
): Promise<FederatedSearchResult[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return []
  void mode // Embeddings are deliberately a separate future operation.
  const selectedTypes = normalizeTypes(types)
  const channelLimit = Math.min(Math.max(limit * 3, 20), 100)

  let projectionAvailable = false
  try {
    const [projection] = await prisma.$queryRaw<Array<{ available: boolean }>>`
      SELECT to_regclass('public.search_documents') IS NOT NULL AS "available"
    `
    projectionAvailable = projection?.available === true
  } catch (error) {
    if (!isProjectionCompatibilityError(error)) throw error
  }

  if (!projectionAvailable) {
    const source = await sourceCandidates(trimmedQuery, selectedTypes, channelLimit)
    return reciprocalRankFusion({ exact: source.exact, fullText: source.fullText, trigram: [], vector: [] }).slice(0, limit)
  }

  try {
    const incompleteProjection = await prisma.$queryRaw<Array<{ entityType: SearchEntityType }>>(Prisma.sql`
      SELECT incomplete."entityType"
      FROM (
        SELECT 'article'::text AS "entityType"
        WHERE EXISTS (
          SELECT 1 FROM "articles" source
          LEFT JOIN "search_documents" projection
            ON projection."entityType" = 'article' AND projection."entityId" = source."id"
          WHERE source."status" = 'published' AND projection."id" IS NULL
        )
        UNION ALL
        SELECT 'system'::text
        WHERE EXISTS (
          SELECT 1 FROM "systems" source
          LEFT JOIN "search_documents" projection
            ON projection."entityType" = 'system' AND projection."entityId" = source."id"
          WHERE projection."id" IS NULL
        )
        UNION ALL
        SELECT 'explainer'::text
        WHERE EXISTS (
          SELECT 1 FROM "explainers" source
          LEFT JOIN "search_documents" projection
            ON projection."entityType" = 'explainer' AND projection."entityId" = source."id"
          WHERE projection."id" IS NULL
        )
        UNION ALL
        SELECT 'contract'::text
        WHERE EXISTS (
          SELECT 1 FROM "contracts" source
          LEFT JOIN "search_documents" projection
            ON projection."entityType" = 'contract' AND projection."entityId" = source."id"
          WHERE projection."id" IS NULL
        )
      ) incomplete
      WHERE incomplete."entityType" IN (${Prisma.join(selectedTypes)})
    `)
    const incompleteTypes = incompleteProjection.map((row) => row.entityType)
    const source = await sourceCandidates(trimmedQuery, selectedTypes, channelLimit, incompleteTypes)
    const [exact, fullText, trigram] = await Promise.all([
      prisma.$queryRaw<SearchRow[]>(Prisma.sql`
        SELECT ${selectFields}
        FROM "search_documents"
        WHERE "entityType" IN (${Prisma.join(selectedTypes)})
          AND (LOWER("title") = LOWER(${trimmedQuery}) OR EXISTS (
            SELECT 1 FROM unnest("aliases") alias WHERE LOWER(alias) = LOWER(${trimmedQuery})
          ))
        ORDER BY CASE WHEN LOWER("title") = LOWER(${trimmedQuery}) THEN 0 ELSE 1 END, "title"
        LIMIT ${channelLimit}
      `),
      prisma.$queryRaw<SearchRow[]>(Prisma.sql`
        SELECT ${selectFields}
        FROM "search_documents"
        WHERE "entityType" IN (${Prisma.join(selectedTypes)})
          AND to_tsvector('english', "searchableText") @@ websearch_to_tsquery('english', ${trimmedQuery})
        ORDER BY ts_rank_cd(to_tsvector('english', "searchableText"), websearch_to_tsquery('english', ${trimmedQuery})) DESC
        LIMIT ${channelLimit}
      `),
      prisma.$queryRaw<SearchRow[]>(Prisma.sql`
        SELECT ${selectFields}
        FROM "search_documents"
        WHERE "entityType" IN (${Prisma.join(selectedTypes)})
          AND GREATEST(similarity("title", ${trimmedQuery}), similarity("searchableText", ${trimmedQuery})) > 0.12
        ORDER BY GREATEST(similarity("title", ${trimmedQuery}), similarity("searchableText", ${trimmedQuery})) DESC
        LIMIT ${channelLimit}
      `),
    ])

    return reciprocalRankFusion({
      exact: [...source.exact, ...exact],
      fullText: [...source.fullText, ...fullText],
      trigram,
      vector: [],
    }).slice(0, limit)
  } catch (error) {
    if (isProjectionCompatibilityError(error)) {
      const fallback = await sourceCandidates(trimmedQuery, selectedTypes, channelLimit)
      return reciprocalRankFusion({ exact: fallback.exact, fullText: fallback.fullText, trigram: [], vector: [] }).slice(0, limit)
    }
    throw error
  }
}
