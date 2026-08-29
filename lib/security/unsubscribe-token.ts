import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_VERSION = 'v2'
const DEFAULT_TTL_SECONDS = 90 * 24 * 60 * 60

export type NewsletterTokenPurpose = 'unsubscribe' | 'preferences'

export interface VerifiedNewsletterToken {
  subscriberId: string
  tokenRevision: number
  expiresAt: number
}

function getUnsubscribeSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || (
    process.env.NODE_ENV === 'production' ? undefined : process.env.ADMIN_SECRET
  )
  if (!secret) throw new Error('Unsubscribe links are not configured')
  return secret
}

function sign(payload: string): Buffer {
  return createHmac('sha256', getUnsubscribeSecret()).update(payload).digest()
}

function createNewsletterToken(
  subscriberId: string,
  tokenRevision: number,
  purpose: NewsletterTokenPurpose,
  now = new Date(),
): string {
  const encodedId = Buffer.from(subscriberId, 'utf8').toString('base64url')
  const expiresAt = Math.floor(now.getTime() / 1000) + DEFAULT_TTL_SECONDS
  const payload = `${TOKEN_VERSION}.${purpose}.${tokenRevision}.${expiresAt}.${encodedId}`
  return `${payload}.${sign(payload).toString('base64url')}`
}

export function createUnsubscribeToken(subscriberId: string, tokenRevision = 0, now = new Date()): string {
  return createNewsletterToken(subscriberId, tokenRevision, 'unsubscribe', now)
}

export function createPreferenceToken(subscriberId: string, tokenRevision = 0, now = new Date()): string {
  return createNewsletterToken(subscriberId, tokenRevision, 'preferences', now)
}

export function verifyUnsubscribeToken(
  token: string,
  expectedPurpose: NewsletterTokenPurpose = 'unsubscribe',
  now = new Date(),
): VerifiedNewsletterToken | null {
  const [version, purpose, revision, expiry, encodedId, encodedSignature, extra] = token.split('.')
  if (
    extra !== undefined || version !== TOKEN_VERSION || purpose !== expectedPurpose ||
    !/^\d+$/.test(revision || '') || !/^\d+$/.test(expiry || '') || !encodedId || !encodedSignature
  ) return null

  try {
    const expiresAt = Number(expiry)
    if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(now.getTime() / 1000)) return null
    const tokenRevision = Number(revision)
    if (!Number.isSafeInteger(tokenRevision) || tokenRevision < 0) return null
    if (!/^[A-Za-z0-9_-]+$/.test(encodedSignature) || !/^[A-Za-z0-9_-]+$/.test(encodedId)) return null
    const payload = `${version}.${purpose}.${revision}.${expiry}.${encodedId}`
    const supplied = Buffer.from(encodedSignature, 'base64url')
    const expected = sign(payload)
    if (supplied.toString('base64url') !== encodedSignature) return null
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null
    const decodedId = Buffer.from(encodedId, 'base64url')
    if (decodedId.toString('base64url') !== encodedId) return null
    const subscriberId = decodedId.toString('utf8')
    return subscriberId ? { subscriberId, tokenRevision, expiresAt } : null
  } catch {
    return null
  }
}

function tokenUrl(pathname: '/unsubscribe' | '/preferences', token: string): string {
  const siteUrl = process.env.SITE_URL || 'https://dronewire.org'
  const url = new URL(pathname, siteUrl)
  url.searchParams.set('token', token)
  return url.toString()
}

export function createUnsubscribeUrl(subscriberId: string, tokenRevision = 0): string {
  return tokenUrl('/unsubscribe', createUnsubscribeToken(subscriberId, tokenRevision))
}

export function createPreferenceUrl(subscriberId: string, tokenRevision = 0): string {
  return tokenUrl('/preferences', createPreferenceToken(subscriberId, tokenRevision))
}
