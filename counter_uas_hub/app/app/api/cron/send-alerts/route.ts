import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { processAlerts } from '@/lib/services/alerts'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60 seconds for sending alerts

function validateCronSecret(req: NextRequest): boolean {
  // Allow requests from Vercel Cron
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'
  if (isVercelCron) return true

  // Otherwise require the CRON_SECRET
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    logger.warn('CRON_SECRET not configured')
    return false
  }

  return authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  // Validate authorization
  if (!validateCronSecret(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  logger.info('Starting alert processing...')

  try {
    const stats = await processAlerts()

    logger.info('Alert processing complete:', stats)

    return NextResponse.json({
      success: true,
      stats,
      message: stats.emailsSent > 0
        ? `Sent ${stats.emailsSent} alerts for ${stats.articlesFound} articles`
        : 'No alerts to send',
    })
  } catch (error) {
    logger.error('Alert processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
