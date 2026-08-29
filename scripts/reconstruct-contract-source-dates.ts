/**
 * Read-only USAspending evidence packet for the 228 existing DroneWire contracts.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/reconstruct-contract-source-dates.ts \
 *     --output-dir=/private/tmp/dronewire-contract-reconstruction-YYYYMMDD
 *
 * This command has no apply mode. It reads contracts in READ ONLY transactions,
 * calls public USAspending endpoints, and writes reports outside the repository.
 */

import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '@/lib/db'
import {
  chooseAwardCandidate,
  createContractProposal,
  createUnresolvedContractProposal,
  isNumericIdentifierTitle,
  type AwardDetail,
  type AwardSearchCandidate,
  type ContractProposal,
  type StoredContract,
} from '@/lib/contracts/source-date-reconstruction'

const EXPECTED_CONTRACT_COUNT = 228
const MAX_ATTEMPTS = 3
const MAX_SEARCH_PAGES = 3
const SEARCH_PAGE_SIZE = 100
const REQUEST_TIMEOUT_MS = 20_000
const MAX_CONCURRENCY = 8
const DEFAULT_CONCURRENCY = 4
const SEARCH_ENDPOINT = 'https://api.usaspending.gov/api/v2/search/spending_by_award/'

interface ContractSnapshotRow extends StoredContract {
  contractorType: string
  currency: string
  duration: number | null
  status: string
  category: string
  office: string | null
  location: string | null
  keyPersonnel: string[]
  relatedSystems: string[]
  updatedAt: string
}

interface RawContractRow extends Omit<ContractSnapshotRow, 'awardDate' | 'scrapedAt' | 'createdAt' | 'updatedAt'> {
  awardDate: Date
  scrapedAt: Date
  createdAt: Date
  updatedAt: Date
}

interface RequestEvent {
  contractId: string
  contractNumber: string | null
  stage: 'search' | 'detail'
  attempt: number
  url: string
  status: number | null
  rateLimited: boolean
  retrying: boolean
  message: string
}

interface RequestMetrics {
  attempts: number
  successes: number
  failures: number
  rateLimitedResponses: number
}

interface SearchResponse {
  results?: Array<Record<string, unknown>>
  page_metadata?: { page?: number; hasNext?: boolean }
  messages?: string[]
}

interface DetailResponse extends Record<string, unknown> {
  generated_unique_award_id?: unknown
  piid?: unknown
  category?: unknown
  description?: unknown
  date_signed?: unknown
  total_obligation?: unknown
  recipient?: unknown
  awarding_agency?: unknown
}

interface PacketSummary {
  totalContractsProcessed: number
  contractsWithAuthoritativeDateEvidence: number
  contractsWhereStoredDateIsIngestionTimestamp: number
  contractsWithCorrectedCanonicalUrls: number
  contractsStillUnresolved: number
  numericIdentifierTitles: number
  numericTitlesWithProposedReplacement: number
  contractsWithAnyProposedChange: number
  databaseBeforeCount: number
  databaseAfterCount: number
  databaseBeforeSha256: string
  databaseAfterSha256: string
  databasePreserved: boolean
  requestMetrics: RequestMetrics
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function normalizeSnapshotRow(row: RawContractRow): ContractSnapshotRow {
  return {
    ...row,
    awardDate: row.awardDate.toISOString(),
    scrapedAt: row.scrapedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

async function readContractSnapshot(): Promise<ContractSnapshotRow[]> {
  const rows = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY')
    return tx.$queryRawUnsafe<RawContractRow[]>(`
      SELECT
        id,
        "contractNumber",
        title,
        description,
        "awardDate",
        company,
        "contractorType",
        value::text AS value,
        currency,
        duration,
        status,
        category,
        agency,
        office,
        location,
        "keyPersonnel",
        "relatedSystems",
        "sourceUrl",
        "scrapedAt",
        "createdAt",
        "updatedAt"
      FROM contracts
      ORDER BY id
    `)
  })

  return rows.map(normalizeSnapshotRow)
}

function snapshotHash(rows: ContractSnapshotRow[]): string {
  return createHash('sha256').update(JSON.stringify(rows)).digest('hex')
}

function parseSearchCandidate(raw: Record<string, unknown>): AwardSearchCandidate {
  return {
    awardId: stringOrNull(raw['Award ID']),
    generatedInternalId: stringOrNull(raw.generated_internal_id),
    recipientName: stringOrNull(raw['Recipient Name']),
    description: stringOrNull(raw.Description),
    awardAmount: numberOrNull(raw['Award Amount']),
    baseObligationDate: stringOrNull(raw['Base Obligation Date']),
    startDate: stringOrNull(raw['Start Date']),
    endDate: stringOrNull(raw['End Date']),
    awardingAgency: stringOrNull(raw['Awarding Agency']),
    awardingAgencyCode: stringOrNull(raw['Awarding Agency Code']),
    awardingSubAgency: stringOrNull(raw['Awarding Sub Agency']),
    awardingSubAgencyCode: stringOrNull(raw['Awarding Sub Agency Code']),
    contractAwardType: stringOrNull(raw['Contract Award Type']),
  }
}

function nestedRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function parseAwardDetail(raw: DetailResponse): AwardDetail {
  const recipient = nestedRecord(raw.recipient)
  const awardingAgency = nestedRecord(raw.awarding_agency)
  const topTierAgency = nestedRecord(awardingAgency.toptier_agency)
  const subTierAgency = nestedRecord(awardingAgency.subtier_agency)

  return {
    generatedUniqueAwardId: stringOrNull(raw.generated_unique_award_id),
    piid: stringOrNull(raw.piid),
    category: stringOrNull(raw.category),
    description: stringOrNull(raw.description),
    dateSigned: stringOrNull(raw.date_signed),
    totalObligation: numberOrNull(raw.total_obligation),
    recipientName: stringOrNull(recipient.recipient_name),
    awardingAgency: stringOrNull(topTierAgency.name),
    awardingAgencyCode: stringOrNull(topTierAgency.code),
    awardingSubAgency: stringOrNull(subTierAgency.name),
    awardingSubAgencyCode: stringOrNull(subTierAgency.code),
  }
}

function retryDelayMilliseconds(attempt: number, retryAfter: string | null): number {
  if (retryAfter && /^\d+$/.test(retryAfter)) {
    return Math.min(Number(retryAfter) * 1000, 5_000)
  }
  return Math.min(500 * (2 ** (attempt - 1)), 2_000)
}

async function wait(milliseconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function requestJson<T>(
  url: string,
  init: RequestInit,
  context: Pick<RequestEvent, 'contractId' | 'contractNumber' | 'stage'>,
  events: RequestEvent[],
  metrics: RequestMetrics
): Promise<T> {
  let lastMessage = 'Unknown request failure'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    metrics.attempts += 1
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timeout)

      if (response.ok) {
        metrics.successes += 1
        return await response.json() as T
      }

      const responseText = (await response.text()).slice(0, 500)
      const retrying = attempt < MAX_ATTEMPTS && (response.status === 429 || response.status >= 500)
      const rateLimited = response.status === 429
      lastMessage = `HTTP ${response.status}${responseText ? `: ${responseText}` : ''}`
      metrics.failures += 1
      if (rateLimited) metrics.rateLimitedResponses += 1
      events.push({ ...context, attempt, url, status: response.status, rateLimited, retrying, message: lastMessage })

      if (!retrying) break
      await wait(retryDelayMilliseconds(attempt, response.headers.get('retry-after')))
    } catch (error) {
      clearTimeout(timeout)
      const retrying = attempt < MAX_ATTEMPTS
      lastMessage = error instanceof Error ? error.message : 'Unknown network error'
      metrics.failures += 1
      events.push({ ...context, attempt, url, status: null, rateLimited: false, retrying, message: lastMessage })
      if (!retrying) break
      await wait(retryDelayMilliseconds(attempt, null))
    }
  }

  throw new Error(lastMessage)
}

async function searchAwardPages(
  contract: StoredContract,
  events: RequestEvent[],
  metrics: RequestMetrics,
  recipientScoped: boolean
): Promise<{ candidates: AwardSearchCandidate[]; truncated: boolean }> {
  if (!contract.contractNumber) return { candidates: [], truncated: false }

  const results: AwardSearchCandidate[] = []
  const endDate = new Date().toISOString().slice(0, 10)

  for (let page = 1; page <= MAX_SEARCH_PAGES; page += 1) {
    const payload = {
      subawards: false,
      limit: SEARCH_PAGE_SIZE,
      page,
      filters: {
        award_type_codes: ['A', 'B', 'C', 'D'],
        award_ids: [contract.contractNumber],
        time_period: [{ start_date: '2007-10-01', end_date: endDate }],
        ...(recipientScoped ? { recipient_search_text: [contract.company] } : {}),
      },
      fields: [
        'Award ID',
        'Recipient Name',
        'Description',
        'Award Amount',
        'Base Obligation Date',
        'Start Date',
        'End Date',
        'Awarding Agency',
        'Awarding Agency Code',
        'Awarding Sub Agency',
        'Awarding Sub Agency Code',
        'Contract Award Type',
        'generated_internal_id',
      ],
    }

    const data = await requestJson<SearchResponse>(
      SEARCH_ENDPOINT,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      { contractId: contract.id, contractNumber: contract.contractNumber, stage: 'search' },
      events,
      metrics
    )

    results.push(...(data.results || []).map(parseSearchCandidate))
    if (!data.page_metadata?.hasNext) return { candidates: results, truncated: false }
  }

  return { candidates: results, truncated: true }
}

async function searchAward(
  contract: StoredContract,
  events: RequestEvent[],
  metrics: RequestMetrics
): Promise<AwardSearchCandidate[]> {
  const primary = await searchAwardPages(contract, events, metrics, false)
  if (!primary.truncated) return primary.candidates

  const recipientScoped = await searchAwardPages(contract, events, metrics, true)
  if (!recipientScoped.truncated) return recipientScoped.candidates

  throw new Error(`USAspending search exceeded the bounded ${MAX_SEARCH_PAGES}-page limit even after recipient scoping.`)
}

async function fetchAwardDetail(
  contract: StoredContract,
  generatedInternalId: string,
  events: RequestEvent[],
  metrics: RequestMetrics
): Promise<AwardDetail> {
  const url = `https://api.usaspending.gov/api/v2/awards/${encodeURIComponent(generatedInternalId)}/`
  const data = await requestJson<DetailResponse>(
    url,
    { method: 'GET', headers: { Accept: 'application/json' } },
    { contractId: contract.id, contractNumber: contract.contractNumber, stage: 'detail' },
    events,
    metrics
  )
  return parseAwardDetail(data)
}

async function processContract(
  contract: StoredContract,
  events: RequestEvent[],
  metrics: RequestMetrics
): Promise<ContractProposal> {
  if (!contract.contractNumber) {
    return createUnresolvedContractProposal(contract, 'Stored contractNumber is missing.')
  }

  try {
    const candidates = await searchAward(contract, events, metrics)
    const choice = chooseAwardCandidate(contract, candidates)
    if (!choice.candidate?.generatedInternalId) {
      return createUnresolvedContractProposal(contract, choice.reason)
    }

    const detail = await fetchAwardDetail(contract, choice.candidate.generatedInternalId, events, metrics)
    return createContractProposal(contract, choice.candidate, detail, choice)
  } catch (error) {
    return createUnresolvedContractProposal(
      contract,
      `USAspending evidence retrieval failed: ${error instanceof Error ? error.message : 'Unknown failure'}`
    )
  }
}

async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(values.length)
  let nextIndex = 0

  async function worker(): Promise<void> {
    while (nextIndex < values.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await mapper(values[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()))
  return results
}

function csvCell(value: string | number | boolean | null): string {
  let text = value === null ? '' : String(value)
  if (/^[\u0000-\u0020]*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

function proposalsCsv(proposals: ContractProposal[]): string {
  const columns = [
    'contractId', 'contractNumber', 'status', 'confidence', 'reason',
    'matchConfidence', 'matchReason', 'exactCandidateCount',
    'beforeAwardDate', 'proposedAwardDate', 'dateClassification',
    'awardDateConfidence', 'awardDateReason', 'beforeSourceUrl', 'proposedSourceUrl',
    'sourceUrlConfidence', 'sourceUrlReason', 'beforeTitle', 'proposedTitle',
    'titleConfidence', 'titleReason',
    'evidenceApiUrl', 'generatedUniqueAwardId', 'evidencePiid', 'dateSigned',
    'baseObligationDate', 'startDate', 'recipientName', 'awardingAgency',
    'awardingAgencyCode', 'awardingSubAgency', 'awardingSubAgencyCode',
    'totalObligation', 'authoritativeDescription', 'unresolvedFields',
  ]

  const rows = proposals.map((proposal) => [
    proposal.contractId,
    proposal.contractNumber,
    proposal.status,
    proposal.confidence,
    proposal.reason,
    proposal.matchAssessment.confidence,
    proposal.matchAssessment.reason,
    proposal.matchAssessment.exactCandidateCount,
    proposal.before.awardDate,
    proposal.proposed.awardDate,
    proposal.dateAssessment.classification,
    proposal.fieldAssessments.awardDate.confidence,
    proposal.fieldAssessments.awardDate.reason,
    proposal.before.sourceUrl,
    proposal.proposed.sourceUrl,
    proposal.fieldAssessments.sourceUrl.confidence,
    proposal.fieldAssessments.sourceUrl.reason,
    proposal.before.title,
    proposal.proposed.title,
    proposal.fieldAssessments.title.confidence,
    proposal.fieldAssessments.title.reason,
    proposal.evidence.evidenceApiUrl,
    proposal.evidence.generatedUniqueAwardId,
    proposal.evidence.piid,
    proposal.evidence.dateSigned,
    proposal.evidence.baseObligationDate,
    proposal.evidence.startDate,
    proposal.evidence.recipientName,
    proposal.evidence.awardingAgency,
    proposal.evidence.awardingAgencyCode,
    proposal.evidence.awardingSubAgency,
    proposal.evidence.awardingSubAgencyCode,
    proposal.evidence.totalObligation,
    proposal.evidence.description,
    proposal.unresolvedFields.join('|'),
  ])

  return [columns, ...rows].map((row) => row.map((value) => csvCell(value)).join(',')).join('\n')
}

function markdownEscape(value: string | null): string {
  return (value || '—').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
}

function buildMarkdownReport(
  summary: PacketSummary,
  proposals: ContractProposal[],
  events: RequestEvent[],
  outputDir: string,
  generatedAt: string,
  recommendation: string
): string {
  const numeric = proposals.filter((proposal) => isNumericIdentifierTitle(proposal.before.title))
  const unresolved = proposals.filter((proposal) => proposal.status === 'unresolved' || proposal.unresolvedFields.length > 0)
  const eventRows = events.length === 0
    ? '_None._'
    : [
        '| Contract | Stage | Attempt | HTTP | Rate limited | Retrying | Message |',
        '|---|---|---:|---:|---|---|---|',
        ...events.map((event) => `| ${markdownEscape(event.contractNumber)} | ${event.stage} | ${event.attempt} | ${event.status ?? 'network'} | ${event.rateLimited} | ${event.retrying} | ${markdownEscape(event.message)} |`),
      ].join('\n')

  return `# DroneWire Contract Source/Date Reconstruction Packet

Generated: ${generatedAt}

This packet is evidence-only. The tool performed no database writes and has no apply mode.

## Summary

| Measure | Count/value |
|---|---:|
| Total contracts processed | ${summary.totalContractsProcessed} |
| Contracts with authoritative date evidence | ${summary.contractsWithAuthoritativeDateEvidence} |
| Stored dates classified as ingestion timestamps | ${summary.contractsWhereStoredDateIsIngestionTimestamp} |
| Contracts with corrected canonical URLs | ${summary.contractsWithCorrectedCanonicalUrls} |
| Contracts still unresolved | ${summary.contractsStillUnresolved} |
| Numeric-identifier titles | ${summary.numericIdentifierTitles} |
| Numeric titles with proposed replacements | ${summary.numericTitlesWithProposedReplacement} |
| Contracts with any proposed change | ${summary.contractsWithAnyProposedChange} |
| Database preserved | ${summary.databasePreserved} |
| Database before/after SHA-256 | \`${summary.databaseBeforeSha256}\` / \`${summary.databaseAfterSha256}\` |

## Evidence method

- Award identifier: stored \`contractNumber\`, post-filtered to an exact USAspending \`Award ID\`/PIID.
- Canonical URL: full USAspending \`generated_unique_award_id\` returned by the award detail endpoint.
- Authoritative date: award detail \`date_signed\`; \`Base Obligation Date\` and \`Start Date\` are retained as supporting evidence, not substituted silently.
- Stored date classification: an \`awardDate\` within five minutes of \`scrapedAt\` or \`createdAt\` is classified as an ingestion timestamp.
- Ambiguous exact PIIDs are accepted only when recipient, amount, description, and agency evidence uniquely supports one candidate; otherwise they remain unresolved.
- The USAspending search API currently returns 503 for the documented quoted exact-ID filter. This packet uses the working unquoted filter and rejects all non-exact PIIDs after retrieval.

Official API documentation:

- https://api.usaspending.gov/docs/endpoints
- https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/search/spending_by_award.md
- https://github.com/fedspendingtransparency/usaspending-api/blob/master/usaspending_api/api_contracts/contracts/v2/awards/award_id.md

## Numeric-title records

| Contract | Before title | Proposed title | Evidence URL | Confidence/reason |
|---|---|---|---|---|
${numeric.map((proposal) => `| ${markdownEscape(proposal.contractNumber)} | ${markdownEscape(proposal.before.title)} | ${markdownEscape(proposal.proposed.title)} | ${markdownEscape(proposal.evidence.evidenceApiUrl)} | ${proposal.fieldAssessments.title.confidence}: ${markdownEscape(proposal.fieldAssessments.title.reason)} |`).join('\n')}

## Unresolved records

${unresolved.length === 0 ? '_None._' : `| Contract | Unresolved fields | Reason | Evidence URL |
|---|---|---|---|
${unresolved.map((proposal) => `| ${markdownEscape(proposal.contractNumber)} | ${proposal.unresolvedFields.join(', ') || 'all evidence'} | ${markdownEscape(proposal.reason)} | ${markdownEscape(proposal.evidence.evidenceApiUrl)} |`).join('\n')}`}

## Failed or rate-limited requests

${eventRows}

Request attempts: ${summary.requestMetrics.attempts}; successful responses: ${summary.requestMetrics.successes}; failed responses/attempts: ${summary.requestMetrics.failures}; rate-limited responses: ${summary.requestMetrics.rateLimitedResponses}.

## Detailed evidence

Every record's before/after values, confidence, reason, source URL, award identifiers, authoritative description, and date evidence are in:

- \`${path.join(outputDir, 'contract-proposals.json')}\`
- \`${path.join(outputDir, 'contract-proposals.csv')}\`

The exact read-only pre-change snapshot is \`${path.join(outputDir, 'contract-rollback-export.json')}\`.

## Exact requirements for any later apply/rollback packet

1. Take a fresh pre-apply export of all 228 rows and compare its count and SHA-256 with this packet. Stop if the database has drifted.
2. Review every non-null proposed value and all unresolved records. Never apply an unresolved field.
3. In one approved transaction, lock the exact contract IDs, require each stored before value to match this packet, update only \`awardDate\`, \`sourceUrl\`, and the nine reviewed \`title\` values, and require the exact expected affected-row counts.
4. Do not change status, agency, relationships, subscriber data, or any other field.
5. Re-read all 228 rows after apply; reconcile counts, proposal values, and untouched-field hashes before committing the transaction or ending the rollback window.
6. A rollback must guard on the expected applied values and restore only the three approved fields from a fresh pre-apply export. Abort on any concurrent mismatch rather than overwriting newer data.

## Recommendation

${recommendation}
`
}

function parseCli(): { outputDir: string; concurrency: number } {
  const outputArg = process.argv.slice(2).find((argument) => argument.startsWith('--output-dir='))
  const concurrencyArg = process.argv.slice(2).find((argument) => argument.startsWith('--concurrency='))
  const unknownArgs = process.argv.slice(2).filter((argument) => (
    !argument.startsWith('--output-dir=') && !argument.startsWith('--concurrency=')
  ))
  if (unknownArgs.length > 0) throw new Error(`Unsupported arguments: ${unknownArgs.join(', ')}. This tool has no apply mode.`)

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outputDir = path.resolve(outputArg?.slice('--output-dir='.length) || `/private/tmp/dronewire-contract-reconstruction-${timestamp}`)
  const concurrency = Number(concurrencyArg?.slice('--concurrency='.length) || DEFAULT_CONCURRENCY)
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_CONCURRENCY) {
    throw new Error(`Concurrency must be an integer from 1 to ${MAX_CONCURRENCY}.`)
  }

  const repositoryRoot = path.resolve(process.cwd())
  if (outputDir === repositoryRoot || outputDir.startsWith(`${repositoryRoot}${path.sep}`)) {
    throw new Error('Output directory must be outside the repository.')
  }

  return { outputDir, concurrency }
}

async function main(): Promise<void> {
  const { outputDir, concurrency } = parseCli()
  await mkdir(outputDir, { recursive: false })

  const generatedAt = new Date().toISOString()
  const beforeRows = await readContractSnapshot()
  if (beforeRows.length !== EXPECTED_CONTRACT_COUNT) {
    throw new Error(`Refusing to run: expected exactly ${EXPECTED_CONTRACT_COUNT} contracts, found ${beforeRows.length}.`)
  }

  const beforeHash = snapshotHash(beforeRows)
  const requestEvents: RequestEvent[] = []
  const requestMetrics: RequestMetrics = { attempts: 0, successes: 0, failures: 0, rateLimitedResponses: 0 }
  const proposals = await mapWithConcurrency(
    beforeRows,
    concurrency,
    (contract) => processContract(contract, requestEvents, requestMetrics)
  )

  const afterRows = await readContractSnapshot()
  const afterHash = snapshotHash(afterRows)
  const databasePreserved = afterRows.length === EXPECTED_CONTRACT_COUNT && beforeHash === afterHash
  const unresolved = proposals.filter((proposal) => proposal.status === 'unresolved' || proposal.unresolvedFields.length > 0)
  const summary: PacketSummary = {
    totalContractsProcessed: proposals.length,
    contractsWithAuthoritativeDateEvidence: proposals.filter((proposal) => proposal.evidence.dateSigned).length,
    contractsWhereStoredDateIsIngestionTimestamp: proposals.filter((proposal) => proposal.dateAssessment.classification === 'ingestion_timestamp').length,
    contractsWithCorrectedCanonicalUrls: proposals.filter((proposal) => proposal.proposed.sourceUrl).length,
    contractsStillUnresolved: unresolved.length,
    numericIdentifierTitles: proposals.filter((proposal) => isNumericIdentifierTitle(proposal.before.title)).length,
    numericTitlesWithProposedReplacement: proposals.filter((proposal) => isNumericIdentifierTitle(proposal.before.title) && proposal.proposed.title).length,
    contractsWithAnyProposedChange: proposals.filter((proposal) => Object.values(proposal.proposed).some((value) => value !== null)).length,
    databaseBeforeCount: beforeRows.length,
    databaseAfterCount: afterRows.length,
    databaseBeforeSha256: beforeHash,
    databaseAfterSha256: afterHash,
    databasePreserved,
    requestMetrics,
  }
  const recommendation = !databasePreserved
    ? 'blocked — the contract snapshot changed during the read-only run; investigate external writers before any apply packet.'
    : unresolved.length > 0 || summary.numericTitlesWithProposedReplacement !== summary.numericIdentifierTitles
      ? 'needs more source review — keep unresolved fields unchanged and review the detailed evidence before a later bounded apply.'
      : 'ready for a later bounded apply — only after separate approval and the guarded export/rollback requirements above.'

  const packet = {
    generatedAt,
    scope: { expectedContracts: EXPECTED_CONTRACT_COUNT, actualContracts: proposals.length, readOnly: true },
    sourcePolicy: {
      searchEndpoint: SEARCH_ENDPOINT,
      detailEndpointTemplate: 'https://api.usaspending.gov/api/v2/awards/{generated_unique_award_id}/',
      profileUrlTemplate: 'https://www.usaspending.gov/award/{generated_unique_award_id}/',
      searchMatch: 'unquoted award_ids filter plus exact case-insensitive PIID post-filter',
      awardDateField: 'date_signed',
      retryPolicy: { maxAttempts: MAX_ATTEMPTS, timeoutMilliseconds: REQUEST_TIMEOUT_MS },
      concurrency,
    },
    summary,
    recommendation,
    failedOrRateLimitedRequests: requestEvents,
    proposals,
    rollbackRequirements: [
      'Take a fresh exact 228-row export and verify count/hash before any apply.',
      'Guard every update on contract id, contract number, and exact before value.',
      'Update only approved non-null awardDate, sourceUrl, and reviewed numeric-title proposals.',
      'Do not change status, agency, relationships, subscriber data, or other fields.',
      'Rollback only the approved fields from the fresh pre-apply export, guarded against concurrent changes.',
    ],
  }

  await Promise.all([
    writeFile(path.join(outputDir, 'contract-proposals.json'), `${JSON.stringify(packet, null, 2)}\n`, { flag: 'wx' }),
    writeFile(path.join(outputDir, 'contract-proposals.csv'), `${proposalsCsv(proposals)}\n`, { flag: 'wx' }),
    writeFile(path.join(outputDir, 'contract-rollback-export.json'), `${JSON.stringify({
      generatedAt,
      rowCount: beforeRows.length,
      sha256: beforeHash,
      contracts: beforeRows,
    }, null, 2)}\n`, { flag: 'wx' }),
    writeFile(path.join(outputDir, 'README.md'), buildMarkdownReport(
      summary,
      proposals,
      requestEvents,
      outputDir,
      generatedAt,
      recommendation
    ), { flag: 'wx' }),
  ])

  console.log(JSON.stringify({ outputDir, summary, recommendation }, null, 2))
  if (!databasePreserved) process.exitCode = 2
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
