export function calculateReadTime(text: string, wordsPerMinute = 225): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function nextAiRetryState(currentRetryCount: number, failureCode: string, now = new Date()) {
  const attemptCount = currentRetryCount + 1
  const quarantine = attemptCount >= 5
  const backoffMinutes = Math.min(5 * 2 ** currentRetryCount, 24 * 60)
  return {
    aiFailureCode: failureCode,
    attemptCount,
    quarantine,
    nextRetryAt: quarantine ? null : new Date(now.getTime() + backoffMinutes * 60 * 1000),
    quarantinedAt: quarantine ? now : null,
  }
}
