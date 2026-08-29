import { NextRequest, NextResponse } from 'next/server'
import { federatedSearch, isSearchEntityType } from '@/lib/services/federated-search'
import type { SearchEntityType } from '@/lib/search/federated-search'
import { enforcePublicRequest, isVercelPreview } from '@/lib/security/request-guard'

export async function GET(request: NextRequest) {
  if (!isVercelPreview()) {
    const blocked = await enforcePublicRequest(request, {
      route: 'semantic-search',
      limit: 20,
      windowSeconds: 60,
    })
    if (blocked) return blocked
  }

  const { searchParams } = request.nextUrl
  const query = (searchParams.get('q') || '').trim()
  const requestedTypes = (searchParams.get('types') || '')
    .split(',')
    .filter(isSearchEntityType) as SearchEntityType[]
  const mode = searchParams.get('mode') === 'hybrid' ? 'hybrid' : 'lexical'
  const parsedLimit = Number.parseInt(searchParams.get('limit') || '', 10)
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 10

  if (query.length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    )
  }

  if (query.length > 500) {
    return NextResponse.json(
      { error: 'Query must be at most 500 characters' },
      { status: 400 }
    )
  }

  try {
    const results = await federatedSearch(query, requestedTypes, limit, mode)

    return NextResponse.json({
      results,
      query,
      count: results.length,
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
