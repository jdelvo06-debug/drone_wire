
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/services/email'

export const dynamic = "force-dynamic"

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
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

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        )
      } else {
        // Reactivate unsubscribed subscriber
        const updatedSubscriber = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            status: 'active',
            firstName: firstName || existingSubscriber.firstName,
            lastName: lastName || existingSubscriber.lastName,
            subscriptionDate: new Date(),
          }
        })

        // Send welcome email (fire and forget)
        sendWelcomeEmail(email, firstName).catch(console.error)

        return NextResponse.json({
          message: 'Successfully resubscribed!',
          subscriber: {
            id: updatedSubscriber.id,
            email: updatedSubscriber.email,
          }
        })
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        source,
        status: 'active',
      }
    })

    // Send welcome email (fire and forget)
    sendWelcomeEmail(email, firstName).catch(console.error)

    return NextResponse.json({
      message: 'Successfully subscribed!',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
