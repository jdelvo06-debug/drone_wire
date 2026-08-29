import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendContactNotification } from '@/lib/services/email'
import { requireAdminBearer } from '@/lib/auth'
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
    route: 'contact',
    limit: 5,
    windowSeconds: 60 * 60,
  })
  if (blocked) return blocked

  let body: Record<string, unknown>
  try {
    body = await parseBoundedJson<Record<string, unknown>>(req, 8 * 1024)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof RequestBodyError ? error.message : 'Invalid JSON body' },
      { status: error instanceof RequestBodyError ? error.status : 400 }
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

    // Validate required fields and types before using or storing them.
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const normalized = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: typeof company === 'string' ? company.trim() : '',
      subject: subject.trim(),
      type: typeof type === 'string' ? type : 'general',
      message: message.trim(),
    }
    const allowedTypes = new Set(['general', 'press', 'partnership', 'tip'])
    if (
      !normalized.name || normalized.name.length > 100 ||
      !normalized.email || normalized.email.length > 254 ||
      normalized.company.length > 200 ||
      !normalized.subject || normalized.subject.length > 200 ||
      !normalized.message || normalized.message.length > 5000 ||
      !allowedTypes.has(normalized.type)
    ) {
      return NextResponse.json({ error: 'Invalid contact form fields' }, { status: 400 })
    }

    // Validate email format
    if (!EMAIL_REGEX.test(normalized.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const emailBlocked = await enforcePublicRequest(req, {
      route: 'contact-email',
      limit: 1,
      windowSeconds: 10 * 60,
      identifierSuffix: normalized.email,
      checkBot: false,
    })
    if (emailBlocked) return emailBlocked

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        name: normalized.name,
        email: normalized.email,
        company: normalized.company || null,
        subject: normalized.subject,
        type: normalized.type,
        message: normalized.message,
        status: 'new',
      }
    })

    // Await the attempt so failures are observable while preserving the submission.
    const notification = await sendContactNotification({
      name: normalized.name,
      email: normalized.email,
      company: normalized.company || undefined,
      subject: normalized.subject,
      message: normalized.message,
      type: normalized.type,
    })
    if (!notification.success) {
      logger.error('Contact notification failed after submission was stored')
    }

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

export async function GET(req: NextRequest) {
  // Protect admin-ish stats endpoint with ADMIN_SECRET bearer token
  const authError = await requireAdminBearer(req)
  if (authError) return authError

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
