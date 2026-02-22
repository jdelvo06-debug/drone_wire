import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { scrapeRssFeeds } from '@/lib/services/rss-scraper';
import { searchWithExa } from '@/lib/services/exa-searcher';

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

    // Exa AI search (only if API key is configured)
    let exaResult = null;
    if (process.env.EXA_API_KEY) {
      logger.info('Starting Exa AI search...');
      exaResult = await searchWithExa();
    }

    const duration = (Date.now() - startTime) / 1000;

    logger.info(`Scraping completed in ${duration.toFixed(1)}s`);
    logger.info(`RSS: ${result.articlesAdded} added, ${result.articlesSkipped} skipped, ${result.errors.length} errors`);
    if (exaResult) {
      logger.info(`Exa: ${exaResult.articlesAdded} added, ${exaResult.articlesSkipped} skipped, ${exaResult.errors.length} errors`);
    }

    return NextResponse.json({
      success: true,
      duration: `${duration.toFixed(1)}s`,
      rss: {
        feedsProcessed: result.feedsProcessed,
        articlesAdded: result.articlesAdded,
        articlesSkipped: result.articlesSkipped,
        errors: result.errors,
      },
      exa: exaResult ? {
        queriesRun: exaResult.queriesRun,
        articlesAdded: exaResult.articlesAdded,
        articlesSkipped: exaResult.articlesSkipped,
        errors: exaResult.errors,
      } : null,
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
