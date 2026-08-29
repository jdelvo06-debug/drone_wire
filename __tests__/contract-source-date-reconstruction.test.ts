import {
  assessStoredAwardDate,
  buildAwardEvidenceApiUrl,
  buildCanonicalAwardUrl,
  buildReadableAwardTitle,
  chooseAwardCandidate,
  createContractProposal,
  createUnresolvedContractProposal,
  type AwardDetail,
  type AwardSearchCandidate,
  type StoredContract,
} from '@/lib/contracts/source-date-reconstruction'

const contract: StoredContract = {
  id: 'contract-1',
  contractNumber: '15BNAS21PW9H10039',
  title: 'Installation of a Counter Unmanned Aerial System',
  description: 'INSTALLATION OF A COUNTER UNMANNED AERIAL SYSTEM.',
  awardDate: '2026-05-04T00:39:07.750Z',
  company: 'SENECA GLOBAL SERVICES LLC',
  value: '4499998.00',
  agency: 'Department of Justice',
  sourceUrl: 'https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_9700_-NONE-_-NONE-',
  scrapedAt: '2026-05-04T00:39:08.000Z',
  createdAt: '2026-05-04T00:39:09.091Z',
}

const searchCandidate: AwardSearchCandidate = {
  awardId: contract.contractNumber,
  generatedInternalId: 'CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-',
  recipientName: contract.company,
  description: contract.description,
  awardAmount: 4499998,
  baseObligationDate: '2021-04-08',
  startDate: '2021-08-01',
  endDate: '2023-12-31',
  awardingAgency: contract.agency,
  awardingAgencyCode: '015',
  awardingSubAgency: 'Federal Prison System / Bureau of Prisons',
  awardingSubAgencyCode: '1540',
  contractAwardType: 'PURCHASE ORDER',
}

const detail: AwardDetail = {
  generatedUniqueAwardId: searchCandidate.generatedInternalId,
  piid: contract.contractNumber,
  category: 'contract',
  description: contract.description,
  dateSigned: '2021-04-08',
  totalObligation: 4499998,
  recipientName: contract.company,
  awardingAgency: contract.agency,
  awardingAgencyCode: '015',
  awardingSubAgency: 'Federal Prison System / Bureau of Prisons',
  awardingSubAgencyCode: '1540',
}

describe('contract source/date reconstruction', () => {
  it('builds the canonical profile URL from the full generated award identifier', () => {
    expect(buildCanonicalAwardUrl(searchCandidate.generatedInternalId!)).toBe(
      'https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/'
    )
    expect(buildAwardEvidenceApiUrl(searchCandidate.generatedInternalId!)).toBe(
      'https://api.usaspending.gov/api/v2/awards/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/'
    )
  })

  it('classifies a stored scrape-time value as an ingestion timestamp', () => {
    expect(assessStoredAwardDate(contract, detail.dateSigned)).toEqual({
      classification: 'ingestion_timestamp',
      authoritativeDate: '2021-04-08',
      reason: 'Stored awardDate is within five minutes of scrapedAt/createdAt and differs from USAspending date_signed.',
    })
  })

  it('recognizes a stored date that already matches the authoritative date', () => {
    expect(assessStoredAwardDate({
      ...contract,
      awardDate: '2021-04-08T00:00:00.000Z',
      scrapedAt: '2026-05-04T00:39:08.000Z',
      createdAt: '2026-05-04T00:39:09.091Z',
    }, detail.dateSigned)).toMatchObject({ classification: 'authoritative_match' })
  })

  it('keeps only exact PIID matches from the fuzzy search endpoint', () => {
    const result = chooseAwardCandidate(contract, [
      { ...searchCandidate, awardId: '15BNAS21PW9H100390' },
      searchCandidate,
    ])

    expect(result.candidate).toEqual(searchCandidate)
    expect(result.confidence).toBe('high')
  })

  it('uses stored recipient, amount, and description to resolve duplicate exact PIIDs', () => {
    const result = chooseAwardCandidate(contract, [
      { ...searchCandidate, generatedInternalId: 'CONT_AWD_OTHER_015', recipientName: 'OTHER COMPANY', awardAmount: 12 },
      searchCandidate,
    ])

    expect(result.candidate?.generatedInternalId).toBe(searchCandidate.generatedInternalId)
    expect(result.confidence).toBe('high')
    expect(createContractProposal(contract, result.candidate!, detail, result).matchAssessment).toEqual({
      confidence: result.confidence,
      reason: result.reason,
      exactCandidateCount: result.exactCandidateCount,
    })
  })

  it('refuses to choose between equally supported duplicate exact PIIDs', () => {
    const result = chooseAwardCandidate(contract, [
      searchCandidate,
      { ...searchCandidate, generatedInternalId: 'CONT_AWD_15BNAS21PW9H10039_1501_-NONE-_-NONE-' },
    ])

    expect(result.candidate).toBeNull()
    expect(result.confidence).toBe('unresolved')
    expect(result.reason).toContain('ambiguous')
  })

  it('leaves missing or non-matching award identifiers unresolved', () => {
    expect(chooseAwardCandidate({ ...contract, contractNumber: null }, [searchCandidate])).toMatchObject({
      candidate: null,
      confidence: 'unresolved',
      exactCandidateCount: 0,
    })
    expect(chooseAwardCandidate(contract, [{ ...searchCandidate, awardId: 'OTHER' }])).toMatchObject({
      candidate: null,
      confidence: 'unresolved',
      exactCandidateCount: 0,
    })
  })

  it('keeps unmatched and invalid authoritative dates unresolved', () => {
    expect(assessStoredAwardDate({
      ...contract,
      awardDate: '2020-01-01T00:00:00.000Z',
      scrapedAt: '2026-05-04T00:39:08.000Z',
      createdAt: '2026-05-04T00:39:09.091Z',
    }, '2021-04-08')).toMatchObject({ classification: 'unresolved', authoritativeDate: '2021-04-08' })
    expect(assessStoredAwardDate({
      ...contract,
      awardDate: '2020-01-01T00:00:00.000Z',
    }, 'not-a-date')).toMatchObject({ classification: 'unresolved', authoritativeDate: null })
  })

  it('builds a readable title only from authoritative descriptive text', () => {
    expect(buildReadableAwardTitle(
      '4558243344',
      '4558243344!COUNTER UNMANNED ARIAL SYSTEM CAMERA AND ACCESSORIES.'
    )).toBe('Counter Unmanned Arial System Camera and Accessories')

    expect(buildReadableAwardTitle('4558243344', '4558243344')).toBeNull()
    expect(buildReadableAwardTitle('Readable existing title', '4558243344!COUNTER UAS CAMERA')).toBeNull()
  })

  it('removes incomplete trailing source fragments without inventing replacement words', () => {
    expect(buildReadableAwardTitle('4558243344', '4558243344!COUNTER UNMANNED ARIAL SYSTEM CAMERA AND'))
      .toBe('Counter Unmanned Arial System Camera')
    expect(buildReadableAwardTitle('4569639145', '4569639145!COUNTER UAS SYSTEM SPARES MODULE A'))
      .toBe('Counter UAS System Spares Module A')
    expect(buildReadableAwardTitle('4571157251', '4571157251!GHOUL COUNTER UAS SYSTEM USED TO PROTECT'))
      .toBe('Ghoul Counter UAS System')
  })

  it('produces before/after proposals without changing the stored contract', () => {
    const numericContract = { ...contract, title: '4558243344' }
    const original = { ...numericContract }
    const proposal = createContractProposal(
      numericContract,
      searchCandidate,
      { ...detail, description: '4558243344!COUNTER UNMANNED ARIAL SYSTEM CAMERA AND ACCESSORIES.' }
    )

    expect(proposal.status).toBe('proposed')
    expect(proposal.proposed).toEqual({
      awardDate: '2021-04-08T00:00:00.000Z',
      sourceUrl: 'https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/',
      title: 'Counter Unmanned Arial System Camera and Accessories',
    })
    expect(proposal.evidence.evidenceApiUrl).toBe(
      'https://api.usaspending.gov/api/v2/awards/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/'
    )
    expect(proposal.fieldAssessments.awardDate).toMatchObject({ confidence: 'high' })
    expect(proposal.fieldAssessments.sourceUrl).toMatchObject({ confidence: 'high' })
    expect(proposal.fieldAssessments.title.reason).toContain('authoritative award description')
    expect(numericContract).toEqual(original)
  })

  it('does not propose a URL change for the same generated award identifier without a trailing slash', () => {
    const alreadyCanonical = {
      ...contract,
      sourceUrl: 'https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-',
    }

    expect(createContractProposal(alreadyCanonical, searchCandidate, detail).proposed.sourceUrl).toBeNull()
  })

  it('replaces a malformed stored source URL with the authoritative profile URL', () => {
    expect(createContractProposal(
      { ...contract, sourceUrl: 'not a valid URL' },
      searchCandidate,
      detail
    ).proposed.sourceUrl).toBe(
      'https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/'
    )
  })

  it.each([
    null,
    'https://example.com/award/CONT_AWD_OTHER',
    'https://www.usaspending.gov/not-an-award/CONT_AWD_OTHER',
  ])('replaces a missing or non-profile source URL: %s', (sourceUrl) => {
    expect(createContractProposal({ ...contract, sourceUrl }, searchCandidate, detail).proposed.sourceUrl)
      .toBe('https://www.usaspending.gov/award/CONT_AWD_15BNAS21PW9H10039_1540_-NONE-_-NONE-/')
  })

  it('rejects detail evidence whose PIID does not match the stored award identifier', () => {
    const proposal = createContractProposal(contract, searchCandidate, { ...detail, piid: 'OTHER-AWARD' })

    expect(proposal.status).toBe('unresolved')
    expect(proposal.reason).toContain('PIID')
    expect(proposal.proposed).toEqual({ awardDate: null, sourceUrl: null, title: null })
  })

  it('rejects mismatched generated identifiers and non-contract detail records', () => {
    expect(createContractProposal(
      contract,
      searchCandidate,
      { ...detail, generatedUniqueAwardId: 'CONT_AWD_OTHER' }
    ).reason).toContain('generated award identifiers')
    expect(createContractProposal(
      contract,
      searchCandidate,
      { ...detail, category: 'grant' }
    ).reason).toContain('contract award')
  })

  it('creates a complete unresolved proposal without mutating input', () => {
    const original = { ...contract }
    const proposal = createUnresolvedContractProposal(contract, 'No reliable source match.')

    expect(proposal.status).toBe('unresolved')
    expect(proposal.unresolvedFields).toEqual(['awardDate', 'sourceUrl'])
    expect(contract).toEqual(original)
  })
})
