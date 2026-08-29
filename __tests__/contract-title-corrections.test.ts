import {
  CONTRACT_TITLE_MAPPING,
  buildContractTitlePlan,
  buildTitleApprovalTemplate,
  executeContractTitles,
  parseContractTitleCli,
  type ContractTitleArtifactStore,
  type ContractTitleStore,
  type ContractTitleTransaction,
} from '@/lib/contracts/contract-title-corrections'
import { snapshotSha256, type ContractSnapshotRow } from '@/lib/contracts/packet1-apply'

const TOTAL = 228

function cloneRows(rows: ContractSnapshotRow[]): ContractSnapshotRow[] {
  return JSON.parse(JSON.stringify(rows)) as ContractSnapshotRow[]
}

function fixtureRows(): ContractSnapshotRow[] {
  const titleRows = CONTRACT_TITLE_MAPPING.map((mapping, index) => ({
    id: mapping.id,
    contractNumber: mapping.contractNumber,
    title: mapping.beforeTitle,
    index,
  }))
  const fillerRows = Array.from({ length: TOTAL - titleRows.length }, (_, index) => ({
    id: `filler-${String(index).padStart(3, '0')}`,
    contractNumber: `FILLER-${index}`,
    title: `Filler ${index}`,
    index: titleRows.length + index,
  }))
  return [...titleRows, ...fillerRows]
    .map(({ id, contractNumber, title, index }) => ({
      id,
      contractNumber,
      title,
      description: `Description ${index}`,
      awardDate: '2023-01-01T00:00:00.000Z',
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
      sourceUrl: `https://www.usaspending.gov/award/${contractNumber}/`,
      scrapedAt: '2026-05-04T00:00:01.000Z',
      createdAt: '2026-05-04T00:00:01.000Z',
      updatedAt: '2026-05-05T00:00:00.000Z',
    }))
    .sort((left, right) => left.id.localeCompare(right.id))
}

function packet() {
  return {
    proposals: CONTRACT_TITLE_MAPPING.map((mapping) => ({
      contractId: mapping.id,
      contractNumber: mapping.contractNumber,
      before: { title: mapping.beforeTitle },
      proposed: { title: mapping.sourceProposalTitle },
      evidence: {
        description: mapping.sourceDescription,
        evidenceApiUrl: mapping.evidenceApiUrl,
      },
    })),
  }
}

class MemoryArtifacts implements ContractTitleArtifactStore {
  files = new Map<string, string>()
  async exists(filePath: string) { return this.files.has(filePath) }
  async writeExclusive(filePath: string, contents: string) {
    if (this.files.has(filePath)) throw new Error(`already exists: ${filePath}`)
    this.files.set(filePath, contents)
  }
}

class MemoryStore implements ContractTitleStore {
  rows: ContractSnapshotRow[]
  transactionCount = 0
  updateCount = 0
  affectedRows = 9
  mutateAfterUpdate?: (rows: ContractSnapshotRow[]) => void

  constructor(rows: ContractSnapshotRow[]) { this.rows = cloneRows(rows) }
  async readSnapshot() { return cloneRows(this.rows) }
  async transaction<T>(callback: (transaction: ContractTitleTransaction) => Promise<T>): Promise<T> {
    this.transactionCount += 1
    const working = cloneRows(this.rows)
    const result = await callback({
      readLockedSnapshot: async () => cloneRows(working),
      updateTitles: async (updates) => {
        this.updateCount += 1
        for (const update of updates) working.find((row) => row.id === update.id)!.title = update.after
        this.mutateAfterUpdate?.(working)
        return this.affectedRows
      },
      readSnapshot: async () => cloneRows(working),
    })
    this.rows = working
    return result
  }
}

function plan(rows = fixtureRows()) {
  return buildContractTitlePlan({
    packet: packet(),
    postPacket1Snapshot: rows,
    expectedPostPacket1Sha256: snapshotSha256(rows),
  })
}

function approved(titlePlan = plan()) {
  const approval = buildTitleApprovalTemplate(titlePlan)
  return {
    ...approval,
    reviewer: 'Jeremy',
    approvedAt: '2026-08-23T18:00:00.000Z',
    decisions: approval.decisions.map((decision) => ({ ...decision, approved: true })),
  }
}

describe('nine-row contract title correction packet', () => {
  it('contains exactly nine expected records and corrects Arial to Aerial', () => {
    const titlePlan = plan()
    expect(titlePlan.titleUpdates).toHaveLength(9)
    expect(titlePlan.reviewRows).toHaveLength(9)
    expect(titlePlan.titleUpdates.find((row) => row.id === 'cmoqh3yzx002h1yog4xgbkift')).toMatchObject({
      before: '4558243344',
      after: 'Counter Unmanned Aerial System Camera',
    })
  })

  it('defaults to dry-run and requires absolute outside-repository artifact paths', () => {
    expect(parseContractTitleCli([
      '--export=/private/tmp/pre.json', '--report=/private/tmp/report.json',
    ], '/repo')).toMatchObject({ apply: false, action: 'apply' })
    expect(() => parseContractTitleCli(['--export=relative.json', '--report=/private/tmp/report.json'], '/repo')).toThrow('absolute')
    expect(() => parseContractTitleCli(['--export=/repo/pre.json', '--report=/private/tmp/report.json'], '/repo')).toThrow('outside')
  })

  it('dry-run performs no database or export writes and emits the review report', async () => {
    const titlePlan = plan()
    const store = new MemoryStore(titlePlan.baselineSnapshot)
    const artifacts = new MemoryArtifacts()
    const result = await executeContractTitles({
      action: 'apply', apply: false, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: titlePlan, store, artifactStore: artifacts,
    })
    expect(result.databaseWritten).toBe(false)
    expect(store.transactionCount).toBe(0)
    expect(artifacts.files.has('/private/tmp/pre.json')).toBe(false)
    expect(JSON.parse(artifacts.files.get('/private/tmp/report.json')!).rows).toHaveLength(9)
  })

  it('rejects baseline drift before writing artifacts', async () => {
    const titlePlan = plan()
    const drifted = cloneRows(titlePlan.baselineSnapshot)
    drifted[0].status = 'changed'
    const artifacts = new MemoryArtifacts()
    await expect(executeContractTitles({
      action: 'apply', apply: false, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: titlePlan, store: new MemoryStore(drifted), artifactStore: artifacts,
    })).rejects.toThrow('baseline drift')
    expect(artifacts.files.size).toBe(0)
  })

  it('rejects existing export and report paths', async () => {
    const titlePlan = plan()
    for (const existing of ['/private/tmp/pre.json', '/private/tmp/report.json']) {
      const artifacts = new MemoryArtifacts()
      artifacts.files.set(existing, '{}')
      await expect(executeContractTitles({
        action: 'apply', apply: false, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
        plan: titlePlan, store: new MemoryStore(titlePlan.baselineSnapshot), artifactStore: artifacts,
      })).rejects.toThrow('already exists')
    }
  })

  it('rejects missing, extra, duplicate, or unexpected title IDs', () => {
    const baseline = fixtureRows()
    const cases = [packet(), packet(), packet(), packet()]
    cases[0].proposals.pop()
    cases[1].proposals.push({ ...cases[1].proposals[0], contractId: 'unexpected-id' })
    cases[2].proposals[1].contractId = cases[2].proposals[0].contractId
    cases[3].proposals[0].contractId = 'unexpected-id'
    for (const candidate of cases) {
      expect(() => buildContractTitlePlan({
        packet: candidate,
        postPacket1Snapshot: baseline,
        expectedPostPacket1Sha256: snapshotSha256(baseline),
      })).toThrow(/exactly nine|duplicate|unexpected/i)
    }
  })

  it('rejects before-title mismatches', () => {
    const candidate = packet()
    candidate.proposals[0].before.title = 'wrong title'
    expect(() => buildContractTitlePlan({
      packet: candidate,
      postPacket1Snapshot: fixtureRows(),
      expectedPostPacket1Sha256: snapshotSha256(fixtureRows()),
    })).toThrow('before-title')
  })

  it('makes non-title field updates impossible in the executable plan', () => {
    const titlePlan = plan()
    expect(Object.keys(titlePlan.titleUpdates[0]).sort()).toEqual(['after', 'before', 'id'])
    const before = titlePlan.baselineSnapshot.find((row) => row.id === titlePlan.titleUpdates[0].id)!
    const after = titlePlan.appliedSnapshot.find((row) => row.id === titlePlan.titleUpdates[0].id)!
    expect({ ...after, title: before.title }).toEqual(before)
  })

  it('requires explicit mapping approval before write mode', async () => {
    const titlePlan = plan()
    await expect(executeContractTitles({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/report.json',
      plan: titlePlan, store: new MemoryStore(titlePlan.baselineSnapshot), artifactStore: new MemoryArtifacts(),
    })).rejects.toThrow('approval')
  })

  it('applies and rolls back only titles in the mock store', async () => {
    const titlePlan = plan()
    const original = cloneRows(titlePlan.baselineSnapshot)
    const store = new MemoryStore(original)
    const artifacts = new MemoryArtifacts()
    await executeContractTitles({
      action: 'apply', apply: true, exportPath: '/private/tmp/pre.json', reportPath: '/private/tmp/apply.json',
      approval: approved(titlePlan), plan: titlePlan, store, artifactStore: artifacts,
    })
    expect(store.rows).toEqual(titlePlan.appliedSnapshot)
    await executeContractTitles({
      action: 'rollback', apply: true, exportPath: '/private/tmp/pre-rollback.json', reportPath: '/private/tmp/rollback.json',
      preApplySnapshot: original, plan: titlePlan, store, artifactStore: artifacts,
    })
    expect(store.rows).toEqual(original)
  })

  it('rollback rejects concurrent title changes', async () => {
    const titlePlan = plan()
    const concurrent = cloneRows(titlePlan.appliedSnapshot)
    concurrent.find((row) => row.id === titlePlan.titleUpdates[0].id)!.title = 'concurrent edit'
    await expect(executeContractTitles({
      action: 'rollback', apply: true, exportPath: '/private/tmp/pre-rollback.json', reportPath: '/private/tmp/rollback.json',
      preApplySnapshot: titlePlan.baselineSnapshot, plan: titlePlan,
      store: new MemoryStore(concurrent), artifactStore: new MemoryArtifacts(),
    })).rejects.toThrow('rollback drift')
  })
})
