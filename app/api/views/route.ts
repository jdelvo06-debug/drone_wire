import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import {
  checkRateLimit,
  enforcePublicRequest,
  getClientIp,
  isVercelPreview,
  parseBoundedJson,
  RequestBodyError,
} from '@/lib/security/request-guard'

const ENTITY_TYPES = ['article', 'system', 'explainer'] as const
type EntityType = (typeof ENTITY_TYPES)[number]

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (isVercelPreview()) {
    return NextResponse.json({ success: true, tracked: false })
  }

  const blocked = await enforcePublicRequest(request, {
    route: 'view-events',
    limit: 60,
    windowSeconds: 60,
  })
  if (blocked) return blocked

  let body: { entityType?: unknown; entityId?: unknown }
  try {
    body = await parseBoundedJson(request, 1024)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof RequestBodyError ? error.message : 'Invalid request' },
      { status: error instanceof RequestBodyError ? error.status : 400 },
    )
  }

  if (
    typeof body.entityType !== 'string' ||
    !ENTITY_TYPES.includes(body.entityType as EntityType) ||
    typeof body.entityId !== 'string' ||
    !body.entityId ||
    body.entityId.length > 128
  ) {
    return NextResponse.json({ error: 'Invalid view event' }, { status: 400 })
  }

  const entityType = body.entityType as EntityType
  const entityId = body.entityId

  try {
    const daily = await checkRateLimit({
      route: `view:${entityType}:${entityId}`,
      identifier: getClientIp(request.headers),
      limit: 1,
      windowSeconds: 24 * 60 * 60,
    })
    if (!daily.allowed) {
      return NextResponse.json({ success: true, tracked: false })
    }

    const update = {
      where: { id: entityId },
      data: { views: { increment: 1 as const } },
    }
    if (entityType === 'article') await prisma.article.update(update)
    if (entityType === 'system') await prisma.system.update(update)
    if (entityType === 'explainer') await prisma.explainer.update(update)

    return NextResponse.json({ success: true, tracked: true })
  } catch (error) {
    logger.error('View tracking failed:', error)
    return NextResponse.json({ error: 'Unable to track view' }, { status: 500 })
  }
}
