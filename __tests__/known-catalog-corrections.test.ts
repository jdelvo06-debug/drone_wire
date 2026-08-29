import { KNOWN_CATALOG_CORRECTIONS, KNOWN_EXPLAINER_CORRECTIONS } from '@/lib/content/known-catalog-corrections'

describe('known catalog corrections', () => {
  it('separates RTX KuRFS from the Army AN/MPQ-64 Sentinel', () => {
    const kurfs = KNOWN_CATALOG_CORRECTIONS.find((item) => item.slug === 'kurfs')
    const sentinel = KNOWN_CATALOG_CORRECTIONS.find((item) => item.slug === 'ku-band-sentinel')

    expect(kurfs?.changes.manufacturer).toBe('Raytheon (RTX)')
    expect(kurfs?.sources.some((source) => source.canonicalUrl.includes('/kurfs'))).toBe(true)
    expect(sentinel?.changes.name).toBe('AN/MPQ-64 Sentinel')
    expect(sentinel?.changes.primaryCapability).toMatch(/X-band/i)
    expect(sentinel?.sources.some((source) => source.publisher === 'U.S. Army')).toBe(true)
  })

  it('rebuilds P-HEL around the Army and LOCUST record rather than the incorrect vendor/power claim', () => {
    const phel = KNOWN_CATALOG_CORRECTIONS.find((item) => item.slug === 'p-hel')

    expect(phel?.changes.manufacturer).toContain('SAIC')
    expect(phel?.changes.manufacturer).toContain('BlueHalo')
    expect(phel?.changes.specifications).toContain('2022 demonstrated prototype: 10 kW class')
    expect(phel?.changes.specifications).not.toContain('50 kW')
    expect(phel?.sources.map((source) => source.sourceType)).toContain('government')
  })

  it('separates confirmed facts, vendor claims, analysis, and unresolved information', () => {
    for (const correction of [...KNOWN_CATALOG_CORRECTIONS, ...KNOWN_EXPLAINER_CORRECTIONS]) {
      expect(correction.evidence).toEqual(expect.objectContaining({
        confirmedFacts: expect.any(Array),
        vendorClaims: expect.any(Array),
        analysis: expect.any(Array),
        unresolved: expect.any(Array),
      }))
      expect(correction.baselineSha256).toMatch(/^[a-f0-9]{64}$/)
    }
  })

  it('removes only the unverified Block 1 image and keeps broader variant claims unresolved', () => {
    const block1 = KNOWN_CATALOG_CORRECTIONS.find((item) => item.slug === 'coyote-block-1')
    expect(Object.keys(block1?.changes || {})).toEqual(['imageUrl'])
    expect(block1?.evidence.unresolved.join(' ')).toMatch(/dimensions.*range.*warhead/i)
  })

  it('does not relabel a Block 2 image as Coyote Block 1', () => {
    const block1 = KNOWN_CATALOG_CORRECTIONS.find((item) => item.slug === 'coyote-block-1')
    expect(block1?.changes.imageUrl).toBeNull()
    expect(block1?.mediaVerificationState).toBe('variant-mismatch-removed')
  })

  it('replaces unsupported JIATF-401 claims with current official-source boundaries', () => {
    const jiatf = KNOWN_EXPLAINER_CORRECTIONS[0]
    expect(jiatf.slug).toContain('jiatf-401')
    expect(jiatf.changes.content).not.toContain('holds up to $50')
    expect(jiatf.changes.content).toContain('Evidence limits')
    expect(jiatf.sources.every((source) => source.sourceType === 'government')).toBe(true)
  })
})
