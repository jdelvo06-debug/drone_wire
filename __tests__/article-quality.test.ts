import { calculateReadTime, nextAiRetryState } from '@/lib/articles/quality'
import { eventFingerprint, scoreArticleRelevance, selectClusterRepresentative } from '@/lib/articles/clustering'

describe('article quality lifecycle', () => {
  it('calculates a minimum one-minute read time from readable text', () => {
    expect(calculateReadTime('short text')).toBe(1)
    expect(calculateReadTime(Array.from({ length: 450 }, () => 'word').join(' '))).toBe(2)
  })

  it('uses exponential backoff and quarantines the fifth failed attempt', () => {
    const now = new Date('2026-08-23T12:00:00.000Z')
    expect(nextAiRetryState(0, 'invalid-output', now)).toMatchObject({ aiFailureCode: 'invalid-output', quarantine: false })
    expect(nextAiRetryState(4, 'invalid-output', now)).toMatchObject({ aiFailureCode: 'invalid-output', quarantine: true, nextRetryAt: null })
  })

  it('selects cluster representatives by completeness, source quality, then recency', () => {
    const representative = selectClusterRepresentative([
      { id: 'new-vendor', contentCompleteness: 0.8, sourceQuality: 2, publishedAt: new Date('2026-08-22') },
      { id: 'official', contentCompleteness: 0.8, sourceQuality: 3, publishedAt: new Date('2026-08-20') },
      { id: 'incomplete', contentCompleteness: 0.5, sourceQuality: 4, publishedAt: new Date('2026-08-23') },
    ])
    expect(representative?.id).toBe('official')
  })

  it('creates stable event fingerprints and excludes unrelated reporting', () => {
    expect(eventFingerprint('Army tests new counter-UAS drone interceptor'))
      .toBe(eventFingerprint('New Army drone interceptor tests: counter UAS'))
    expect(scoreArticleRelevance('Municipal budget meeting and road repairs')).toBe(0)
    expect(scoreArticleRelevance('Counter-UAS drone jammer and interceptor for air defense')).toBeGreaterThanOrEqual(0.75)
  })
})
