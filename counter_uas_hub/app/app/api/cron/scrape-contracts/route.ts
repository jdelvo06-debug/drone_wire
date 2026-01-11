import { NextRequest, NextResponse } from 'next/server';
import { scrapeContracts } from '@/lib/services/contract-scraper';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for Vercel

function validateCronSecret(req: NextRequest): boolean {
  // Allow requests from Vercel Cron
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  if (isVercelCron) return true;

  // Otherwise require the CRON_SECRET
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.warn('CRON_SECRET not configured');
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
    console.log('Starting contract scraping...');
    const startTime = Date.now();

    const result = await scrapeContracts();

    const duration = (Date.now() - startTime) / 1000;

    console.log(`Contract scraping completed in ${duration.toFixed(1)}s`);
    console.log(`Results: ${result.contractsAdded} added, ${result.contractsUpdated} updated, ${result.contractsSkipped} skipped`);

    return NextResponse.json({
      success: true,
      duration: `${duration.toFixed(1)}s`,
      contractsAdded: result.contractsAdded,
      contractsUpdated: result.contractsUpdated,
      contractsSkipped: result.contractsSkipped,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Contract scraping cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
