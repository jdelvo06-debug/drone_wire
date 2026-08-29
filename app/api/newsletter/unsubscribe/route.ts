import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { parseBoundedJson, RequestBodyError } from '@/lib/security/request-guard'
import { verifyUnsubscribeToken } from '@/lib/security/unsubscribe-token'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: { token?: unknown }
  try {
    body = await parseBoundedJson<{ token?: unknown }>(request, 2 * 1024)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof RequestBodyError ? error.message : 'Invalid request' },
      { status: error instanceof RequestBodyError ? error.status : 400 },
    )
  }

  if (typeof body.token !== 'string' || body.token.length > 1024) {
    return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 400 })
  }

  const verified = verifyUnsubscribeToken(body.token, 'unsubscribe')
  if (!verified) {
    return NextResponse.json({ error: 'Invalid unsubscribe link' }, { status: 400 })
  }

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: {
        id: verified.subscriberId,
        preferenceTokenRevision: verified.tokenRevision,
        status: { not: 'unsubscribed' },
      },
      data: {
        status: 'unsubscribed',
        alertsEnabled: false,
        weeklyDigestEnabled: false,
        breakingAlertsEnabled: false,
        breakingAlertsConsentedAt: null,
        preferenceTokenRevision: { increment: 1 },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unsubscribe update failed:', error)
    return NextResponse.json({ error: 'Unable to update preferences' }, { status: 500 })
  }
}
