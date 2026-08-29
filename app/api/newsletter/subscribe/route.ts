
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendWelcomeEmail } from '@/lib/services/email'
import {
  enforcePublicRequest,
  parseBoundedJson,
  RequestBodyError,
} from '@/lib/security/request-guard'

export const dynamic = "force-dynamic"

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export async function POST(req: NextRequest) {
  const blocked = await enforcePublicRequest(req, {
    route: 'newsletter-subscribe',
    limit: 5,
    windowSeconds: 60 * 60,
  })
  if (blocked) return blocked

  let body: Record<string, unknown>
  try {
    body = await parseBoundedJson<Record<string, unknown>>(req, 2 * 1024)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof RequestBodyError ? error.message : 'Invalid JSON body' },
      { status: error instanceof RequestBodyError ? error.status : 400 }
    )
  }

  try {
    const { email, firstName, lastName, source = 'website' } = body as {
      email?: string
      firstName?: string
      lastName?: string
      source?: string
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedFirstName = typeof firstName === 'string' ? firstName.trim() : ''
    const normalizedLastName = typeof lastName === 'string' ? lastName.trim() : ''
    const allowedSources = new Set(['website', 'home', 'footer', 'article'])
    const normalizedSource = typeof source === 'string' && allowedSources.has(source)
      ? source
      : 'website'
    if (
      normalizedEmail.length > 254 ||
      normalizedFirstName.length > 100 ||
      normalizedLastName.length > 100
    ) {
      return NextResponse.json({ error: 'Invalid subscriber fields' }, { status: 400 })
    }

    // Validate email format
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        )
      }

      const emailBlocked = await enforcePublicRequest(req, {
        route: 'newsletter-welcome',
        limit: 1,
        windowSeconds: 24 * 60 * 60,
        identifier: normalizedEmail,
        checkBot: false,
      })
      if (emailBlocked) return emailBlocked

      {
        // Reactivate unsubscribed subscriber
        const updatedSubscriber = await prisma.newsletterSubscriber.update({
          where: { email: normalizedEmail },
          data: {
            status: 'active',
            firstName: normalizedFirstName || existingSubscriber.firstName,
            lastName: normalizedLastName || existingSubscriber.lastName,
            subscriptionDate: new Date(),
            weeklyDigestEnabled: true,
            breakingAlertsEnabled: false,
            breakingAlertsConsentedAt: null,
            alertsEnabled: false,
            preferenceTokenRevision: { increment: 1 },
          }
        })

        const welcome = await sendWelcomeEmail(
          normalizedEmail,
          normalizedFirstName || undefined,
          updatedSubscriber.id,
          updatedSubscriber.preferenceTokenRevision,
        )
        if (!welcome.success) logger.error('Welcome email failed after subscriber reactivation')

        return NextResponse.json({
          message: 'Successfully resubscribed!',
          subscriber: {
            id: updatedSubscriber.id,
            email: updatedSubscriber.email,
          }
        })
      }
    }

    const emailBlocked = await enforcePublicRequest(req, {
      route: 'newsletter-welcome',
      limit: 1,
      windowSeconds: 24 * 60 * 60,
      identifier: normalizedEmail,
      checkBot: false,
    })
    if (emailBlocked) return emailBlocked

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        firstName: normalizedFirstName || null,
        lastName: normalizedLastName || null,
        source: normalizedSource,
        status: 'active',
        weeklyDigestEnabled: true,
        breakingAlertsEnabled: false,
        alertsEnabled: false,
      }
    })

    const welcome = await sendWelcomeEmail(
      normalizedEmail,
      normalizedFirstName || undefined,
      subscriber.id,
      subscriber.preferenceTokenRevision,
    )
    if (!welcome.success) logger.error('Welcome email failed after subscriber creation')

    return NextResponse.json({
      message: 'Successfully subscribed!',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
      }
    })

  } catch (error) {
    logger.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
