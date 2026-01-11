
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, company, subject, type = 'general', message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        subject,
        type,
        message,
        status: 'new',
      }
    })

    // In a real application, you might want to:
    // 1. Send an email notification to admins
    // 2. Send a confirmation email to the user
    // 3. Add to a CRM system
    // 4. Trigger other workflows

    return NextResponse.json({
      message: 'Message sent successfully!',
      submissionId: submission.id,
    })

  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(req: NextRequest) {
  try {
    // This endpoint could be used by admins to fetch contact submissions
    // For now, we'll return basic stats
    const stats = await prisma.contactSubmission.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    })

    const totalCount = await prisma.contactSubmission.count()

    return NextResponse.json({
      totalSubmissions: totalCount,
      byStatus: stats,
    })

  } catch (error) {
    console.error('Contact submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
