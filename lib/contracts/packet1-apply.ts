import { createHash } from 'crypto'
import path from 'path'

export const PACKET1_CONTRACT_COUNT = 228
export const PACKET1_AWARD_DATE_COUNT = 228
export const PACKET1_SOURCE_URL_COUNT = 161
export const DEFAULT_PACKET_PATH = '/private/tmp/dronewire-contract-reconstruction-20260823-v2/contract-proposals.json'
export const DEFAULT_BASELINE_PATH = '/private/tmp/dronewire-contract-reconstruction-20260823-v2/contract-rollback-export.json'

export interface ContractSnapshotRow {
  id: string
  contractNumber: string | null
  title: string
  description: string | null
  awardDate: string
  company: string
  contractorType: string
  value: string
  currency: string
  duration: number | null
  status: string
  category: string
  agency: string
  office: string | null
  location: string | null
  keyPersonnel: string[] | null
  relatedSystems: string[] | null
  sourceUrl: string | null
  scrapedAt: string
  createdAt: string
  updatedAt: string
}

export interface Packet1Update<T> {
  id: string
  before: T
  after: T
}

export interface Packet1Plan {
  expectedBaselineSha256: string
  baselineSnapshot: ContractSnapshotRow[]
  appliedSnapshot: ContractSnapshotRow[]
  awardDateUpdates: Array<Packet1Update<string>>
  sourceUrlUpdates: Array<Packet1Update<string | null>>
}

export interface Packet1Transaction {
  readLockedSnapshot(): Promise<ContractSnapshotRow[]>
  updateAwardDates(updates: Array<Packet1Update<string>>): Promise<number>
  updateSourceUrls(updates: Array<Packet1Update<string | null>>): Promise<number>
  readSnapshot(): Promise<ContractSnapshotRow[]>
}

export interface Packet1Store {
  readSnapshot(): Promise<ContractSnapshotRow[]>
  transaction<T>(callback: (transaction: Packet1Transaction) => Promise<T>): Promise<T>
}

export interface Packet1ArtifactStore {
  exists(filePath: string): Promise<boolean>
  writeExclusive(filePath: string, contents: string): Promise<void>
}

export interface Packet1CliOptions {
  action: 'apply' | 'rollback'
  apply: boolean
  exportPath: string
  reportPath?: string
  packetPath: string
  baselinePath: string
  preApplyExportPath?: string
}

interface PacketProposal {
  contractId: string
  contractNumber: string | null
  status: string
  before: { awardDate: string; sourceUrl: string | null; title: string }
  proposed: { awardDate: string | null; sourceUrl: string | null; title: string | null }
  unresolvedFields: unknown[]
}

interface PacketArtifact {
  scope: { expectedContracts: number; actualContracts: number; readOnly: boolean }
  summary: {
    totalContractsProcessed: number
    contractsWithAuthoritativeDateEvidence: number
    contractsWithCorrectedCanonicalUrls: number
    contractsStillUnresolved: number
    databaseBeforeCount: number
    databaseAfterCount: number
    databaseBeforeSha256: string
    databaseAfterSha256: string
    databasePreserved: boolean
  }
  proposals: PacketProposal[]
}

interface RollbackArtifact {
  generatedAt: string
  rowCount: number
  sha256: string
  contracts: ContractSnapshotRow[]
}

export function snapshotSha256(rows: ContractSnapshotRow[]): string {
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex')
}

function cloneRows(rows: ContractSnapshotRow[]): ContractSnapshotRow[] {
  return JSON.parse(JSON.stringify(rows)) as ContractSnapshotRow[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object.`)
  return value
}

function requireArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`)
  return value
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new Error(`${label} must be a string.`)
  return value
}

function requireNullableString(value: unknown, label: string): string | null {
  if (value !== null && typeof value !== 'string') throw new Error(`${label} must be a string or null.`)
  return value
}

function requireNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${label} must be a finite number.`)
  return value
}

function parseContractRow(value: unknown, index: number): ContractSnapshotRow {
  const row = requireRecord(value, `rollback contracts[${index}]`)
  const requiredStringFields = [
    'id', 'title', 'awardDate', 'company', 'contractorType', 'value', 'currency', 'status',
    'category', 'agency', 'scrapedAt', 'createdAt', 'updatedAt',
  ] as const
  for (const field of requiredStringFields) requireString(row[field], `rollback contracts[${index}].${field}`)
  for (const field of ['contractNumber', 'description', 'office', 'location', 'sourceUrl'] as const) {
    requireNullableString(row[field], `rollback contracts[${index}].${field}`)
  }
  if (row.duration !== null && (typeof row.duration !== 'number' || !Number.isFinite(row.duration))) {
    throw new Error(`rollback contracts[${index}].duration must be a finite number or null.`)
  }
  for (const field of ['keyPersonnel', 'relatedSystems'] as const) {
    const value = row[field]
    if (value !== null && (!Array.isArray(value) || !value.every((item: unknown) => typeof item === 'string'))) {
      throw new Error(`rollback contracts[${index}].${field} must be a string array or null.`)
    }
  }
  return row as unknown as ContractSnapshotRow
}

function parseRollbackArtifact(value: unknown): RollbackArtifact {
  const artifact = requireRecord(value, 'rollback artifact')
  const contracts = requireArray(artifact.contracts, 'rollback artifact contracts').map(parseContractRow)
  return {
    generatedAt: requireString(artifact.generatedAt, 'rollback artifact generatedAt'),
    rowCount: requireNumber(artifact.rowCount, 'rollback artifact rowCount'),
    sha256: requireString(artifact.sha256, 'rollback artifact sha256'),
    contracts,
  }
}

function parseProposal(value: unknown, index: number): PacketProposal {
  const proposal = requireRecord(value, `packet proposals[${index}]`)
  const before = requireRecord(proposal.before, `packet proposals[${index}].before`)
  const proposed = requireRecord(proposal.proposed, `packet proposals[${index}].proposed`)
  const expectedBeforeKeys = ['awardDate', 'sourceUrl', 'title']
  const expectedProposedKeys = ['awardDate', 'sourceUrl', 'title']
  if (JSON.stringify(Object.keys(before).sort()) !== JSON.stringify(expectedBeforeKeys)) {
    throw new Error(`packet proposals[${index}].before contains an unexpected field.`)
  }
  if (JSON.stringify(Object.keys(proposed).sort()) !== JSON.stringify(expectedProposedKeys)) {
    throw new Error(`packet proposals[${index}].proposed contains an unexpected field.`)
  }
  return {
    contractId: requireString(proposal.contractId, `packet proposals[${index}].contractId`),
    contractNumber: requireNullableString(proposal.contractNumber, `packet proposals[${index}].contractNumber`),
    status: requireString(proposal.status, `packet proposals[${index}].status`),
    before: {
      awardDate: requireString(before.awardDate, `packet proposals[${index}].before.awardDate`),
      sourceUrl: requireNullableString(before.sourceUrl, `packet proposals[${index}].before.sourceUrl`),
      title: requireString(before.title, `packet proposals[${index}].before.title`),
    },
    proposed: {
      awardDate: requireNullableString(proposed.awardDate, `packet proposals[${index}].proposed.awardDate`),
      sourceUrl: requireNullableString(proposed.sourceUrl, `packet proposals[${index}].proposed.sourceUrl`),
      title: requireNullableString(proposed.title, `packet proposals[${index}].proposed.title`),
    },
    unresolvedFields: requireArray(proposal.unresolvedFields, `packet proposals[${index}].unresolvedFields`),
  }
}

function parsePacketArtifact(value: unknown): PacketArtifact {
  const artifact = requireRecord(value, 'proposal packet')
  const scope = requireRecord(artifact.scope, 'proposal packet scope')
  const summary = requireRecord(artifact.summary, 'proposal packet summary')
  return {
    scope: {
      expectedContracts: requireNumber(scope.expectedContracts, 'proposal packet scope.expectedContracts'),
      actualContracts: requireNumber(scope.actualContracts, 'proposal packet scope.actualContracts'),
      readOnly: scope.readOnly === true,
    },
    summary: {
      totalContractsProcessed: requireNumber(summary.totalContractsProcessed, 'packet summary.totalContractsProcessed'),
      contractsWithAuthoritativeDateEvidence: requireNumber(summary.contractsWithAuthoritativeDateEvidence, 'packet summary.contractsWithAuthoritativeDateEvidence'),
      contractsWithCorrectedCanonicalUrls: requireNumber(summary.contractsWithCorrectedCanonicalUrls, 'packet summary.contractsWithCorrectedCanonicalUrls'),
      contractsStillUnresolved: requireNumber(summary.contractsStillUnresolved, 'packet summary.contractsStillUnresolved'),
      databaseBeforeCount: requireNumber(summary.databaseBeforeCount, 'packet summary.databaseBeforeCount'),
      databaseAfterCount: requireNumber(summary.databaseAfterCount, 'packet summary.databaseAfterCount'),
      databaseBeforeSha256: requireString(summary.databaseBeforeSha256, 'packet summary.databaseBeforeSha256'),
      databaseAfterSha256: requireString(summary.databaseAfterSha256, 'packet summary.databaseAfterSha256'),
      databasePreserved: summary.databasePreserved === true,
    },
    proposals: requireArray(artifact.proposals, 'proposal packet proposals').map(parseProposal),
  }
}

function assertUniqueIds(ids: string[], label: string): void {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${label} contains duplicate contract ID ${id}.`)
    seen.add(id)
  }
}

function assertExactSnapshot(
  actual: ContractSnapshotRow[],
  expected: ContractSnapshotRow[],
  context: string
): void {
  if (actual.length !== PACKET1_CONTRACT_COUNT) {
    throw new Error(`${context}: expected exactly ${PACKET1_CONTRACT_COUNT} rows, found ${actual.length}.`)
  }
  assertUniqueIds(actual.map((row) => row.id), context)
  if (JSON.stringify(actual) === JSON.stringify(expected)) return

  for (let index = 0; index < expected.length; index += 1) {
    const actualRow = actual[index]
    const expectedRow = expected[index]
    if (!actualRow || actualRow.id !== expectedRow.id) {
      throw new Error(`${context}: contract ID/order mismatch at index ${index}.`)
    }
    for (const field of Object.keys(expectedRow) as Array<keyof ContractSnapshotRow>) {
      if (JSON.stringify(actualRow[field]) !== JSON.stringify(expectedRow[field])) {
        const classification = field === 'awardDate' || field === 'sourceUrl' ? 'approved field' : 'untouched field'
        throw new Error(`${context}: ${classification} ${field} differs for ${expectedRow.id}.`)
      }
    }
  }
  throw new Error(`${context}: snapshot differs.`)
}

export function buildPacket1Plan(packetValue: unknown, rollbackValue: unknown): Packet1Plan {
  const packet = parsePacketArtifact(packetValue)
  const rollback = parseRollbackArtifact(rollbackValue)
  const baselineHash = snapshotSha256(rollback.contracts)

  if (rollback.rowCount !== PACKET1_CONTRACT_COUNT || rollback.contracts.length !== PACKET1_CONTRACT_COUNT) {
    throw new Error(`Rollback export must contain exactly ${PACKET1_CONTRACT_COUNT} contracts.`)
  }
  assertUniqueIds(rollback.contracts.map((row) => row.id), 'Rollback export')
  const expectedHashes = [rollback.sha256, packet.summary.databaseBeforeSha256, packet.summary.databaseAfterSha256]
  if (expectedHashes.some((hash) => hash !== baselineHash)) {
    throw new Error('Packet/rollback SHA-256 does not match the exact rollback contract payload.')
  }
  if (!packet.scope.readOnly || !packet.summary.databasePreserved) {
    throw new Error('Packet is not a preserved read-only reconstruction baseline.')
  }
  const requiredCounts = [
    packet.scope.expectedContracts,
    packet.scope.actualContracts,
    packet.summary.totalContractsProcessed,
    packet.summary.contractsWithAuthoritativeDateEvidence,
    packet.summary.databaseBeforeCount,
    packet.summary.databaseAfterCount,
  ]
  if (requiredCounts.some((count) => count !== PACKET1_CONTRACT_COUNT) || packet.proposals.length !== PACKET1_CONTRACT_COUNT) {
    throw new Error(`Proposal packet must describe exactly ${PACKET1_CONTRACT_COUNT} contracts and date changes.`)
  }
  if (packet.summary.contractsWithCorrectedCanonicalUrls !== PACKET1_SOURCE_URL_COUNT) {
    throw new Error(`Proposal packet must describe exactly ${PACKET1_SOURCE_URL_COUNT} sourceUrl changes.`)
  }
  if (packet.summary.contractsStillUnresolved !== 0) throw new Error('Proposal packet contains unresolved contracts.')

  assertUniqueIds(packet.proposals.map((proposal) => proposal.contractId), 'Proposal packet')
  const baselineById = new Map(rollback.contracts.map((row) => [row.id, row]))
  const proposalById = new Map(packet.proposals.map((proposal) => [proposal.contractId, proposal]))
  if ([...baselineById.keys()].some((id) => !proposalById.has(id))) {
    throw new Error('Proposal and rollback contract ID sets do not match.')
  }

  const awardDateUpdates: Array<Packet1Update<string>> = []
  const sourceUrlUpdates: Array<Packet1Update<string | null>> = []
  for (const row of rollback.contracts) {
    const proposal = proposalById.get(row.id)!
    if (
      proposal.contractNumber !== row.contractNumber ||
      proposal.before.awardDate !== row.awardDate ||
      proposal.before.sourceUrl !== row.sourceUrl ||
      proposal.before.title !== row.title
    ) {
      throw new Error(`Proposal before values do not match rollback export for ${row.id}.`)
    }
    if (proposal.status !== 'proposed' || proposal.unresolvedFields.length > 0 || proposal.proposed.awardDate === null) {
      throw new Error(`Proposal ${row.id} is not a fully resolved awardDate change.`)
    }
    if (proposal.proposed.awardDate === row.awardDate) {
      throw new Error(`Proposal ${row.id} does not change awardDate.`)
    }
    awardDateUpdates.push({ id: row.id, before: row.awardDate, after: proposal.proposed.awardDate })
    if (proposal.proposed.sourceUrl !== null) {
      if (proposal.proposed.sourceUrl === row.sourceUrl) {
        throw new Error(`Proposal ${row.id} does not change sourceUrl.`)
      }
      sourceUrlUpdates.push({ id: row.id, before: row.sourceUrl, after: proposal.proposed.sourceUrl })
    }
  }
  if (awardDateUpdates.length !== PACKET1_AWARD_DATE_COUNT) {
    throw new Error(`Expected exactly ${PACKET1_AWARD_DATE_COUNT} awardDate changes.`)
  }
  if (sourceUrlUpdates.length !== PACKET1_SOURCE_URL_COUNT) {
    throw new Error(`Expected exactly ${PACKET1_SOURCE_URL_COUNT} sourceUrl changes.`)
  }

  const datesById = new Map(awardDateUpdates.map((update) => [update.id, update.after]))
  const urlsById = new Map(sourceUrlUpdates.map((update) => [update.id, update.after]))
  const appliedSnapshot = rollback.contracts.map((row) => ({
    ...row,
    awardDate: datesById.get(row.id)!,
    sourceUrl: urlsById.has(row.id) ? urlsById.get(row.id)! : row.sourceUrl,
  }))
  return {
    expectedBaselineSha256: baselineHash,
    baselineSnapshot: cloneRows(rollback.contracts),
    appliedSnapshot,
    awardDateUpdates,
    sourceUrlUpdates,
  }
}

function validateOutputPath(filePath: string, repositoryRoot: string, label: string): string {
  if (!path.isAbsolute(filePath)) throw new Error(`${label} must be an absolute path.`)
  const resolved = path.resolve(filePath)
  const repository = path.resolve(repositoryRoot)
  if (resolved === repository || resolved.startsWith(`${repository}${path.sep}`)) {
    throw new Error(`${label} must be outside the repository.`)
  }
  return resolved
}

export function parsePacket1Cli(argv: string[], repositoryRoot: string): Packet1CliOptions {
  const valueFor = (prefix: string) => argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
  const allowed = ['--apply', '--rollback']
  const prefixes = ['--export=', '--report=', '--packet=', '--baseline=', '--pre-apply-export=']
  const unknown = argv.filter((argument) => !allowed.includes(argument) && !prefixes.some((prefix) => argument.startsWith(prefix)))
  if (unknown.length > 0) throw new Error(`Unsupported arguments: ${unknown.join(', ')}`)
  const exportValue = valueFor('--export=')
  if (!exportValue) throw new Error('An explicit --export=/absolute/path.json is required.')

  const apply = argv.includes('--apply')
  const action = argv.includes('--rollback') ? 'rollback' : 'apply'
  const reportValue = valueFor('--report=')
  if (apply && !reportValue) throw new Error('--apply requires an explicit --report=/absolute/path.json.')
  const preApplyValue = valueFor('--pre-apply-export=')
  if (action === 'rollback' && !preApplyValue) {
    throw new Error('--rollback requires --pre-apply-export=/absolute/path.json.')
  }

  return {
    action,
    apply,
    exportPath: validateOutputPath(exportValue, repositoryRoot, '--export'),
    reportPath: reportValue ? validateOutputPath(reportValue, repositoryRoot, '--report') : undefined,
    packetPath: path.resolve(valueFor('--packet=') || DEFAULT_PACKET_PATH),
    baselinePath: path.resolve(valueFor('--baseline=') || DEFAULT_BASELINE_PATH),
    preApplyExportPath: preApplyValue ? path.resolve(preApplyValue) : undefined,
  }
}

function reverseUpdates<T>(updates: Array<Packet1Update<T>>): Array<Packet1Update<T>> {
  return updates.map((update) => ({ id: update.id, before: update.after, after: update.before }))
}

function exportContents(rows: ContractSnapshotRow[], generatedAt: string): string {
  return `${JSON.stringify({
    generatedAt,
    rowCount: rows.length,
    sha256: snapshotSha256(rows),
    contracts: rows,
  }, null, 2)}\n`
}

export async function executePacket1(options: {
  action: 'apply' | 'rollback'
  apply: boolean
  exportPath: string
  reportPath?: string
  plan: Packet1Plan
  preApplySnapshot?: ContractSnapshotRow[]
  store: Packet1Store
  artifactStore: Packet1ArtifactStore
  now?: () => Date
}): Promise<Record<string, unknown>> {
  const { action, apply, exportPath, reportPath, plan, store, artifactStore } = options
  if (await artifactStore.exists(exportPath)) throw new Error(`Export already exists: ${exportPath}`)
  if (reportPath && await artifactStore.exists(reportPath)) throw new Error(`Report already exists: ${reportPath}`)
  if (apply && !reportPath) throw new Error('Write mode requires an explicit post-operation report path.')

  if (action === 'rollback') {
    if (!options.preApplySnapshot) throw new Error('Rollback requires a pre-apply snapshot.')
    try {
      assertExactSnapshot(options.preApplySnapshot, plan.baselineSnapshot, 'pre-apply snapshot')
    } catch (error) {
      throw new Error(`Invalid pre-apply snapshot: ${error instanceof Error ? error.message : error}`)
    }
  }

  const expectedCurrent = action === 'apply' ? plan.baselineSnapshot : plan.appliedSnapshot
  const expectedAfter = action === 'apply' ? plan.appliedSnapshot : plan.baselineSnapshot
  const liveBefore = await store.readSnapshot()
  try {
    assertExactSnapshot(liveBefore, expectedCurrent, action === 'apply' ? 'database drift' : 'rollback drift')
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error))
  }

  const generatedAt = (options.now?.() || new Date()).toISOString()
  const result = {
    status: apply ? 'completed' : 'dry-run-ready',
    action,
    databaseWritten: apply,
    exportWritten: apply,
    expectedBaselineSha256: plan.expectedBaselineSha256,
    currentSha256: snapshotSha256(liveBefore),
    expectedAfterSha256: snapshotSha256(expectedAfter),
    awardDateCount: plan.awardDateUpdates.length,
    sourceUrlCount: plan.sourceUrlUpdates.length,
    touchedFields: ['awardDate', 'sourceUrl'],
    untouchedFieldsVerified: true,
  }
  if (!apply) return result

  await artifactStore.writeExclusive(exportPath, exportContents(liveBefore, generatedAt))
  const dateUpdates = action === 'apply' ? plan.awardDateUpdates : reverseUpdates(plan.awardDateUpdates)
  const urlUpdates = action === 'apply' ? plan.sourceUrlUpdates : reverseUpdates(plan.sourceUrlUpdates)

  await store.transaction(async (transaction) => {
    const locked = await transaction.readLockedSnapshot()
    assertExactSnapshot(locked, expectedCurrent, action === 'apply' ? 'locked database drift' : 'locked rollback drift')
    const changedDates = await transaction.updateAwardDates(dateUpdates)
    if (changedDates !== PACKET1_AWARD_DATE_COUNT) {
      throw new Error(`Refusing transaction: expected ${PACKET1_AWARD_DATE_COUNT} awardDate rows, changed ${changedDates}.`)
    }
    const changedUrls = await transaction.updateSourceUrls(urlUpdates)
    if (changedUrls !== PACKET1_SOURCE_URL_COUNT) {
      throw new Error(`Refusing transaction: expected ${PACKET1_SOURCE_URL_COUNT} sourceUrl rows, changed ${changedUrls}.`)
    }
    const insideTransaction = await transaction.readSnapshot()
    assertExactSnapshot(insideTransaction, expectedAfter, `${action} transaction verification`)
  })

  const committed = await store.readSnapshot()
  assertExactSnapshot(committed, expectedAfter, `${action} post-commit verification`)
  const completedResult = { ...result, completedAt: generatedAt, postCommitSha256: snapshotSha256(committed) }
  await artifactStore.writeExclusive(reportPath!, `${JSON.stringify(completedResult, null, 2)}\n`)
  return completedResult
}
