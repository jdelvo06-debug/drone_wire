import { NextRequest, NextResponse } from 'next/server'
import { approveWeeklyDigestAfterSyntheticTest, generateWeeklyDigest, sendApprovedWeeklyDigest } from '@/lib/services/weekly-digest'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const issue = await generateWeeklyDigest()
    if (request.nextUrl.searchParams.get('mode') !== 'send') {
      return NextResponse.json({ success: true, issueId: issue.id, weekKey: issue.weekKey, status: issue.status, previewGenerated: true })
    }
    if (issue.status === 'completed') {
      return NextResponse.json({ success: true, issueId: issue.id, weekKey: issue.weekKey, status: issue.status, idempotentReplay: true })
    }
    if (issue.status === 'testing') {
      return NextResponse.json({ success: true, issueId: issue.id, weekKey: issue.weekKey, status: issue.status, inProgress: true }, { status: 202 })
    }
    if (issue.status === 'preview') await approveWeeklyDigestAfterSyntheticTest(issue.id)
    const delivery = await sendApprovedWeeklyDigest(issue.id)
    return NextResponse.json({ success: true, issueId: issue.id, weekKey: issue.weekKey, delivery })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Digest processing failed' }, { status: 500 })
  }
}
