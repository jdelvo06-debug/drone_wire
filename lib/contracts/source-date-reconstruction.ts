export const USASPENDING_API_BASE = 'https://api.usaspending.gov/api/v2'
export const USASPENDING_PROFILE_BASE = 'https://www.usaspending.gov/award'

const INGESTION_WINDOW_MS = 5 * 60 * 1000
const NUMERIC_IDENTIFIER = /^\s*\d+(?:[\s._/-]*\d+)*\s*$/
const KNOWN_ACRONYMS = new Set([
  'AI', 'C-UAS', 'CUAS', 'DOD', 'EO/IR', 'GPS', 'ISR', 'RF', 'UAS', 'UAV', 'US', 'USA',
])
const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to'])

export interface StoredContract {
  id: string
  contractNumber: string | null
  title: string
  description: string | null
  awardDate: string
  company: string
  value: string
  agency: string
  sourceUrl: string | null
  scrapedAt: string
  createdAt: string
}

export interface AwardSearchCandidate {
  awardId: string | null
  generatedInternalId: string | null
  recipientName: string | null
  description: string | null
  awardAmount: number | null
  baseObligationDate: string | null
  startDate: string | null
  endDate: string | null
  awardingAgency: string | null
  awardingAgencyCode: string | null
  awardingSubAgency: string | null
  awardingSubAgencyCode: string | null
  contractAwardType: string | null
}

export interface AwardDetail {
  generatedUniqueAwardId: string | null
  piid: string | null
  category: string | null
  description: string | null
  dateSigned: string | null
  totalObligation: number | null
  recipientName: string | null
  awardingAgency: string | null
  awardingAgencyCode: string | null
  awardingSubAgency: string | null
  awardingSubAgencyCode: string | null
}

export type EvidenceConfidence = 'high' | 'medium' | 'unresolved'
export type StoredDateClassification = 'ingestion_timestamp' | 'authoritative_match' | 'unresolved'

export interface CandidateChoice {
  candidate: AwardSearchCandidate | null
  confidence: EvidenceConfidence
  reason: string
  exactCandidateCount: number
}

export interface StoredDateAssessment {
  classification: StoredDateClassification
  authoritativeDate: string | null
  reason: string
}

export interface ContractProposal {
  contractId: string
  contractNumber: string | null
  status: 'proposed' | 'no_change' | 'unresolved'
  confidence: EvidenceConfidence
  reason: string
  matchAssessment: {
    confidence: EvidenceConfidence
    reason: string
    exactCandidateCount: number
  }
  before: {
    awardDate: string
    sourceUrl: string | null
    title: string
  }
  proposed: {
    awardDate: string | null
    sourceUrl: string | null
    title: string | null
  }
  dateAssessment: StoredDateAssessment
  fieldAssessments: {
    awardDate: { confidence: EvidenceConfidence; reason: string }
    sourceUrl: { confidence: EvidenceConfidence; reason: string }
    title: { confidence: EvidenceConfidence; reason: string }
  }
  unresolvedFields: Array<'awardDate' | 'sourceUrl' | 'title'>
  evidence: {
    evidenceApiUrl: string | null
    canonicalProfileUrl: string | null
    generatedUniqueAwardId: string | null
    piid: string | null
    dateSigned: string | null
    baseObligationDate: string | null
    startDate: string | null
    description: string | null
    recipientName: string | null
    totalObligation: number | null
    awardingAgency: string | null
    awardingAgencyCode: string | null
    awardingSubAgency: string | null
    awardingSubAgencyCode: string | null
  }
}

function normalizeIdentifier(value: string | null | undefined): string {
  return (value || '').trim().toUpperCase()
}

function normalizeText(value: string | null | undefined): string {
  return (value || '')
    .normalize('NFKC')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseIsoDate(value: string | null | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value ? null : value
}

function toMilliseconds(value: string): number | null {
  const milliseconds = new Date(value).getTime()
  return Number.isNaN(milliseconds) ? null : milliseconds
}

function isNearIngestionTimestamp(contract: StoredContract): boolean {
  const awardTime = toMilliseconds(contract.awardDate)
  if (awardTime === null) return false

  return [contract.scrapedAt, contract.createdAt].some((value) => {
    const ingestionTime = toMilliseconds(value)
    return ingestionTime !== null && Math.abs(awardTime - ingestionTime) <= INGESTION_WINDOW_MS
  })
}

function candidateSupportScore(contract: StoredContract, candidate: AwardSearchCandidate): number {
  let score = 0

  if (normalizeText(contract.company) === normalizeText(candidate.recipientName)) score += 4
  if (candidate.awardAmount !== null && Math.abs(Number(contract.value) - candidate.awardAmount) <= 0.01) score += 4
  if (normalizeText(contract.description) && normalizeText(contract.description) === normalizeText(candidate.description)) score += 3
  if (normalizeText(contract.agency) === normalizeText(candidate.awardingAgency)) score += 1

  return score
}

export function buildCanonicalAwardUrl(generatedUniqueAwardId: string): string {
  return `${USASPENDING_PROFILE_BASE}/${encodeURIComponent(generatedUniqueAwardId)}/`
}

export function buildAwardEvidenceApiUrl(generatedUniqueAwardId: string): string {
  return `${USASPENDING_API_BASE}/awards/${encodeURIComponent(generatedUniqueAwardId)}/`
}

function storedAwardIdentifier(sourceUrl: string | null): string | null {
  if (!sourceUrl) return null
  try {
    const parsed = new URL(sourceUrl)
    if (parsed.hostname !== 'www.usaspending.gov') return null
    const match = parsed.pathname.match(/^\/award\/([^/]+)\/?$/)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

export function chooseAwardCandidate(
  contract: StoredContract,
  candidates: AwardSearchCandidate[]
): CandidateChoice {
  const awardId = normalizeIdentifier(contract.contractNumber)
  if (!awardId) {
    return {
      candidate: null,
      confidence: 'unresolved',
      reason: 'Stored contractNumber is missing, so no authoritative award identifier is available.',
      exactCandidateCount: 0,
    }
  }

  const exactCandidates = candidates.filter((candidate) => (
    normalizeIdentifier(candidate.awardId) === awardId && Boolean(candidate.generatedInternalId)
  ))

  if (exactCandidates.length === 0) {
    return {
      candidate: null,
      confidence: 'unresolved',
      reason: 'USAspending search returned no exact PIID with a generated award identifier.',
      exactCandidateCount: 0,
    }
  }

  if (exactCandidates.length === 1) {
    return {
      candidate: exactCandidates[0],
      confidence: 'high',
      reason: 'USAspending returned one exact PIID with a generated award identifier.',
      exactCandidateCount: 1,
    }
  }

  const ranked = exactCandidates
    .map((candidate) => ({ candidate, score: candidateSupportScore(contract, candidate) }))
    .sort((left, right) => right.score - left.score)

  const best = ranked[0]
  const runnerUp = ranked[1]
  if (best.score >= 7 && best.score - runnerUp.score >= 3) {
    return {
      candidate: best.candidate,
      confidence: 'high',
      reason: 'Multiple exact PIIDs were returned; recipient, amount, description, and agency evidence uniquely supported one candidate.',
      exactCandidateCount: exactCandidates.length,
    }
  }

  return {
    candidate: null,
    confidence: 'unresolved',
    reason: `USAspending returned ${exactCandidates.length} ambiguous exact PIID candidates without a uniquely supported match.`,
    exactCandidateCount: exactCandidates.length,
  }
}

export function assessStoredAwardDate(
  contract: StoredContract,
  authoritativeDate: string | null
): StoredDateAssessment {
  const parsedAuthoritativeDate = parseIsoDate(authoritativeDate)
  const storedDate = new Date(contract.awardDate)
  const storedCalendarDate = Number.isNaN(storedDate.getTime()) ? null : storedDate.toISOString().slice(0, 10)

  if (isNearIngestionTimestamp(contract)) {
    const relationship = parsedAuthoritativeDate && storedCalendarDate !== parsedAuthoritativeDate
      ? ' and differs from USAspending date_signed'
      : ''
    return {
      classification: 'ingestion_timestamp',
      authoritativeDate: parsedAuthoritativeDate,
      reason: `Stored awardDate is within five minutes of scrapedAt/createdAt${relationship}.`,
    }
  }

  if (parsedAuthoritativeDate && storedCalendarDate === parsedAuthoritativeDate) {
    return {
      classification: 'authoritative_match',
      authoritativeDate: parsedAuthoritativeDate,
      reason: 'Stored awardDate has the same calendar date as USAspending date_signed and is not near ingestion timestamps.',
    }
  }

  return {
    classification: 'unresolved',
    authoritativeDate: parsedAuthoritativeDate,
    reason: parsedAuthoritativeDate
      ? 'Stored awardDate differs from USAspending date_signed but is not near the recorded ingestion timestamps.'
      : 'USAspending detail did not provide a valid date_signed value.',
  }
}

export function isNumericIdentifierTitle(title: string): boolean {
  return NUMERIC_IDENTIFIER.test(title)
}

function titleCaseAuthoritativeText(value: string): string {
  return value.split(' ').map((word, index) => {
    const bareWord = word.replace(/^[^A-Z0-9]+|[^A-Z0-9]+$/gi, '')
    const prefix = word.slice(0, word.indexOf(bareWord))
    const suffix = word.slice(prefix.length + bareWord.length)
    const upper = bareWord.toUpperCase()

    if (!bareWord) return word
    if (KNOWN_ACRONYMS.has(upper) || (bareWord.length === 1 && bareWord === upper)) {
      return `${prefix}${upper}${suffix}`
    }

    const lower = bareWord.toLowerCase()
    const cased = index > 0 && SMALL_WORDS.has(lower)
      ? lower
      : `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`
    return `${prefix}${cased}${suffix}`
  }).join(' ')
}

export function buildReadableAwardTitle(currentTitle: string, authoritativeDescription: string | null): string | null {
  if (!isNumericIdentifierTitle(currentTitle) || !authoritativeDescription) return null

  const normalized = authoritativeDescription.replace(/\s+/g, ' ').trim()
  const withoutLeadingIdentifier = normalized.replace(/^\s*\d+(?:[\s._/-]*\d+)*\s*[!|:;,-]+\s*/, '')
  const firstSentence = (withoutLeadingIdentifier.match(/^[^.!?]+/)?.[0] || withoutLeadingIdentifier)
    .replace(/[\s.!?]+$/g, '')
    .replace(/\s+(?:USED TO PROTECT|AND|OR|TO|FOR|OF)$/i, '')
    .trim()

  if (!firstSentence || NUMERIC_IDENTIFIER.test(firstSentence)) return null
  return titleCaseAuthoritativeText(firstSentence).slice(0, 200).trim() || null
}

function unresolvedProposal(
  contract: StoredContract,
  reason: string,
  matchChoice?: CandidateChoice
): ContractProposal {
  return {
    contractId: contract.id,
    contractNumber: contract.contractNumber,
    status: 'unresolved',
    confidence: 'unresolved',
    reason,
    matchAssessment: matchChoice
      ? {
          confidence: matchChoice.confidence,
          reason: matchChoice.reason,
          exactCandidateCount: matchChoice.exactCandidateCount,
        }
      : { confidence: 'unresolved', reason, exactCandidateCount: 0 },
    before: {
      awardDate: contract.awardDate,
      sourceUrl: contract.sourceUrl,
      title: contract.title,
    },
    proposed: { awardDate: null, sourceUrl: null, title: null },
    dateAssessment: assessStoredAwardDate(contract, null),
    fieldAssessments: {
      awardDate: { confidence: 'unresolved', reason },
      sourceUrl: { confidence: 'unresolved', reason },
      title: {
        confidence: isNumericIdentifierTitle(contract.title) ? 'unresolved' : 'high',
        reason: isNumericIdentifierTitle(contract.title)
          ? 'No reliable authoritative description was available for a readable replacement title.'
          : 'The stored title is not a numeric identifier, so no title change is proposed.',
      },
    },
    unresolvedFields: ['awardDate', 'sourceUrl', ...(isNumericIdentifierTitle(contract.title) ? ['title' as const] : [])],
    evidence: {
      evidenceApiUrl: null,
      canonicalProfileUrl: null,
      generatedUniqueAwardId: null,
      piid: null,
      dateSigned: null,
      baseObligationDate: null,
      startDate: null,
      description: null,
      recipientName: null,
      totalObligation: null,
      awardingAgency: null,
      awardingAgencyCode: null,
      awardingSubAgency: null,
      awardingSubAgencyCode: null,
    },
  }
}

export function createContractProposal(
  contract: StoredContract,
  candidate: AwardSearchCandidate,
  detail: AwardDetail,
  matchChoice?: CandidateChoice
): ContractProposal {
  if (normalizeIdentifier(detail.piid) !== normalizeIdentifier(contract.contractNumber)) {
    return unresolvedProposal(contract, 'USAspending detail PIID does not match the stored authoritative award identifier.', matchChoice)
  }

  if (!candidate.generatedInternalId || detail.generatedUniqueAwardId !== candidate.generatedInternalId) {
    return unresolvedProposal(contract, 'USAspending search and detail generated award identifiers do not match.', matchChoice)
  }

  if (detail.category !== 'contract') {
    return unresolvedProposal(contract, 'USAspending detail does not identify the record as a contract award.', matchChoice)
  }

  const canonicalProfileUrl = buildCanonicalAwardUrl(detail.generatedUniqueAwardId)
  const evidenceApiUrl = buildAwardEvidenceApiUrl(detail.generatedUniqueAwardId)
  const dateAssessment = assessStoredAwardDate(contract, detail.dateSigned)
  const parsedDate = parseIsoDate(detail.dateSigned)
  const proposedAwardDate = parsedDate ? `${parsedDate}T00:00:00.000Z` : null
  const proposedTitle = buildReadableAwardTitle(contract.title, detail.description)
  const unresolvedFields: ContractProposal['unresolvedFields'] = []

  if (!proposedAwardDate) unresolvedFields.push('awardDate')
  if (isNumericIdentifierTitle(contract.title) && !proposedTitle) unresolvedFields.push('title')

  const proposed = {
    awardDate: proposedAwardDate && proposedAwardDate !== contract.awardDate ? proposedAwardDate : null,
    sourceUrl: storedAwardIdentifier(contract.sourceUrl) !== detail.generatedUniqueAwardId ? canonicalProfileUrl : null,
    title: proposedTitle && proposedTitle !== contract.title ? proposedTitle : null,
  }
  const hasProposal = Object.values(proposed).some((value) => value !== null)

  return {
    contractId: contract.id,
    contractNumber: contract.contractNumber,
    status: hasProposal ? 'proposed' : 'no_change',
    confidence: unresolvedFields.length > 0 ? 'medium' : 'high',
    reason: hasProposal
      ? 'Exact PIID and generated award detail support the proposed source/date values.'
      : 'Stored source/date values already match the authoritative USAspending evidence.',
    matchAssessment: matchChoice
      ? {
          confidence: matchChoice.confidence,
          reason: matchChoice.reason,
          exactCandidateCount: matchChoice.exactCandidateCount,
        }
      : {
          confidence: 'high',
          reason: 'The supplied candidate was validated against matching USAspending detail evidence.',
          exactCandidateCount: 1,
        },
    before: {
      awardDate: contract.awardDate,
      sourceUrl: contract.sourceUrl,
      title: contract.title,
    },
    proposed,
    dateAssessment,
    fieldAssessments: {
      awardDate: {
        confidence: parsedDate ? 'high' : 'unresolved',
        reason: parsedDate
          ? 'Exact PIID detail evidence supplies USAspending date_signed; the proposed value preserves that calendar date at UTC midnight.'
          : 'USAspending detail did not supply a valid date_signed value.',
      },
      sourceUrl: {
        confidence: 'high',
        reason: 'Exact PIID detail evidence supplies the full generated_unique_award_id used in the USAspending profile URL.',
      },
      title: proposedTitle
        ? {
            confidence: 'high',
            reason: 'The numeric identifier title is replaced only with normalized words from the authoritative award description; no replacement terms were invented.',
          }
        : {
            confidence: isNumericIdentifierTitle(contract.title) ? 'unresolved' : 'high',
            reason: isNumericIdentifierTitle(contract.title)
              ? 'The authoritative description did not yield a readable non-numeric title.'
              : 'The stored title is not a numeric identifier, so no title change is proposed.',
          },
    },
    unresolvedFields,
    evidence: {
      evidenceApiUrl,
      canonicalProfileUrl,
      generatedUniqueAwardId: detail.generatedUniqueAwardId,
      piid: detail.piid,
      dateSigned: detail.dateSigned,
      baseObligationDate: candidate.baseObligationDate,
      startDate: candidate.startDate,
      description: detail.description,
      recipientName: detail.recipientName,
      totalObligation: detail.totalObligation,
      awardingAgency: detail.awardingAgency,
      awardingAgencyCode: detail.awardingAgencyCode,
      awardingSubAgency: detail.awardingSubAgency,
      awardingSubAgencyCode: detail.awardingSubAgencyCode,
    },
  }
}

export function createUnresolvedContractProposal(contract: StoredContract, reason: string): ContractProposal {
  return unresolvedProposal(contract, reason)
}
