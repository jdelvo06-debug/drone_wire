import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendContactNotification } from '@/lib/services/email'

export const dynamic = "force-dynamic"

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

    // Send email notification to admin (fire and forget)
    sendContactNotification({
      name,
      email,
      company,
      subject,
      message,
      type,
    }).catch(console.error)

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
    console.error('Contact submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
