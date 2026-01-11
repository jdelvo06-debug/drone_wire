
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName, lastName, source = 'website' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
  } finally {
    await prisma.$disconnect()
  }
}
