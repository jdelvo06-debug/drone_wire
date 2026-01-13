import { NextRequest, NextResponse } from 'next/server';
import {
  reprocessArticlesForImages,
  getImageStats,
} from '@/lib/services/image-reprocessor';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

function validateAdminSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const adminSecret = process.env.CRON_SECRET;

  if (!adminSecret) {
    return false;
  }

  return authHeader === `Bearer ${adminSecret}`;
}

// GET - Get current image statistics
export async function GET(req: NextRequest) {
  if (!validateAdminSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getImageStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting image stats:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Trigger image reprocessing
export async function POST(req: NextRequest) {
  if (!validateAdminSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const limit = Math.min(body.limit || 50, 100); // Max 100 per request
    const onlyMissing = body.onlyMissing !== false;

    console.log(
      `Starting image reprocessing (limit: ${limit}, onlyMissing: ${onlyMissing})`
    );
    const result = await reprocessArticlesForImages(limit, onlyMissing);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Image reprocessing error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
