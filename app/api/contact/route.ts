import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendContactNotification } from '@/lib/services/email'

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
    const { name, email, company, subject, type = 'general', message } = body as {
      name?: string
      email?: string
      company?: string
      subject?: string
      type?: string
      message?: string
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, and message are required' },
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

    // Send email notification to admin (fire and forget)
    sendContactNotification({
      name,
      email,
      company,
      subject,
      message,
      type,
    }).catch(logger.error)

    return NextResponse.json({
      message: 'Message sent successfully!',
      submissionId: submission.id,
    })

  } catch (error) {
    logger.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // This endpoint could be used by admins to fetch contact submissions
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
    logger.error('Contact submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
