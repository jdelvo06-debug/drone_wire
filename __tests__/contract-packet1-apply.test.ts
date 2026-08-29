import {
  buildPacket1Plan,
  executePacket1,
  parsePacket1Cli,
  snapshotSha256,
  type ContractSnapshotRow,
  type Packet1ArtifactStore,
  type Packet1Store,
  type Packet1Transaction,
} from '@/lib/contracts/packet1-apply'

const COUNT = 228
const URL_COUNT = 161

function cloneRows(value: ContractSnapshotRow[]): ContractSnapshotRow[] {
  return JSON.parse(JSON.stringify(value)) as ContractSnapshotRow[]
}

function rows(): ContractSnapshotRow[] {
  return Array.from({ length: COUNT }, (_, index) => ({
    id: `contract-${String(index).padStart(3, '0')}`,
    contractNumber: `AWARD-${index}`,
    title: `Contract ${index}`,
    description: `Description ${index}`,
    awardDate: '2026-05-04T00:00:00.000Z',
    company: `Company ${index}`,
    contractorType: 'prime',
    value: `${index + 1}.00`,
    currency: 'USD',
    duration: null,
    status: 'active',
    category: 'counter-uas',
    agency: 'Department of Defense',
    office: null,
    location: null,
    keyPersonnel: null,
    relatedSystems: null,
    sourceUrl: index < URL_COUNT ? `https://old.example/${index}` : null,
    scrapedAt: '2026-05-04T00:00:01.000Z',
    createdAt: '2026-05-04T00:00:01.000Z',
    updatedAt: '2026-05-05T00:00:00.000Z',
  }))
}

function artifacts(baseline = rows()) {
  const hash = snapshotSha256(baseline)
  return {
    packet: {
      scope: { expectedContracts: COUNT, actualContracts: COUNT, readOnly: true },
      summary: {
        totalContractsProcessed: COUNT,
        contractsWithAuthoritativeDateEvidence: COUNT,
        contractsWithCorrectedCanonicalUrls: URL_COUNT,
        contractsStillUnresolved: 0,
        databaseBeforeCount: COUNT,
        databaseAfterCount: COUNT,
        databaseBeforeSha256: hash,
        databaseAfterSha256: hash,
        databasePreserved: true,
      },
      proposals: baseline.map((row, index) => ({
        contractId: row.id,
        contractNumber: row.contractNumber,
        status: 'proposed',
        before: { awardDate: row.awardDate, sourceUrl: row.sourceUrl, title: row.title },
        proposed: {
          awardDate: `2023-01-${String((index % 28) + 1).padStart(2, '0')}T00:00:00.000Z`,
          sourceUrl: index < URL_COUNT ? `https://www.usaspending.gov/award/${row.contractNumber}/` : null,
          title: index < 9 ? `Unapproved title ${index}` : null,
        },
        unresolvedFields: [],
      })),
    },
    rollback: { generatedAt: '2026-08-23T00:00:00.000Z', rowCount: COUNT, sha256: hash, contracts: baseline },
  }
}

class MemoryArtifacts implements Packet1ArtifactStore {
  readonly files = new Map<string, string>()
  async exists(filePath: string) { return this.files.has(filePath) }
  async writeExclusive(filePath: string, contents: string) {
    if (this.files.has(filePath)) throw new Error(`Artifact already exists: ${filePath}`)
    this.files.set(filePath, contents)
  }
}

class MemoryStore implements Packet1Store {
  rows: ContractSnapshotRow[]
  dateResult = COUNT
  urlResult = URL_COUNT
  transactionCount = 0
  dateWrites = 0
  urlWrites = 0
  mutateAfterWrite?: (rows: ContractSnapshotRow[]) => void

  constructor(initial: ContractSnapshotRow[]) { this.rows = cloneRows(initial) }
  async readSnapshot() { return cloneRows(this.rows) }
  async transaction<T>(callback: (transaction: Packet1Transaction) => Promise<T>): Promise<T> {
    this.transactionCount += 1
    const working = cloneRows(this.rows)
    const transaction: Packet1Transaction = {
      readLockedSnapshot: async () => cloneRows(working),
      updateAwardDates: async (updates) => {
        this.dateWrites += 1
        for (const update of updates) {
          const row = working.find((candidate) => candidate.id === update.id)!
          row.awardDate = update.after
        }
        return this.dateResult
      },
      updateSourceUrls: async (updates) => {
        this.urlWrites += 1
        for (const update of updates) {
          const row = working.find((candidate) => candidate.id === update.id)!
          row.sourceUrl = update.after
        }
        this.mutateAfterWrite?.(working)
        return this.urlResult
      },
      readSnapshot: async () => cloneRows(working),
    }
    const result = await callback(transaction)
    this.rows = working
    return result
  }
}

describe('Packet 1 contract source/date apply guards', () => {
  it('builds a 228-date/161-URL plan and deliberately excludes title proposals', () => {
    const { packet, rollback } = artifacts()
    const plan = buildPacket1Plan(packet, rollback)

    expect(plan.awardDateUpdates).toHaveLength(COUNT)
    expect(plan.sourceUrlUpdates).toHaveLength(URL_COUNT)
    expect(Object.keys(plan.awardDateUpdates[0]).sort()).toEqual(['after', 'before', 'id'])
    expect(Object.keys(plan.sourceUrlUpdates[0]).sort()).toEqual(['after', 'before', 'id'])
    expect(JSON.stringify(plan)).not.toContain('Unapproved title')
  })

  it('defaults to dry-run and requires an explicit absolute export path', () => {
    expect(parsePacket1Cli(['--export=/private/tmp/pre-apply.json'], '/repo')).toMatchObject({ apply: false, action: 'apply' })
    expect(() => parsePacket1Cli([], '/repo')).toThrow('explicit --export')
    expect(() => parsePacket1Cli(['--export=relative.json'], '/repo')).toThrow('absolute')
  })

  it('performs a dry-run without database or artifact writes', async () => {
    const { packet, rollback } = artifacts()
    const store = new MemoryStore(rollback.contracts)
    const artifactStore = new MemoryArtifacts()

    const result = await executePacket1({
      action: 'apply', apply: false, exportPath: '/private/tmp/pre-apply.json',
      plan: buildPacket1Plan(packet, rollback), store, artifactStore,
    })

    expect(result.status).toBe('dry-run-ready')
    expect(store.transactionCount).toBe(0)
    expect(artifactStore.files.size).toBe(0)
  })

  it('rejects an existing export before any transaction', async () => {
    const { packet, rollback } = artifacts()
    const store = new MemoryStore(rollback.contracts)
    const artifactStore = new MemoryArtifacts()
    artifactStore.files.set('/private/tmp/existing.json', '{}')

    await expect(executePacket1({
      action: 'apply', apply: true, exportPath: '/private/tmp/existing.json', reportPath: '/private/tmp/report.json',
      plan: buildPacket1Plan(packet, rollback), store, artifactStore,
    })).rejects.toThrow('already exists')
    expect(store.transactionCount).toBe(0)
  })

  it('refuses packet hash drift, missing IDs, duplicate IDs, and before-value mismatches', () => {
    const base = rows()
    const a = artifacts(base)
    a.rollback.sha256 = '0'.repeat(64)
    expect(() => buildPacket1Plan(a.packet, a.rollback)).toThrow('SHA-256')

    const b = artifacts(base)
    b.packet.proposals.pop()
    expect(() => buildPacket1Plan(b.packet, b.rollback)).toThrow('exactly 228')

    const c = artifacts(base)
    c.packet.proposals[1].contractId = c.packet.proposals[0].contractId
    expect(() => buildPacket1Plan(c.packet, c.rollback)).toThrow('duplicate')

    const d = artifacts(base)
    d.packet.proposals[0].before.awardDate = '2000-01-01T00:00:00.000Z'
    expect(() => buildPacket1Plan(d.packet, d.rollback)).toThrow('before values')
  })

  it('refuses live database drift before creating an export', async () => {
    const { packet, rollback } = artifacts()
    const drifted = cloneRows(rollback.contracts)
    drifted[0].status = 'changed concurrently'
    const store = new MemoryStore(drifted)
    const artifactStore = new MemoryArtifacts()

    await expect(executePacket1({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: buildPacket1Plan(packet, rollback), store, artifactStore,
    })).rejects.toThrow('database drift')
    expect(artifactStore.files.size).toBe(0)
  })

  it('requires exact affected row counts and rolls the transaction back', async () => {
    const { packet, rollback } = artifacts()
    const store = new MemoryStore(rollback.contracts)
    store.urlResult = URL_COUNT - 1
    const artifactStore = new MemoryArtifacts()

    await expect(executePacket1({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: buildPacket1Plan(packet, rollback), store, artifactStore,
    })).rejects.toThrow('expected 161 sourceUrl rows')
    expect(store.rows).toEqual(rollback.contracts)
  })

  it('detects any untouched-field mutation before commit', async () => {
    const { packet, rollback } = artifacts()
    const store = new MemoryStore(rollback.contracts)
    store.mutateAfterWrite = (current) => { current[0].status = 'silently changed' }

    await expect(executePacket1({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: buildPacket1Plan(packet, rollback), store, artifactStore: new MemoryArtifacts(),
    })).rejects.toThrow('untouched field')
    expect(store.rows).toEqual(rollback.contracts)
  })

  it('applies and rolls back safely in the mock store without changing title or status', async () => {
    const { packet, rollback } = artifacts()
    const plan = buildPacket1Plan(packet, rollback)
    const store = new MemoryStore(rollback.contracts)
    const artifactsStore = new MemoryArtifacts()
    await executePacket1({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/apply-report.json',
      plan, store, artifactStore: artifactsStore,
    })
    expect(JSON.parse(artifactsStore.files.get('/private/tmp/pre.json')!)).toMatchObject({ rowCount: COUNT })
    expect(store.rows[0].title).toBe(rollback.contracts[0].title)
    expect(store.rows[0].status).toBe(rollback.contracts[0].status)

    await executePacket1({
      action: 'rollback', apply: true, exportPath: '/private/tmp/pre-rollback.json', reportPath: '/private/tmp/rollback-report.json',
      plan, preApplySnapshot: rollback.contracts, store, artifactStore: artifactsStore,
    })
    expect(store.rows).toEqual(rollback.contracts)
  })

  it('refuses rollback if current applied values or the pre-apply snapshot drifted', async () => {
    const { packet, rollback } = artifacts()
    const plan = buildPacket1Plan(packet, rollback)
    const applied = cloneRows(plan.appliedSnapshot)
    applied[0].sourceUrl = 'https://concurrent.example/change'

    await expect(executePacket1({
      action: 'rollback', apply: true, exportPath: '/private/tmp/pre-rollback.json', reportPath: '/private/tmp/report.json',
      plan, preApplySnapshot: rollback.contracts, store: new MemoryStore(applied), artifactStore: new MemoryArtifacts(),
    })).rejects.toThrow('rollback drift')

    const badPreApply = cloneRows(rollback.contracts)
    badPreApply[0].title = 'wrong snapshot'
    await expect(executePacket1({
      action: 'rollback', apply: false, exportPath: '/private/tmp/pre-rollback.json',
      plan, preApplySnapshot: badPreApply, store: new MemoryStore(plan.appliedSnapshot), artifactStore: new MemoryArtifacts(),
    })).rejects.toThrow('pre-apply snapshot')
  })
})
