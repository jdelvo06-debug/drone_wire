import { NextRequest, NextResponse } from 'next/server'
import { semanticSearch } from '@/lib/services/semantic-search'

// NOTE: Each request calls OpenAI embeddings API — consider rate limiting in production
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')
  const category = searchParams.get('category') || undefined
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 20)

  if (!query || query.length < 3) {
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
    const results = await semanticSearch(query, limit, category)

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
