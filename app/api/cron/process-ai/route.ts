import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { processPendingArticles } from '@/lib/services/ai-processor';
import { cleanupExpiredRequestLimits } from '@/lib/security/request-guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Vercel

function validateCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    logger.warn('CRON_SECRET not configured');
    return false;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(req: NextRequest) {
  // Validate authorization
  if (!validateCronSecret(req)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    logger.info('Starting AI processing...');
    const startTime = Date.now();

    // Use a small scheduled batch by default; explicit manual runs may request up to 50.
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '5'), 50);

    const result = await processPendingArticles(limit);
    const expiredRateLimitsRemoved = await cleanupExpiredRequestLimits().catch((error) => {
      logger.warn('Rate-limit cleanup failed:', error instanceof Error ? error.message : 'unknown error');
      return 0;
    });

    const duration = (Date.now() - startTime) / 1000;

    logger.info(`AI processing completed in ${duration.toFixed(1)}s`);
    logger.info(`Results: ${result.processed} processed, ${result.failed} failed`);

    return NextResponse.json({
      success: true,
      duration: `${duration.toFixed(1)}s`,
      processed: result.processed,
      failed: result.failed,
      expiredRateLimitsRemoved,
      errors: result.errors,
    });
  } catch (error) {
    logger.error('AI processing cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
