import { NextResponse } from 'next/server';
import { checkAIModelAvailability } from '@/lib/services/ai-processor';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  const result = await checkAIModelAvailability();

  const status = result.status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(
    {
      status: result.status,
      primaryModel: result.primaryModel,
      fallbackModel: result.fallbackModel,
      primaryAvailable: result.primaryAvailable,
      fallbackAvailable: result.fallbackAvailable,
      message: result.message,
    },
    {
      status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}