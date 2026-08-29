import { render, screen } from '@testing-library/react'
import {
  PUBLIC_PROVENANCE_LABELS,
  ProvenanceBadge,
  SourceBibliography,
  ClaimProvenance,
  getRecordProvenanceLabel,
  resolveRecordProvenanceLabel,
} from '@/components/content/provenance'

describe('public provenance presentation', () => {
  it('exposes only the approved public labels and never an automated verified label', () => {
    expect(PUBLIC_PROVENANCE_LABELS).toEqual([
      'primary-source-backed',
      'vendor-reported',
      'secondary-source-backed',
      'partially-sourced',
      'unverified',
      'conflicting',
      'ai-generated',
    ])
    expect(PUBLIC_PROVENANCE_LABELS).not.toContain('verified')
  })

  it('falls back to unverified for legacy records without citations', () => {
    expect(getRecordProvenanceLabel([])).toBe('unverified')
    render(<ProvenanceBadge label={getRecordProvenanceLabel([])} />)
    expect(screen.getByText('Unverified')).toBeInTheDocument()
    expect(screen.getByText(/not yet been fully backfilled/i)).toBeInTheDocument()
  })

  it('renders a bibliography with publisher, title, and safe external links', () => {
    render(
      <SourceBibliography
        sources={[
          {
            id: 'source-1',
            title: 'Official product page',
            publisher: 'Example Program Office',
            canonicalUrl: 'https://example.gov/program',
            publicationDate: new Date('2026-08-01T00:00:00.000Z'),
            sourceType: 'government',
          },
        ]}
      />,
    )

    const link = screen.getByRole('link', { name: /official product page/i })
    expect(link).toHaveAttribute('href', 'https://example.gov/program')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('aria-label', 'Official product page — Example Program Office (opens in a new tab)')
    expect(screen.getByText(/Example Program Office/)).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('source-1')
  })

  it('distinguishes a citation query failure from a published empty bibliography', () => {
    render(<SourceBibliography sources={[]} unavailable />)

    expect(screen.getByRole('status')).toHaveTextContent(/temporarily unavailable/i)
    expect(screen.queryByText(/no bibliography has been published/i)).not.toBeInTheDocument()
  })

  it('does not claim a source is unpublished while claim citations are unavailable', () => {
    render(<ClaimProvenance claimKey="manufacturer" citations={[]} unavailable />)

    expect(screen.getByRole('status')).toHaveTextContent(/claim-level sources are temporarily unavailable/i)
    expect(screen.queryByText(/no claim-level source published/i)).not.toBeInTheDocument()
  })

  it.each([
    ['primary-source-backed', 'Primary source backed'],
    ['vendor-reported', 'Vendor reported'],
    ['partially-sourced', 'Partially sourced'],
    ['unverified', 'Unverified'],
  ] as const)('renders the public %s label distinctly', (label, copy) => {
    render(<ProvenanceBadge label={label} />)
    expect(screen.getByText(copy)).toBeInTheDocument()
  })

  it('keeps a record partially sourced when a required claim has no citation', () => {
    const citations = [{ claimKey: 'manufacturer', provenanceLabel: 'vendor-reported' }]
    expect(getRecordProvenanceLabel(citations, ['manufacturer', 'detectionRange'])).toBe('partially-sourced')
    render(<ClaimProvenance claimKey="detectionRange" citations={citations} />)
    expect(screen.getByText(/no claim-level source/i)).toBeInTheDocument()
  })

  it('shows the record label when it is public and only derives a fallback for legacy values', () => {
    const citations = [{ claimKey: 'content', provenanceLabel: 'primary-source-backed' }]
    expect(resolveRecordProvenanceLabel('vendor-reported', citations, ['content'])).toBe('vendor-reported')
    expect(resolveRecordProvenanceLabel('legacy', citations, ['content'])).toBe('primary-source-backed')
  })
})
