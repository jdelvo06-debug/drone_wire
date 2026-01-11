import { NextRequest, NextResponse } from 'next/server'
import { processAlerts } from '@/lib/services/alerts'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60 seconds for sending alerts

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  console.log('Starting alert processing...')

  try {
    const stats = await processAlerts()

    console.log('Alert processing complete:', stats)

    return NextResponse.json({
      success: true,
      stats,
      message: stats.emailsSent > 0
        ? `Sent ${stats.emailsSent} alerts for ${stats.articlesFound} articles`
        : 'No alerts to send',
    })
  } catch (error) {
    console.error('Alert processing error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
