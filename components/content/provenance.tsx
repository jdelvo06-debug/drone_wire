import { AlertTriangle, BookOpen, Bot, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { safeHttpUrl } from '@/lib/security/html'

export const PUBLIC_PROVENANCE_LABELS = [
  'primary-source-backed',
  'vendor-reported',
  'secondary-source-backed',
  'partially-sourced',
  'unverified',
  'conflicting',
  'ai-generated',
] as const

export type PublicProvenanceLabel = (typeof PUBLIC_PROVENANCE_LABELS)[number]

export interface PublicCitation {
  provenanceLabel: string
  claimKey?: string
  evidenceText?: string | null
  stance?: string
  source?: PublicContentSource
}

export interface PublicContentSource {
  id: string
  title: string
  publisher: string
  canonicalUrl: string
  publicationDate?: Date | string | null
  accessedAt?: Date | string | null
  sourceType: string
}

const LABEL_COPY: Record<PublicProvenanceLabel, string> = {
  'primary-source-backed': 'Primary source backed',
  'vendor-reported': 'Vendor reported',
  'secondary-source-backed': 'Secondary source backed',
  'partially-sourced': 'Partially sourced',
  unverified: 'Unverified',
  conflicting: 'Conflicting sources',
  'ai-generated': 'AI generated',
}

export function isPublicProvenanceLabel(value: string): value is PublicProvenanceLabel {
  return PUBLIC_PROVENANCE_LABELS.includes(value as PublicProvenanceLabel)
}

function citationsForClaim(citations: PublicCitation[], claimKey: string) {
  return citations.filter((citation) => citation.claimKey === claimKey || citation.claimKey?.startsWith(`${claimKey}:`))
}

export function getRecordProvenanceLabel(citations: PublicCitation[], requiredClaimKeys: string[] = []): PublicProvenanceLabel {
  const labels = citations
    .map((citation) => citation.provenanceLabel)
    .filter(isPublicProvenanceLabel)

  if (labels.includes('conflicting')) return 'conflicting'
  if (labels.length === 0) return 'unverified'

  if (requiredClaimKeys.some((claimKey) => citationsForClaim(citations, claimKey).length === 0)) {
    return 'partially-sourced'
  }

  const evidenceLabels = labels.filter((label) => label !== 'ai-generated')
  if (evidenceLabels.length === 0) return 'ai-generated'
  if (evidenceLabels.includes('unverified')) return 'partially-sourced'

  const uniqueEvidenceLabels = new Set(evidenceLabels)
  return uniqueEvidenceLabels.size === 1
    ? evidenceLabels[0]
    : 'partially-sourced'
}

export function resolveRecordProvenanceLabel(
  recordLabel: string,
  citations: PublicCitation[],
  requiredClaimKeys: string[] = [],
): PublicProvenanceLabel {
  return isPublicProvenanceLabel(recordLabel)
    ? recordLabel
    : getRecordProvenanceLabel(citations, requiredClaimKeys)
}

export function ClaimProvenance({
  claimKey,
  citations,
  unavailable = false,
}: {
  claimKey: string
  citations: PublicCitation[]
  unavailable?: boolean
}) {
  if (unavailable) {
    return <p className="mt-1 text-xs text-amber-800 dark:text-amber-200" role="status">Claim-level sources are temporarily unavailable.</p>
  }
  const claimCitations = citationsForClaim(citations, claimKey)
  const label = getRecordProvenanceLabel(claimCitations)
  if (claimCitations.length === 0) {
    return <p className="mt-1 text-xs text-amber-800 dark:text-amber-200" role="note">No claim-level source published; treat this value as unverified.</p>
  }
  return (
    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
      <span className="font-medium">{LABEL_COPY[label]}</span>
      {claimCitations.map((citation, index) => (
        <p key={`${citation.claimKey}-${citation.source?.id || index}`}>
          {citation.stance === 'conflicts' ? 'Conflicting evidence' : 'Evidence'}
          {citation.source ? ` — ${citation.source.publisher}` : ''}
          {citation.evidenceText ? `: ${citation.evidenceText}` : ''}
        </p>
      ))}
    </div>
  )
}

export function ProvenanceBadge({ label }: { label: PublicProvenanceLabel }) {
  const isWarning = label === 'unverified' || label === 'conflicting' || label === 'partially-sourced'
  const isAi = label === 'ai-generated'

  return (
    <div className="space-y-2" data-provenance-label={label}>
      <Badge
        variant="outline"
        className={
          isWarning
            ? 'border-amber-500/70 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100'
            : 'border-emerald-500/60 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'
        }
      >
        {isWarning ? <AlertTriangle className="mr-1 h-3.5 w-3.5" /> : isAi ? <Bot className="mr-1 h-3.5 w-3.5" /> : <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
        {LABEL_COPY[label]}
      </Badge>
      {label === 'unverified' && (
        <p className="text-sm text-amber-900 dark:text-amber-100" role="note">
          This legacy record has not yet been fully backfilled with claim-level sources. Treat consequential details as unverified.
        </p>
      )}
      {label === 'conflicting' && (
        <p className="text-sm text-amber-900 dark:text-amber-100" role="note">
          Available sources conflict. DroneWire shows the disagreement instead of choosing a value silently.
        </p>
      )}
    </div>
  )
}

function formatSourceDate(source: PublicContentSource): string | null {
  const value = source.publicationDate || source.accessedAt
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function SourceBibliography({
  sources,
  unavailable = false,
}: {
  sources: PublicContentSource[]
  unavailable?: boolean
}) {
  const safeSources = sources.reduce<Array<PublicContentSource & { canonicalUrl: string }>>((items, source) => {
    const canonicalUrl = safeHttpUrl(source.canonicalUrl)
    if (canonicalUrl) items.push({ ...source, canonicalUrl })
    return items
  }, [])

  return (
    <Card aria-labelledby="source-bibliography-heading">
      <CardHeader>
        <CardTitle id="source-bibliography-heading" className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Sources and methodology
        </CardTitle>
      </CardHeader>
      <CardContent>
        {unavailable ? (
          <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
            Sources are temporarily unavailable. Provenance has not been downgraded or inferred from this query failure.
          </p>
        ) : safeSources.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bibliography has been published for this legacy record yet.
          </p>
        ) : (
          <ol className="list-decimal space-y-3 pl-5">
            {safeSources.map((source) => {
              const date = formatSourceDate(source)
              return (
                <li key={source.id} className="text-sm">
                  <a
                    href={source.canonicalUrl}
                    aria-label={`${source.title} — ${source.publisher} (opens in a new tab)`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {source.title}
                  </a>
                  <span className="text-muted-foreground">
                    {' '}— {source.publisher} · {source.sourceType}{date ? ` · ${date}` : ''}
                  </span>
                </li>
              )
            })}
          </ol>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Provenance labels describe the available evidence. AI-assisted processing is disclosed and is never labeled “verified.”
        </p>
      </CardContent>
    </Card>
  )
}
