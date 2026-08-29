/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    article: { findMany: jest.fn() },
    system: { findMany: jest.fn() },
    explainer: { findMany: jest.fn() },
    contract: { findMany: jest.fn() },
    $queryRaw: jest.fn(),
  },
}))

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    embeddings: { create: jest.fn() },
  })),
}))

import OpenAI from 'openai'
import { prisma } from '@/lib/db'
import { federatedSearch } from '@/lib/services/federated-search'
import { reciprocalRankFusion, type RankedSearchCandidate } from '@/lib/search/federated-search'

const candidate = (id: string, title: string): RankedSearchCandidate => ({
  entityType: 'system',
  id,
  title,
  href: `/systems/${id}`,
  snippet: title,
  category: 'sensor',
  imageUrl: null,
  provenanceLabel: 'unverified',
})

describe('federated hybrid search ranking', () => {
  const article = {
    id: 'article-1', title: 'Radar contract awarded', excerpt: 'Article excerpt', aiSummary: null,
    sourceName: 'Program office', sourceUrl: 'https://example.gov/article', topics: ['radar'],
    category: 'contracts', imageUrl: null, provenanceLabel: 'primary-source-backed',
  }
  const system = {
    id: 'system-1', slug: 'kurfs', name: 'KuRFS', description: 'Radar system', content: 'Detects small UAS',
    manufacturer: 'Raytheon', country: 'United States', primaryCapability: 'Detection',
    relatedSystems: ['Coyote'], specifications: ['Ku-band'], category: 'sensor', imageUrl: null,
    provenanceLabel: 'partially-sourced',
  }
  const explainer = {
    id: 'explainer-1', slug: 'radar-basics', title: 'Radar basics', description: 'How radar works',
    content: 'A technical explainer', relatedSystems: ['KuRFS'], keyFeatures: ['Detection'],
    category: 'concepts', imageUrl: null, provenanceLabel: 'secondary-source-backed',
  }
  const contract = {
    id: 'contract-1', contractNumber: 'FA-123', title: 'KuRFS production award',
    description: 'Radar procurement', company: 'Raytheon', agency: 'Army', office: 'RCCTO',
    location: 'United States', relatedSystems: ['KuRFS'], category: 'counter-uas', sourceUrl: 'https://example.gov/award',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([article])
    ;(prisma.system.findMany as jest.Mock).mockResolvedValue([system])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([explainer])
    ;(prisma.contract.findMany as jest.Mock).mockResolvedValue([contract])
  })

  it('ranks an exact title or alias match ahead of fused lexical and vector results', () => {
    const coyote = candidate('coyote', 'Coyote Block 2')
    const kurfs = candidate('kurfs', 'KuRFS')
    const radar = candidate('radar', 'Generic Radar')

    const results = reciprocalRankFusion({
      exact: [coyote],
      fullText: [kurfs, coyote, radar],
      trigram: [coyote, kurfs, radar],
      vector: [radar, kurfs, coyote],
    })

    expect(results[0].id).toBe('coyote')
    expect(results[0].score).toBeGreaterThan(results[1].score)
  })

  it('deduplicates the same entity across ranking channels', () => {
    const kurfs = candidate('kurfs', 'KuRFS')
    const results = reciprocalRankFusion({
      exact: [],
      fullText: [kurfs],
      trigram: [kurfs],
      vector: [kurfs],
    })

    expect(results).toHaveLength(1)
  })

  it('returns all four source entity types with record provenance and usable links when the projection is empty', async () => {
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ available: false }])

    const results = await federatedSearch('radar', [], 20)

    expect(results.map((result) => result.entityType).sort()).toEqual(['article', 'contract', 'explainer', 'system'])
    expect(results.find((result) => result.entityType === 'article')).toMatchObject({
      href: '/articles/article-1', provenanceLabel: 'primary-source-backed',
    })
    expect(results.find((result) => result.entityType === 'system')).toMatchObject({
      href: '/systems/kurfs', provenanceLabel: 'partially-sourced',
    })
    expect(results.find((result) => result.entityType === 'explainer')).toMatchObject({
      href: '/explainers/radar-basics', provenanceLabel: 'secondary-source-backed',
    })
    expect(results.find((result) => result.entityType === 'contract')?.href).toContain('/contracts?search=')
    expect(results.every((result) => Number.isFinite(result.score))).toBe(true)
  })

  it('keeps source-table results when only part of the projection is populated and deduplicates overlap', async () => {
    const projectedSystem = {
      entityType: 'system', id: 'system-1', title: 'KuRFS', href: '/systems/kurfs',
      snippet: 'Projected radar system', category: 'sensor', imageUrl: null,
      provenanceLabel: 'partially-sourced',
    }
    ;(prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ available: true }])
      .mockResolvedValueOnce([{ entityType: 'system' }])
      .mockResolvedValueOnce([projectedSystem])
      .mockResolvedValueOnce([projectedSystem])
      .mockResolvedValueOnce([])

    const results = await federatedSearch('radar', [], 20)

    expect(results.map((result) => result.entityType).sort()).toEqual(['article', 'contract', 'explainer', 'system'])
    expect(results.filter((result) => result.id === 'system-1')).toHaveLength(1)
  })

  it('falls back to broad source matching when a covered entity type is missing projection rows', async () => {
    const missingSystem = {
      ...system,
      id: 'system-2',
      slug: 'sentinel-radar',
      name: 'Sentinel radar',
      description: 'A second projected-system candidate',
    }
    const projectedSystem = {
      entityType: 'system', id: 'system-1', title: 'KuRFS', href: '/systems/kurfs',
      snippet: 'Projected radar system', category: 'sensor', imageUrl: null,
      provenanceLabel: 'partially-sourced',
    }
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.contract.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.system.findMany as jest.Mock)
      .mockResolvedValueOnce([system, missingSystem])
      .mockResolvedValueOnce([])
    ;(prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ available: true }])
      .mockResolvedValueOnce([{ entityType: 'system' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([projectedSystem])
      .mockResolvedValueOnce([])

    const results = await federatedSearch('radar', ['system'], 20)

    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'system-1' }),
      expect.objectContaining({ id: 'system-2', title: 'Sentinel radar' }),
    ]))
  })

  it('uses exact source metadata matches and never invokes an embedding provider', async () => {
    process.env.OPENAI_API_KEY = 'must-not-be-used'
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.contract.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ available: false }])

    const results = await federatedSearch('Coyote', ['system'], 10, 'hybrid')

    expect(results[0]).toMatchObject({ id: 'system-1', entityType: 'system' })
    expect(OpenAI).not.toHaveBeenCalled()
    delete process.env.OPENAI_API_KEY
  })

  it('returns no fabricated results for an empty result set', async () => {
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.system.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.contract.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ available: false }])

    await expect(federatedSearch('no-such-record', [], 20)).resolves.toEqual([])
  })

  it('does not let a high-volume entity type crowd other matching types out of the result limit', async () => {
    ;(prisma.article.findMany as jest.Mock)
      .mockResolvedValueOnce(Array.from({ length: 20 }, (_, index) => ({
        ...article, id: `article-${index}`, title: `Contract article ${index}`,
      })))
      .mockResolvedValueOnce([])
    ;(prisma.system.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ available: false }])

    const results = await federatedSearch('contract', [], 10)

    expect(results).toHaveLength(10)
    expect(results.some((result) => result.entityType === 'contract')).toBe(true)
  })

  it('keeps an exact source title ahead of more than the broad channel limit of competitors', async () => {
    const competitors = Array.from({ length: 100 }, (_, index) => ({
      ...system, id: `competitor-${index}`, slug: `competitor-${index}`, name: `Exact Target competitor ${index}`,
    }))
    const exact = { ...system, id: 'exact-target', slug: 'exact-target', name: 'Exact Target' }
    ;(prisma.article.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.explainer.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.contract.findMany as jest.Mock).mockResolvedValue([])
    ;(prisma.system.findMany as jest.Mock)
      .mockResolvedValueOnce(competitors)
      .mockResolvedValueOnce([exact])
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ available: false }])

    const results = await federatedSearch('Exact Target', ['system'], 10)

    expect(results[0]).toMatchObject({ id: 'exact-target', title: 'Exact Target' })
  })

  it('avoids broad source-table scans when every selected projection type is populated', async () => {
    ;(prisma.$queryRaw as jest.Mock)
      .mockResolvedValueOnce([{ available: true }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])

    await federatedSearch('radar', [], 20)

    expect(prisma.article.findMany).toHaveBeenCalledTimes(1)
    expect(prisma.system.findMany).toHaveBeenCalledTimes(1)
    expect(prisma.explainer.findMany).toHaveBeenCalledTimes(1)
    expect(prisma.contract.findMany).toHaveBeenCalledTimes(1)
    expect((prisma.article.findMany as jest.Mock).mock.calls[0][0].where.OR[0].title).toHaveProperty('equals')
  })
})
