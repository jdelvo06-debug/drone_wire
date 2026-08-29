import { createHash } from 'node:crypto'
import path from 'node:path'
import { snapshotSha256, type ContractSnapshotRow, type Packet1Update } from '@/lib/contracts/packet1-apply'

export const CONTRACT_TITLE_COUNT = 9
export const CONTRACT_TITLE_PACKET_PATH = '/private/tmp/dronewire-contract-reconstruction-20260823-v2/contract-proposals.json'
export const CONTRACT_TITLE_PRE_PACKET1_PATH = '/private/tmp/dronewire-contract-packet1-apply-20260823/contract-pre-apply.json'
export const CONTRACT_TITLE_PACKET1_REPORT_PATH = '/private/tmp/dronewire-contract-packet1-apply-20260823/contract-apply-report.json'

export type TitleReviewStatus = 'source-faithful' | 'needs-jeremy-review'

export interface ContractTitleMapping {
  id: string
  contractNumber: string
  beforeTitle: string
  sourceProposalTitle: string
  proposedTitle: string
  sourceDescription: string
  evidenceApiUrl: string
  reviewStatus: TitleReviewStatus
  reviewReason: string
  suggestedAlternative: string | null
}

export const CONTRACT_TITLE_MAPPING: ContractTitleMapping[] = [
  {
    id: 'cmoqh3yzx002h1yog4xgbkift', contractNumber: 'SPE8EL22F16S3', beforeTitle: '4558243344',
    sourceProposalTitle: 'Counter Unmanned Arial System Camera', proposedTitle: 'Counter Unmanned Aerial System Camera',
    sourceDescription: '4558243344!COUNTER UNMANNED ARIAL SYSTEM CAMERA AND',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL22F16S3_9700_SPE8EJ21D0020_9700/',
    reviewStatus: 'source-faithful', reviewReason: 'Corrects the confirmed source typo Arial to Aerial and removes the dangling final AND.',
    suggestedAlternative: null,
  },
  {
    id: 'cmoqh41fo002k1yog9lx9y3w6', contractNumber: 'SPE8EL22F174W', beforeTitle: '4558323222',
    sourceProposalTitle: 'Counter Unmanned Aerial System Unit', proposedTitle: 'Counter Unmanned Aerial System Unit',
    sourceDescription: '4558323222!COUNTER UNMANNED AERIAL SYSTEM UNIT',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL22F174W_9700_SPE8EJ21D0020_9700/',
    reviewStatus: 'source-faithful', reviewReason: 'Uses the complete authoritative award description after removing the numeric stock identifier.',
    suggestedAlternative: null,
  },
  {
    id: 'cmoqh4ge800321yogfjn651td', contractNumber: 'SPE8EL22FW0EJ', beforeTitle: '4556659362',
    sourceProposalTitle: 'Enforceair Counter UAS (C-UAS) System', proposedTitle: 'EnforceAir Counter-UAS System',
    sourceDescription: '4556659362!ENFORCEAIR COUNTER UAS (C-UAS) SYSTEM',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL22FW0EJ_9700_SPE8EJ21D0022_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'The source wording redundantly spells out Counter UAS and repeats C-UAS, and the EnforceAir brand capitalization merits editorial confirmation.',
    suggestedAlternative: 'EnforceAir Counter-UAS System',
  },
  {
    id: 'cmoqh4rbj003f1yog9f0y6lp4', contractNumber: 'SPE8EL25F1F2H', beforeTitle: '4569639145',
    sourceProposalTitle: 'Counter UAS System Spares Module A', proposedTitle: 'Counter-UAS System Spares — Module A',
    sourceDescription: '4569639145!COUNTER UAS SYSTEM SPARES MODULE A',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL25F1F2H_9700_SPE8EJ21D0020_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'Module A appears to be inventory shorthand and the source supplies no punctuation or product context.',
    suggestedAlternative: 'Counter-UAS System Spares — Module A',
  },
  {
    id: 'cmoqh57x0003z1yog7w5a6rgv', contractNumber: 'SPE8EL23FJ255', beforeTitle: '4561859869',
    sourceProposalTitle: 'Optic, C-UAS', proposedTitle: 'Optic, C-UAS',
    sourceDescription: '4561859869!OPTIC, C-UAS',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL23FJ255_9700_SPE8EJ21D1025_9700/',
    reviewStatus: 'source-faithful', reviewReason: 'Uses the complete authoritative description without adding product claims.',
    suggestedAlternative: 'C-UAS Optic',
  },
  {
    id: 'cmoqh58sp00401yogsb0xe7n8', contractNumber: 'SPE8EL25FJ0R6', beforeTitle: '4567228936',
    sourceProposalTitle: 'C-UAS Optic (P15 Is Green)', proposedTitle: 'C-UAS Optic',
    sourceDescription: '4567228936!C-UAS OPTIC (P15 IS GREEN)',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL25FJ0R6_9700_SPE8EJ21D1025_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'P15 Is Green is unexplained source shorthand and may not be useful in a public-facing title.',
    suggestedAlternative: null,
  },
  {
    id: 'cmoqh5n1i004h1yogzmpeaydv', contractNumber: 'SPE8EL24FJ31C', beforeTitle: '4565593597',
    sourceProposalTitle: 'C-UAS Optic (P15 Is Green)', proposedTitle: 'C-UAS Optic',
    sourceDescription: '4565593597!C-UAS OPTIC (P15 IS GREEN)',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL24FJ31C_9700_SPE8EJ21D0025_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'P15 Is Green is unexplained source shorthand and may not be useful in a public-facing title.',
    suggestedAlternative: null,
  },
  {
    id: 'cmq57zllp0001l504x55pgtef', contractNumber: 'SPE8EL26FH0TF', beforeTitle: '4571079336',
    sourceProposalTitle: 'Nightfighter Mini Counter UAS System Use', proposedTitle: 'Nightfighter Mini Counter-UAS System',
    sourceDescription: '4571079336!NIGHTFIGHTER MINI COUNTER UAS SYSTEM USE',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL26FH0TF_9700_SPE8EJ21D0023_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'The authoritative description ends in the grammatically incomplete word Use.',
    suggestedAlternative: 'Nightfighter Mini Counter-UAS System',
  },
  {
    id: 'cmqf823s00001id04i1f8r18r', contractNumber: 'SPE8EL26FJ1Y1', beforeTitle: '4571157251',
    sourceProposalTitle: 'Ghoul Counter UAS System', proposedTitle: 'Ghoul Counter-UAS System',
    sourceDescription: '4571157251!GHOUL COUNTER UAS SYSTEM USED TO PROTECT',
    evidenceApiUrl: 'https://api.usaspending.gov/api/v2/awards/CONT_AWD_SPE8EL26FJ1Y1_9700_SPE8EJ21D0025_9700/',
    reviewStatus: 'needs-jeremy-review', reviewReason: 'The source description ends with an incomplete Used To Protect phrase; the proposed title deliberately omits it.',
    suggestedAlternative: 'Ghoul Counter-UAS System',
  },
]

export interface ContractTitleReviewRow extends ContractTitleMapping {
  currentAwardDate: string
  currentSourceUrl: string | null
  currentStatus: string
}

export interface ContractTitlePlan {
  expectedPostPacket1Sha256: string
  mappingSha256: string
  baselineSnapshot: ContractSnapshotRow[]
  appliedSnapshot: ContractSnapshotRow[]
  titleUpdates: Array<Packet1Update<string>>
  reviewRows: ContractTitleReviewRow[]
}

export interface ContractTitleTransaction {
  readLockedSnapshot(): Promise<ContractSnapshotRow[]>
  updateTitles(updates: Array<Packet1Update<string>>): Promise<number>
  readSnapshot(): Promise<ContractSnapshotRow[]>
}

export interface ContractTitleStore {
  readSnapshot(): Promise<ContractSnapshotRow[]>
  transaction<T>(callback: (transaction: ContractTitleTransaction) => Promise<T>): Promise<T>
}

export interface ContractTitleArtifactStore {
  exists(filePath: string): Promise<boolean>
  writeExclusive(filePath: string, contents: string): Promise<void>
}

export interface TitleApprovalArtifact {
  mappingSha256: string
  reviewer: string | null
  approvedAt: string | null
  decisions: Array<{ id: string; before: string; after: string; approved: boolean }>
}

interface ParsedProposal {
  contractId: string
  contractNumber: string
  beforeTitle: string
  proposedTitle: string
  sourceDescription: string
  evidenceApiUrl: string
}

export interface ContractTitleCliOptions {
  action: 'apply' | 'rollback'
  apply: boolean
  exportPath: string
  reportPath: string
  packetPath: string
  prePacket1Path: string
  packet1ReportPath: string
  approvalPath?: string
  preApplyExportPath?: string
}

function cloneRows(rows: ContractSnapshotRow[]): ContractSnapshotRow[] {
  return JSON.parse(JSON.stringify(rows)) as ContractSnapshotRow[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringField(record: Record<string, unknown>, field: string, label: string): string {
  const value = record[field]
  if (typeof value !== 'string') throw new Error(`${label}.${field} must be a string.`)
  return value
}

function parseTitleProposals(packet: unknown): ParsedProposal[] {
  if (!isRecord(packet) || !Array.isArray(packet.proposals)) throw new Error('Title packet proposals must be an array.')
  const proposals: ParsedProposal[] = []
  for (const [index, value] of packet.proposals.entries()) {
    if (!isRecord(value) || !isRecord(value.before) || !isRecord(value.proposed) || !isRecord(value.evidence)) {
      throw new Error(`Title packet proposal ${index} is malformed.`)
    }
    if (value.proposed.title === null) continue
    proposals.push({
      contractId: stringField(value, 'contractId', `proposal ${index}`),
      contractNumber: stringField(value, 'contractNumber', `proposal ${index}`),
      beforeTitle: stringField(value.before, 'title', `proposal ${index}.before`),
      proposedTitle: stringField(value.proposed, 'title', `proposal ${index}.proposed`),
      sourceDescription: stringField(value.evidence, 'description', `proposal ${index}.evidence`),
      evidenceApiUrl: stringField(value.evidence, 'evidenceApiUrl', `proposal ${index}.evidence`),
    })
  }
  return proposals
}

function assertUniqueIds(ids: string[], label: string): void {
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${label} contains duplicate ID ${id}.`)
    seen.add(id)
  }
}

function assertSnapshot(actual: ContractSnapshotRow[], expected: ContractSnapshotRow[], context: string): void {
  if (actual.length !== 228) throw new Error(`${context}: expected 228 rows, found ${actual.length}.`)
  assertUniqueIds(actual.map((row) => row.id), context)
  if (JSON.stringify(actual) === JSON.stringify(expected)) return
  for (let index = 0; index < expected.length; index += 1) {
    const left = actual[index]
    const right = expected[index]
    if (!left || left.id !== right.id) throw new Error(`${context}: ID/order mismatch at row ${index}.`)
    for (const field of Object.keys(right) as Array<keyof ContractSnapshotRow>) {
      if (JSON.stringify(left[field]) !== JSON.stringify(right[field])) {
        const kind = field === 'title' ? 'title' : 'non-title field'
        throw new Error(`${context}: ${kind} ${field} differs for ${right.id}.`)
      }
    }
  }
  throw new Error(`${context}: snapshot mismatch.`)
}

export function buildContractTitlePlan(input: {
  packet: unknown
  postPacket1Snapshot: ContractSnapshotRow[]
  expectedPostPacket1Sha256: string
}): ContractTitlePlan {
  const proposals = parseTitleProposals(input.packet)
  if (proposals.length !== CONTRACT_TITLE_COUNT) throw new Error('Title packet must contain exactly nine non-null title proposals.')
  assertUniqueIds(proposals.map((proposal) => proposal.contractId), 'Title packet')
  const expectedIds = new Set(CONTRACT_TITLE_MAPPING.map((mapping) => mapping.id))
  const proposalIds = new Set(proposals.map((proposal) => proposal.contractId))
  if ([...proposalIds].some((id) => !expectedIds.has(id)) || [...expectedIds].some((id) => !proposalIds.has(id))) {
    throw new Error('Title packet contains an unexpected or missing contract ID.')
  }
  if (input.postPacket1Snapshot.length !== 228) throw new Error('Post-Packet-1 snapshot must contain exactly 228 rows.')
  assertUniqueIds(input.postPacket1Snapshot.map((row) => row.id), 'Post-Packet-1 snapshot')
  if (snapshotSha256(input.postPacket1Snapshot) !== input.expectedPostPacket1Sha256) {
    throw new Error('Post-Packet-1 snapshot SHA-256 does not match the apply report.')
  }

  const proposalById = new Map(proposals.map((proposal) => [proposal.contractId, proposal]))
  const snapshotById = new Map(input.postPacket1Snapshot.map((row) => [row.id, row]))
  const reviewRows: ContractTitleReviewRow[] = []
  const titleUpdates: Array<Packet1Update<string>> = []
  for (const mapping of CONTRACT_TITLE_MAPPING) {
    const proposal = proposalById.get(mapping.id)!
    const current = snapshotById.get(mapping.id)
    if (!current) throw new Error(`Post-Packet-1 snapshot is missing expected title ID ${mapping.id}.`)
    if (
      proposal.contractNumber !== mapping.contractNumber || proposal.beforeTitle !== mapping.beforeTitle ||
      current.contractNumber !== mapping.contractNumber || current.title !== mapping.beforeTitle
    ) {
      throw new Error(`Title packet before-title mismatch for ${mapping.contractNumber}.`)
    }
    if (
      proposal.proposedTitle !== mapping.sourceProposalTitle || proposal.sourceDescription !== mapping.sourceDescription ||
      proposal.evidenceApiUrl !== mapping.evidenceApiUrl
    ) {
      throw new Error(`Title evidence drift for ${mapping.contractNumber}.`)
    }
    titleUpdates.push({ id: mapping.id, before: mapping.beforeTitle, after: mapping.proposedTitle })
    reviewRows.push({
      ...mapping,
      currentAwardDate: current.awardDate,
      currentSourceUrl: current.sourceUrl,
      currentStatus: current.status,
    })
  }

  const afterById = new Map(titleUpdates.map((update) => [update.id, update.after]))
  const appliedSnapshot = input.postPacket1Snapshot.map((row) => (
    afterById.has(row.id) ? { ...row, title: afterById.get(row.id)! } : { ...row }
  ))
  const mappingSha256 = createHash('sha256').update(JSON.stringify(titleUpdates)).digest('hex')
  return {
    expectedPostPacket1Sha256: input.expectedPostPacket1Sha256,
    mappingSha256,
    baselineSnapshot: cloneRows(input.postPacket1Snapshot),
    appliedSnapshot,
    titleUpdates,
    reviewRows,
  }
}

export function buildTitleApprovalTemplate(plan: ContractTitlePlan): TitleApprovalArtifact {
  return {
    mappingSha256: plan.mappingSha256,
    reviewer: null,
    approvedAt: null,
    decisions: plan.titleUpdates.map((update) => ({ ...update, approved: false })),
  }
}

function validateApproval(plan: ContractTitlePlan, value: unknown): void {
  if (!isRecord(value) || value.mappingSha256 !== plan.mappingSha256 || value.reviewer !== 'Jeremy' || typeof value.approvedAt !== 'string') {
    throw new Error('Apply requires Jeremy approval for this exact nine-title mapping.')
  }
  if (!Array.isArray(value.decisions) || value.decisions.length !== CONTRACT_TITLE_COUNT) {
    throw new Error('Approval must contain exactly nine decisions.')
  }
  const expected = JSON.stringify(plan.titleUpdates.map((update) => ({ ...update, approved: true })))
  if (JSON.stringify(value.decisions) !== expected) throw new Error('Approval decisions do not match the exact title mapping.')
}

function artifactPath(value: string | undefined, repositoryRoot: string, flag: string): string {
  if (!value) throw new Error(`${flag}=/absolute/path.json is required.`)
  if (!path.isAbsolute(value)) throw new Error(`${flag} must be an absolute path.`)
  const resolved = path.resolve(value)
  const repository = path.resolve(repositoryRoot)
  if (resolved === repository || resolved.startsWith(`${repository}${path.sep}`)) {
    throw new Error(`${flag} must be outside the repository.`)
  }
  return resolved
}

export function parseContractTitleCli(argv: string[], repositoryRoot: string): ContractTitleCliOptions {
  const valueFor = (prefix: string) => argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
  const flags = ['--apply', '--rollback']
  const prefixes = ['--export=', '--report=', '--packet=', '--pre-packet1=', '--packet1-report=', '--approval=', '--pre-apply-export=']
  const unknown = argv.filter((argument) => !flags.includes(argument) && !prefixes.some((prefix) => argument.startsWith(prefix)))
  if (unknown.length > 0) throw new Error(`Unsupported arguments: ${unknown.join(', ')}`)
  const action = argv.includes('--rollback') ? 'rollback' : 'apply'
  const apply = argv.includes('--apply')
  const approvalPath = valueFor('--approval=')
  const preApplyExportPath = valueFor('--pre-apply-export=')
  if (apply && action === 'apply' && !approvalPath) throw new Error('--apply requires an explicit --approval artifact.')
  if (action === 'rollback' && !preApplyExportPath) throw new Error('--rollback requires --pre-apply-export.')
  return {
    action,
    apply,
    exportPath: artifactPath(valueFor('--export='), repositoryRoot, '--export'),
    reportPath: artifactPath(valueFor('--report='), repositoryRoot, '--report'),
    packetPath: path.resolve(valueFor('--packet=') || CONTRACT_TITLE_PACKET_PATH),
    prePacket1Path: path.resolve(valueFor('--pre-packet1=') || CONTRACT_TITLE_PRE_PACKET1_PATH),
    packet1ReportPath: path.resolve(valueFor('--packet1-report=') || CONTRACT_TITLE_PACKET1_REPORT_PATH),
    approvalPath: approvalPath ? path.resolve(approvalPath) : undefined,
    preApplyExportPath: preApplyExportPath ? path.resolve(preApplyExportPath) : undefined,
  }
}

function reverseUpdates(updates: Array<Packet1Update<string>>): Array<Packet1Update<string>> {
  return updates.map((update) => ({ id: update.id, before: update.after, after: update.before }))
}

function snapshotArtifact(rows: ContractSnapshotRow[], generatedAt: string): string {
  return `${JSON.stringify({ generatedAt, rowCount: rows.length, sha256: snapshotSha256(rows), contracts: rows }, null, 2)}\n`
}

export async function executeContractTitles(options: {
  action: 'apply' | 'rollback'
  apply: boolean
  exportPath: string
  reportPath: string
  approval?: unknown
  preApplySnapshot?: ContractSnapshotRow[]
  plan: ContractTitlePlan
  store: ContractTitleStore
  artifactStore: ContractTitleArtifactStore
  now?: () => Date
}): Promise<Record<string, unknown>> {
  const { action, apply, exportPath, reportPath, plan, store, artifactStore } = options
  if (await artifactStore.exists(exportPath)) throw new Error(`Export already exists: ${exportPath}`)
  if (await artifactStore.exists(reportPath)) throw new Error(`Report already exists: ${reportPath}`)
  if (apply && action === 'apply') validateApproval(plan, options.approval)
  if (action === 'rollback') {
    if (!options.preApplySnapshot) throw new Error('Rollback requires the exact pre-apply snapshot.')
    assertSnapshot(options.preApplySnapshot, plan.baselineSnapshot, 'pre-apply snapshot')
  }

  const expectedCurrent = action === 'apply' ? plan.baselineSnapshot : plan.appliedSnapshot
  const expectedAfter = action === 'apply' ? plan.appliedSnapshot : plan.baselineSnapshot
  const current = await store.readSnapshot()
  assertSnapshot(current, expectedCurrent, action === 'apply' ? 'baseline drift' : 'rollback drift')
  const generatedAt = (options.now?.() || new Date()).toISOString()
  const baseReport = {
    status: apply ? 'completed' : 'dry-run-review',
    action,
    databaseWritten: apply,
    exportWritten: apply,
    expectedPostPacket1Sha256: plan.expectedPostPacket1Sha256,
    currentSha256: snapshotSha256(current),
    mappingSha256: plan.mappingSha256,
    titleCount: plan.titleUpdates.length,
    touchedFields: ['title'],
    needsJeremyReviewCount: plan.reviewRows.filter((row) => row.reviewStatus === 'needs-jeremy-review').length,
    rows: plan.reviewRows,
  }
  if (!apply) {
    await artifactStore.writeExclusive(reportPath, `${JSON.stringify({ ...baseReport, generatedAt }, null, 2)}\n`)
    return baseReport
  }

  await artifactStore.writeExclusive(exportPath, snapshotArtifact(current, generatedAt))
  const updates = action === 'apply' ? plan.titleUpdates : reverseUpdates(plan.titleUpdates)
  await store.transaction(async (transaction) => {
    assertSnapshot(await transaction.readLockedSnapshot(), expectedCurrent, `locked ${action} drift`)
    const affected = await transaction.updateTitles(updates)
    if (affected !== CONTRACT_TITLE_COUNT) throw new Error(`Expected exactly nine title rows, changed ${affected}.`)
    assertSnapshot(await transaction.readSnapshot(), expectedAfter, `${action} transaction verification`)
  })
  const committed = await store.readSnapshot()
  assertSnapshot(committed, expectedAfter, `${action} post-commit verification`)
  const completed = { ...baseReport, completedAt: generatedAt, postCommitSha256: snapshotSha256(committed) }
  await artifactStore.writeExclusive(reportPath, `${JSON.stringify(completed, null, 2)}\n`)
  return completed
}
