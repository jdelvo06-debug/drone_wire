/** @jest-environment node */

import {
  buildSearchProjection,
  executeSearchProjection,
  isLocalDatabaseUrl,
  type SearchProjectionSourceData,
  type SearchProjectionStore,
} from '@/lib/search/search-projection'
import { assertSearchProjectionApplyAuthorization } from '@/lib/search/search-projection-authorization'

const now = new Date('2026-08-23T12:00:00.000Z')

function sourceData(): SearchProjectionSourceData {
  return {
    articles: [
      { id: 'published', status: 'published', title: 'Published article', content: 'body', excerpt: null, aiSummary: null, sourceName: 'Source', topics: [], category: 'policy', imageUrl: null, provenanceLabel: 'primary-source-backed', updatedAt: now },
      { id: 'pending', status: 'pending', title: 'Pending article', content: null, excerpt: null, aiSummary: null, sourceName: 'Source', topics: [], category: 'policy', imageUrl: null, provenanceLabel: 'unverified', updatedAt: now },
      { id: 'failed', status: 'failed', title: 'Failed article', content: null, excerpt: null, aiSummary: null, sourceName: 'Source', topics: [], category: 'policy', imageUrl: null, provenanceLabel: 'unverified', updatedAt: now },
    ],
    systems: [{ id: 'system', slug: 'kurfs', name: 'KuRFS', description: 'Radar', content: 'system body', manufacturer: 'Raytheon', country: 'US', status: 'operational', relatedSystems: ['Coyote'], specifications: ['Ku-band'], category: 'sensor', imageUrl: null, provenanceLabel: 'partially-sourced', updatedAt: now }],
    explainers: [{ id: 'explainer', slug: 'radar', title: 'Radar', description: 'Explainer', content: 'explainer body', relatedSystems: ['KuRFS'], keyFeatures: ['Detection'], difficulty: 'beginner', category: 'concepts', imageUrl: null, provenanceLabel: 'secondary-source-backed', updatedAt: now }],
    contracts: [{
      id: 'contract', contractNumber: 'FA-123', title: 'Radar award', description: 'Award',
      company: 'Raytheon', agency: 'Army', office: 'RCCTO', location: 'Alabama',
      relatedSystems: ['KuRFS'], status: 'active', category: 'counter-uas',
      sourceUrl: 'https://example.gov/award', updatedAt: now,
    }],
  }
}

function store(): jest.Mocked<SearchProjectionStore> {
  return {
    loadSources: jest.fn().mockResolvedValue(sourceData()),
    loadExisting: jest.fn().mockResolvedValue([]),
    upsertProjection: jest.fn().mockResolvedValue(undefined),
    deleteStaleProjection: jest.fn().mockResolvedValue(0),
  }
}

describe('safe search projection planning and execution', () => {
  it('builds deterministic null-embedding documents for every type and excludes pending and failed articles', () => {
    const first = buildSearchProjection(sourceData())
    const second = buildSearchProjection(sourceData())

    expect(first.documents).toEqual(second.documents)
    expect(first.counts).toEqual({ articles: 1, excludedArticles: 2, systems: 1, explainers: 1, contracts: 1, total: 4 })
    expect(first.documents.map((document) => document.entityType).sort()).toEqual(['article', 'contract', 'explainer', 'system'])
    expect(first.documents.every((document) => document.embedding === null)).toBe(true)
    expect(first.documents.find((document) => document.entityType === 'contract')?.href).toContain('/contracts?search=')
  })

  it('rejects duplicate entity keys', () => {
    const sources = sourceData()
    sources.systems.push({ ...sources.systems[0] })
    expect(() => buildSearchProjection(sources)).toThrow(/duplicate search projection key/i)
  })

  it('does no writes in the default dry run', async () => {
    const projectionStore = store()
    const report = await executeSearchProjection(projectionStore)

    expect(report.mode).toBe('dry-run')
    expect(projectionStore.upsertProjection).not.toHaveBeenCalled()
    expect(projectionStore.deleteStaleProjection).not.toHaveBeenCalled()
  })

  it('applies projection rows without provider access, keeps embeddings null, and does not delete stale rows', async () => {
    const projectionStore = store()
    await executeSearchProjection(projectionStore, { mode: 'projection', apply: true })

    expect(projectionStore.upsertProjection).toHaveBeenCalledTimes(1)
    expect(projectionStore.upsertProjection.mock.calls[0][0].every((document) => document.embedding === null)).toBe(true)
    expect(projectionStore.deleteStaleProjection).not.toHaveBeenCalled()
  })

  it('updates existing trigger-created rows through the same deterministic upsert batch', async () => {
    const projectionStore = store()
    projectionStore.loadExisting.mockResolvedValue([{ entityType: 'system', entityId: 'system', embedding: '[1,2]' }])

    const report = await executeSearchProjection(projectionStore, { mode: 'projection', apply: true })

    expect(report.existing).toBe(1)
    expect(projectionStore.upsertProjection.mock.calls[0][0].find((document) => document.entityId === 'system')).toMatchObject({
      title: 'KuRFS', embedding: null,
    })
  })

  it('requires a separate explicit stale-delete operation', async () => {
    const projectionStore = store()
    await executeSearchProjection(projectionStore, { mode: 'delete-stale', apply: true })

    expect(projectionStore.upsertProjection).not.toHaveBeenCalled()
    expect(projectionStore.deleteStaleProjection).toHaveBeenCalledTimes(1)
  })

  it('checks the explicitly approved projection total before attempting any write', async () => {
    const projectionStore = store()

    await expect(executeSearchProjection(projectionStore, {
      mode: 'projection', apply: true, expectedTotal: 5,
    })).rejects.toThrow(/expected 5 projection rows but found 4/i)
    expect(projectionStore.upsertProjection).not.toHaveBeenCalled()
    expect(projectionStore.deleteStaleProjection).not.toHaveBeenCalled()
  })

  it('requires a separately gated non-local projection apply', () => {
    const base = {
      apply: true,
      mode: 'projection' as const,
      databaseUrl: 'postgresql://user:secret@db.example.com/production',
      exportPath: '/private/tmp/search-projection.json',
      productionApproved: false,
      disposableApproved: false,
      expectedTotal: 4060,
      expectedCounts: { articles: 3681, systems: 111, explainers: 40, contracts: 228 },
      expectedProjectionSha256: 'a'.repeat(64),
    }

    expect(() => assertSearchProjectionApplyAuthorization(base)).toThrow(/exactly one/)
    expect(assertSearchProjectionApplyAuthorization({ ...base, productionApproved: true }))
      .toEqual({ checkpointPath: '/private/tmp/search-projection.json', target: 'production' })
  })

  it('keeps non-local stale deletion prohibited even with the production approval flag', () => {
    expect(() => assertSearchProjectionApplyAuthorization({
      apply: true,
      mode: 'delete-stale',
      databaseUrl: 'postgresql://user:secret@db.example.com/production',
      exportPath: '/private/tmp/search-projection.json',
      productionApproved: true,
      disposableApproved: false,
      expectedTotal: 4060,
      expectedCounts: { articles: 3681, systems: 111, explainers: 40, contracts: 228 },
      expectedProjectionSha256: 'a'.repeat(64),
    })).toThrow(/stale deletion remains prohibited/i)
  })

  it('requires an approved expected total for a non-local projection apply', () => {
    expect(() => assertSearchProjectionApplyAuthorization({
      apply: true,
      mode: 'projection',
      databaseUrl: 'postgresql://user:secret@db.example.com/production',
      exportPath: '/private/tmp/search-projection.json',
      productionApproved: true,
      disposableApproved: false,
      expectedTotal: undefined,
      expectedCounts: { articles: 3681, systems: 111, explainers: 40, contracts: 228 },
      expectedProjectionSha256: 'a'.repeat(64),
    })).toThrow(/--expected-total/)
  })

  it('treats a loopback URL as production when production approval is explicit', () => {
    expect(assertSearchProjectionApplyAuthorization({
      apply: true,
      mode: 'projection',
      databaseUrl: 'postgresql://user:secret@127.0.0.1:6543/production',
      exportPath: '/private/tmp/search-projection.json',
      productionApproved: true,
      disposableApproved: false,
      expectedTotal: 4060,
      expectedCounts: { articles: 3681, systems: 111, explainers: 40, contracts: 228 },
      expectedProjectionSha256: 'a'.repeat(64),
    })).toEqual({ checkpointPath: '/private/tmp/search-projection.json', target: 'production' })
  })

  it('rejects projection hash drift before attempting a write', async () => {
    const projectionStore = store()
    await expect(executeSearchProjection(projectionStore, {
      mode: 'projection', apply: true, expectedProjectionSha256: 'a'.repeat(64),
    })).rejects.toThrow(/sha-256 mismatch/i)
    expect(projectionStore.upsertProjection).not.toHaveBeenCalled()
  })

  it('recognizes only disposable/local database connections for apply tests', () => {
    expect(isLocalDatabaseUrl('postgresql://postgres:postgres@127.0.0.1:55439/test')).toBe(true)
    expect(isLocalDatabaseUrl('postgresql://postgres:postgres@localhost:5432/test')).toBe(true)
    expect(isLocalDatabaseUrl('postgresql://user:secret@db.example.com:5432/production')).toBe(false)
    expect(isLocalDatabaseUrl(undefined)).toBe(false)
  })
})
