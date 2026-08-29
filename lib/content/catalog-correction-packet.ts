import { createHash } from 'node:crypto'
import path from 'node:path'
import { ALL_KNOWN_CATALOG_CORRECTIONS, type CatalogCorrection, type CatalogEntityType, type CatalogFieldValue } from './known-catalog-corrections'

export interface CatalogRecordSnapshot {
  entityType: CatalogEntityType
  id: string
  slug: string
  fields: Record<string, unknown>
}

export interface CatalogFieldDecision {
  entityType: CatalogEntityType
  slug: string
  field: string
  before: CatalogFieldValue
  after: CatalogFieldValue
  approved: boolean
}

export interface CatalogApprovalArtifact {
  packetSha256: string
  reviewer: string | null
  approvedAt: string | null
  decisions: CatalogFieldDecision[]
}

export interface CatalogCorrectionPlan {
  packetSha256: string
  corrections: CatalogCorrection[]
  baseline: CatalogRecordSnapshot[]
  proposed: CatalogRecordSnapshot[]
  decisions: CatalogFieldDecision[]
}

export interface CatalogCorrectionStore {
  readRecords(): Promise<CatalogRecordSnapshot[]>
  readRollbackState?(): Promise<unknown>
  transaction<T>(callback: (transaction: CatalogCorrectionTransaction) => Promise<T>): Promise<T>
}

export interface CatalogCorrectionTransaction {
  readLockedRecords(): Promise<CatalogRecordSnapshot[]>
  applyCorrection(correction: CatalogCorrection, recordId: string): Promise<void>
  readRecords(): Promise<CatalogRecordSnapshot[]>
}

export interface CatalogArtifactStore {
  exists(filePath: string): Promise<boolean>
  writeExclusive(filePath: string, contents: string): Promise<void>
}

export interface CatalogCliOptions {
  apply: boolean
  exportPath?: string
  reportPath?: string
  approvalPath?: string
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, stable(item)]))
  }
  return value
}

export function sha256(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex')
}

function fieldValue(record: CatalogRecordSnapshot, field: string): CatalogFieldValue {
  const value = record.fields[field]
  if (value === undefined && field === 'provenanceLabel') return 'unverified'
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) return value as string[]
  throw new Error(`${record.entityType}:${record.slug}.${field} is not a supported catalog field value.`)
}

export function baselineView(correction: CatalogCorrection, record: CatalogRecordSnapshot): Record<string, CatalogFieldValue> {
  return Object.fromEntries(Object.keys(correction.changes).sort().map((field) => [field, fieldValue(record, field)]))
}

export function correctionBaselineSha256(correction: CatalogCorrection, record: CatalogRecordSnapshot): string {
  const editorialFields = Object.fromEntries(Object.entries(record.fields).filter(([field]) => !['views', 'updatedAt'].includes(field)))
  if (editorialFields.provenanceLabel === undefined) editorialFields.provenanceLabel = 'unverified'
  return sha256({ entityType: correction.entityType, slug: correction.slug, fields: editorialFields })
}

export function catalogPacketSha256(corrections: CatalogCorrection[] = ALL_KNOWN_CATALOG_CORRECTIONS): string {
  return sha256(corrections)
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function key(entityType: CatalogEntityType, slug: string): string {
  return `${entityType}:${slug}`
}

function assertUnique(records: CatalogRecordSnapshot[], label: string): void {
  const keys = records.map((record) => key(record.entityType, record.slug))
  if (new Set(keys).size !== keys.length) throw new Error(`${label} contains duplicate entity/slug records.`)
}

export function buildCatalogCorrectionPlan(records: CatalogRecordSnapshot[], corrections: CatalogCorrection[] = ALL_KNOWN_CATALOG_CORRECTIONS): CatalogCorrectionPlan {
  assertUnique(records, 'Catalog snapshot')
  const byKey = new Map(records.map((record) => [key(record.entityType, record.slug), record]))
  const baseline: CatalogRecordSnapshot[] = []
  const proposed: CatalogRecordSnapshot[] = []
  const decisions: CatalogFieldDecision[] = []
  for (const correction of corrections) {
    const record = byKey.get(key(correction.entityType, correction.slug))
    if (!record) throw new Error(`Missing affected record ${key(correction.entityType, correction.slug)}.`)
    const actualHash = correctionBaselineSha256(correction, record)
    if (correction.baselineSha256 === 'PENDING') throw new Error(`Baseline SHA-256 is not sealed for ${key(correction.entityType, correction.slug)}; computed ${actualHash}.`)
    if (actualHash !== correction.baselineSha256) throw new Error(`Baseline drift for ${key(correction.entityType, correction.slug)}: expected ${correction.baselineSha256}, found ${actualHash}.`)
    const before = baselineView(correction, record)
    baseline.push(clone(record))
    proposed.push({ ...clone(record), fields: { ...clone(record.fields), ...clone(correction.changes) } })
    for (const field of Object.keys(correction.changes).sort()) {
      decisions.push({ entityType: correction.entityType, slug: correction.slug, field, before: before[field], after: correction.changes[field], approved: false })
    }
  }
  return { packetSha256: catalogPacketSha256(corrections), corrections, baseline, proposed, decisions }
}

export function buildCatalogApprovalTemplate(plan: CatalogCorrectionPlan): CatalogApprovalArtifact {
  return { packetSha256: plan.packetSha256, reviewer: null, approvedAt: null, decisions: clone(plan.decisions) }
}

export function validateCatalogApproval(plan: CatalogCorrectionPlan, value: unknown): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Apply requires an approval artifact for this exact packet.')
  const approval = value as Partial<CatalogApprovalArtifact>
  if (approval.packetSha256 !== plan.packetSha256 || approval.reviewer !== 'Jeremy' || typeof approval.approvedAt !== 'string') {
    throw new Error('Apply requires Jeremy approval for this exact catalog packet SHA-256.')
  }
  const expected = plan.decisions.map((decision) => ({ ...decision, approved: true }))
  if (JSON.stringify(approval.decisions) !== JSON.stringify(expected)) throw new Error('Approval decisions do not match every exact catalog field and image change.')
}

function externalPath(value: string | undefined, repositoryRoot: string, flag: string): string {
  if (!value) throw new Error(`${flag}=/absolute/path.json is required with --apply.`)
  if (!path.isAbsolute(value)) throw new Error(`${flag} must be an absolute path.`)
  const resolved = path.resolve(value)
  const repository = path.resolve(repositoryRoot)
  if (resolved === repository || resolved.startsWith(`${repository}${path.sep}`)) throw new Error(`${flag} must be outside the repository.`)
  return resolved
}

export function parseCatalogCli(argv: string[], repositoryRoot: string): CatalogCliOptions {
  const prefixes = ['--export=', '--report=', '--approval=']
  const unknown = argv.filter((argument) => argument !== '--apply' && !prefixes.some((prefix) => argument.startsWith(prefix)))
  if (unknown.length) throw new Error(`Unsupported arguments: ${unknown.join(', ')}`)
  const valueFor = (prefix: string) => argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
  const apply = argv.includes('--apply')
  if (!apply) return { apply: false }
  return {
    apply: true,
    exportPath: externalPath(valueFor('--export='), repositoryRoot, '--export'),
    reportPath: externalPath(valueFor('--report='), repositoryRoot, '--report'),
    approvalPath: externalPath(valueFor('--approval='), repositoryRoot, '--approval'),
  }
}

function comparable(records: CatalogRecordSnapshot[]): unknown {
  return records
    .map((record) => ({ ...record, fields: Object.fromEntries(Object.entries(record.fields).filter(([field]) => field !== 'updatedAt')) }))
    .sort((left, right) => key(left.entityType, left.slug).localeCompare(key(right.entityType, right.slug)))
}

function assertRecordSet(actual: CatalogRecordSnapshot[], expected: CatalogRecordSnapshot[], label: string): void {
  const actualComparable = comparable(actual)
  const expectedComparable = comparable(expected)
  if (JSON.stringify(stable(actualComparable)) === JSON.stringify(stable(expectedComparable))) return
  const actualByKey = new Map((actualComparable as CatalogRecordSnapshot[]).map((record) => [key(record.entityType, record.slug), record]))
  for (const expectedRecord of expectedComparable as CatalogRecordSnapshot[]) {
    const actualRecord = actualByKey.get(key(expectedRecord.entityType, expectedRecord.slug)) as CatalogRecordSnapshot | undefined
    if (!actualRecord) throw new Error(`${label}: missing record ${key(expectedRecord.entityType, expectedRecord.slug)}.`)
    const fields = new Set([...Object.keys(expectedRecord.fields), ...Object.keys(actualRecord.fields)])
    for (const field of [...fields].sort()) {
      if (JSON.stringify(stable(actualRecord.fields[field])) !== JSON.stringify(stable(expectedRecord.fields[field]))) {
        throw new Error(`${label}: ${key(expectedRecord.entityType, expectedRecord.slug)}.${field} differs; expected=${JSON.stringify(expectedRecord.fields[field])} actual=${JSON.stringify(actualRecord.fields[field])}`)
      }
    }
  }
  throw new Error(`${label}: snapshot differs; expected=${JSON.stringify(stable((expectedComparable as unknown[])[0]))} actual=${JSON.stringify(stable((actualComparable as unknown[])[0]))}`)
}

export async function executeCatalogCorrections(options: {
  apply: boolean
  plan: CatalogCorrectionPlan
  store: CatalogCorrectionStore
  artifactStore: CatalogArtifactStore
  exportPath?: string
  reportPath?: string
  approval?: unknown
  now?: () => Date
}): Promise<Record<string, unknown>> {
  const current = await options.store.readRecords()
  const freshPlan = buildCatalogCorrectionPlan(current, options.plan.corrections)
  if (freshPlan.packetSha256 !== options.plan.packetSha256) throw new Error('Catalog packet definition drifted after review.')
  const generatedAt = (options.now?.() || new Date()).toISOString()
  const report = {
    status: options.apply ? 'completed' : 'dry-run-review',
    databaseWritten: options.apply,
    packetSha256: options.plan.packetSha256,
    recordCount: options.plan.corrections.length,
    fieldChangeCount: options.plan.decisions.length,
    records: options.plan.corrections.map((correction) => ({
      entityType: correction.entityType, slug: correction.slug, reason: correction.reason,
      before: baselineView(correction, current.find((record) => key(record.entityType, record.slug) === key(correction.entityType, correction.slug))!),
      after: correction.changes, evidence: correction.evidence, sources: correction.sources,
      mediaVerificationState: correction.mediaVerificationState || correction.media?.verificationState || null,
    })),
    approvalTemplate: buildCatalogApprovalTemplate(options.plan),
  }
  if (!options.apply) return report
  if (!options.exportPath || !options.reportPath) throw new Error('--apply requires external export and report paths.')
  validateCatalogApproval(options.plan, options.approval)
  if (await options.artifactStore.exists(options.exportPath)) throw new Error(`Rollback export already exists: ${options.exportPath}`)
  if (await options.artifactStore.exists(options.reportPath)) throw new Error(`Apply report already exists: ${options.reportPath}`)
  const provenanceState = options.store.readRollbackState ? await options.store.readRollbackState() : null
  await options.artifactStore.writeExclusive(options.exportPath, `${JSON.stringify({ generatedAt, packetSha256: options.plan.packetSha256, records: current, provenanceState }, null, 2)}\n`)
  await options.store.transaction(async (transaction) => {
    const locked = await transaction.readLockedRecords()
    buildCatalogCorrectionPlan(locked, options.plan.corrections)
    for (const correction of options.plan.corrections) {
      const record = locked.find((item) => key(item.entityType, item.slug) === key(correction.entityType, correction.slug))!
      await transaction.applyCorrection(correction, record.id)
    }
    assertRecordSet(await transaction.readRecords(), freshPlan.proposed, 'Transaction verification')
  })
  const committed = await options.store.readRecords()
  assertRecordSet(committed, freshPlan.proposed, 'Post-commit verification')
  const completed = { ...report, completedAt: generatedAt, postCommitSha256: sha256(comparable(committed)) }
  await options.artifactStore.writeExclusive(options.reportPath, `${JSON.stringify(completed, null, 2)}\n`)
  return completed
}
