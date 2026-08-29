import {
  buildCatalogApprovalTemplate,
  buildCatalogCorrectionPlan,
  correctionBaselineSha256,
  executeCatalogCorrections,
  parseCatalogCli,
  validateCatalogApproval,
  type CatalogArtifactStore,
  type CatalogCorrectionStore,
  type CatalogCorrectionTransaction,
  type CatalogRecordSnapshot,
} from '@/lib/content/catalog-correction-packet'
import type { CatalogCorrection } from '@/lib/content/known-catalog-corrections'

const record: CatalogRecordSnapshot = {
  entityType: 'system', id: 'system-1', slug: 'test-system',
  fields: { id: 'system-1', slug: 'test-system', name: 'Before', manufacturer: 'Before vendor', imageUrl: 'https://old.example/image.jpg', updatedAt: '2026-08-23T00:00:00.000Z' },
}

function correction(): CatalogCorrection {
  const value: CatalogCorrection = {
    entityType: 'system', slug: 'test-system', baselineSha256: 'PENDING', reason: 'test',
    changes: { name: 'After', imageUrl: null },
    evidence: { confirmedFacts: ['fact'], vendorClaims: [], analysis: [], unresolved: [] },
    sources: [],
  }
  value.baselineSha256 = correctionBaselineSha256(value, record)
  return value
}

class MemoryArtifacts implements CatalogArtifactStore {
  files = new Map<string, string>()
  async exists(filePath: string) { return this.files.has(filePath) }
  async writeExclusive(filePath: string, contents: string) {
    if (this.files.has(filePath)) throw new Error('exists')
    this.files.set(filePath, contents)
  }
}

class MemoryStore implements CatalogCorrectionStore {
  records = JSON.parse(JSON.stringify([record])) as CatalogRecordSnapshot[]
  transactionCount = 0
  async readRecords() { return JSON.parse(JSON.stringify(this.records)) as CatalogRecordSnapshot[] }
  async readRollbackState() { return { sources: [], citations: [], mediaAssets: [] } }
  async transaction<T>(callback: (transaction: CatalogCorrectionTransaction) => Promise<T>): Promise<T> {
    this.transactionCount += 1
    const working = JSON.parse(JSON.stringify(this.records)) as CatalogRecordSnapshot[]
    const result = await callback({
      readLockedRecords: async () => JSON.parse(JSON.stringify(working)) as CatalogRecordSnapshot[],
      applyCorrection: async (item) => {
        working[0].fields = { ...working[0].fields, ...item.changes, updatedAt: '2026-08-23T00:01:00.000Z' }
      },
      readRecords: async () => JSON.parse(JSON.stringify(working)) as CatalogRecordSnapshot[],
    })
    this.records = working
    return result
  }
}

describe('catalog correction packet guards', () => {
  it('defaults to dry-run and requires outside-repository artifacts for apply', () => {
    expect(parseCatalogCli([], '/repo')).toEqual({ apply: false })
    expect(() => parseCatalogCli(['--apply'], '/repo')).toThrow('--export')
    expect(() => parseCatalogCli(['--apply', '--export=/repo/pre.json', '--report=/tmp/report.json', '--approval=/tmp/approval.json'], '/repo')).toThrow('outside')
  })

  it('refuses baseline drift', () => {
    const item = correction()
    expect(buildCatalogCorrectionPlan([record], [item]).decisions).toHaveLength(2)
    const drifted = JSON.parse(JSON.stringify(record)) as CatalogRecordSnapshot
    drifted.fields.name = 'Concurrent edit'
    expect(() => buildCatalogCorrectionPlan([drifted], [item])).toThrow('Baseline drift')
  })

  it('requires Jeremy approval of every exact field and image decision', () => {
    const plan = buildCatalogCorrectionPlan([record], [correction()])
    const approval = buildCatalogApprovalTemplate(plan)
    expect(() => validateCatalogApproval(plan, approval)).toThrow('Jeremy approval')
    approval.reviewer = 'Jeremy'
    approval.approvedAt = '2026-08-23T00:00:00.000Z'
    approval.decisions = approval.decisions.map((decision) => ({ ...decision, approved: true }))
    expect(() => validateCatalogApproval(plan, approval)).not.toThrow()
  })

  it('performs dry-run without database or artifact writes', async () => {
    const store = new MemoryStore()
    const artifacts = new MemoryArtifacts()
    const plan = buildCatalogCorrectionPlan(await store.readRecords(), [correction()])
    const result = await executeCatalogCorrections({ apply: false, plan, store, artifactStore: artifacts })
    expect(result.status).toBe('dry-run-review')
    expect(store.transactionCount).toBe(0)
    expect(artifacts.files.size).toBe(0)
  })

  it('exports rollback data, applies only approved changes, and verifies after commit', async () => {
    const store = new MemoryStore()
    const artifacts = new MemoryArtifacts()
    const plan = buildCatalogCorrectionPlan(await store.readRecords(), [correction()])
    const approval = buildCatalogApprovalTemplate(plan)
    approval.reviewer = 'Jeremy'
    approval.approvedAt = '2026-08-23T00:00:00.000Z'
    approval.decisions = approval.decisions.map((decision) => ({ ...decision, approved: true }))
    const result = await executeCatalogCorrections({ apply: true, plan, store, artifactStore: artifacts, approval, exportPath: '/tmp/pre.json', reportPath: '/tmp/report.json' })
    expect(result.status).toBe('completed')
    expect(store.records[0].fields).toMatchObject({ name: 'After', imageUrl: null, manufacturer: 'Before vendor' })
    expect(artifacts.files.has('/tmp/pre.json')).toBe(true)
    expect(JSON.parse(artifacts.files.get('/tmp/pre.json')!)).toMatchObject({ provenanceState: { sources: [] } })
    expect(artifacts.files.has('/tmp/report.json')).toBe(true)
  })
})
