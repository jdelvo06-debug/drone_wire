import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { scrapeRssFeeds } from '@/lib/services/rss-scraper';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Vercel

function validateCronSecret(req: NextRequest): boolean {
  // Allow requests from Vercel Cron (they include this header)
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  if (isVercelCron) return true;

  // Otherwise require the CRON_SECRET
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
    logger.info('Starting RSS feed scraping...');
    const startTime = Date.now();

    const result = await scrapeRssFeeds();

    const duration = (Date.now() - startTime) / 1000;

    logger.info(`Scraping completed in ${duration.toFixed(1)}s`);
    logger.info(`Results: ${result.articlesAdded} added, ${result.articlesSkipped} skipped, ${result.errors.length} errors`);

    return NextResponse.json({
      success: true,
      duration: `${duration.toFixed(1)}s`,
      feedsProcessed: result.feedsProcessed,
      articlesAdded: result.articlesAdded,
      articlesSkipped: result.articlesSkipped,
      errors: result.errors,
    });
  } catch (error) {
    logger.error('Scraping cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
