import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyUnsubscribeToken } from '@/lib/security/unsubscribe-token'
import { enforcePublicRequest, parseBoundedJson, RequestBodyError } from '@/lib/security/request-guard'

const ALLOWED_CATEGORIES = new Set(['counter-uas', 'drone-warfare', 'contracts', 'policy', 'general'])

export async function POST(request: NextRequest) {
  const blocked = await enforcePublicRequest(request, { route: 'newsletter-preferences', limit: 10, windowSeconds: 60, checkBot: false })
  if (blocked) return blocked

  let body: Record<string, unknown>
  try {
    body = await parseBoundedJson<Record<string, unknown>>(request, 4 * 1024)
  } catch (error) {
    return NextResponse.json({ error: error instanceof RequestBodyError ? error.message : 'Invalid request' }, { status: error instanceof RequestBodyError ? error.status : 400 })
  }

  const verified = typeof body.token === 'string' ? verifyUnsubscribeToken(body.token, 'preferences') : null
  if (!verified) return NextResponse.json({ error: 'Invalid preference link' }, { status: 400 })

  const fullUnsubscribe = body.fullUnsubscribe === true
  const weeklyDigestEnabled = !fullUnsubscribe && body.weeklyDigestEnabled === true
  const breakingAlertsEnabled = !fullUnsubscribe && body.breakingAlertsEnabled === true
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((value): value is string => typeof value === 'string' && ALLOWED_CATEGORIES.has(value))
    : []

  const result = await prisma.newsletterSubscriber.updateMany({
    where: {
      id: verified.subscriberId,
      preferenceTokenRevision: verified.tokenRevision,
      status: 'active',
    },
    data: {
      status: fullUnsubscribe ? 'unsubscribed' : 'active',
      weeklyDigestEnabled,
      breakingAlertsEnabled,
      alertsEnabled: breakingAlertsEnabled,
      breakingAlertsConsentedAt: breakingAlertsEnabled ? new Date() : null,
      alertCategories: categories,
      ...(fullUnsubscribe ? { preferenceTokenRevision: { increment: 1 } } : {}),
    },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: 'This preference link is no longer active; resubscribe to make changes' }, { status: 409 })
  }

  return NextResponse.json({ success: true })
}
