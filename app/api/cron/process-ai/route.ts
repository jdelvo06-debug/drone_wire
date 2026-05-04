import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { processPendingArticles } from '@/lib/services/ai-processor';

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

    // Read optional limit from query params, default 10 for scheduled cron, max 50
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '25'), 50);

    const result = await processPendingArticles(limit);

    const duration = (Date.now() - startTime) / 1000;

    logger.info(`AI processing completed in ${duration.toFixed(1)}s`);
    logger.info(`Results: ${result.processed} processed, ${result.failed} failed`);

    return NextResponse.json({
      success: true,
      duration: `${duration.toFixed(1)}s`,
      processed: result.processed,
      failed: result.failed,
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
