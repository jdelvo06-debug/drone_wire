import OpenAI from 'openai'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface SemanticSearchResult {
  id: string
  title: string
  excerpt: string | null
  aiSummary: string | null
  sourceName: string
  publishedAt: Date
  category: string
  imageUrl: string | null
  sourceUrl: string | null
  similarity: number
}

async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query.slice(0, 8000),
  })
  return response.data[0].embedding
}

export async function semanticSearch(
  query: string,
  limit = 10,
  categoryFilter?: string
): Promise<SemanticSearchResult[]> {
  try {
    const embedding = await generateQueryEmbedding(query)
    const vectorStr = `[${embedding.join(',')}]`

    const categoryClause = categoryFilter
      ? Prisma.sql`AND category = ${categoryFilter}`
      : Prisma.empty

    const results = await prisma.$queryRaw<SemanticSearchResult[]>`
      SELECT
        id, title, excerpt, "aiSummary", "sourceName", "publishedAt",
        category, "imageUrl", "sourceUrl",
        1 - (embedding <=> ${vectorStr}::vector) as similarity
      FROM articles
      WHERE status = 'published'
        AND embedding IS NOT NULL
        ${categoryClause}
      ORDER BY embedding <=> ${vectorStr}::vector
      LIMIT ${limit}
    `

    return results
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (
      message.includes('operator does not exist') ||
      message.includes('type "vector" does not exist')
    ) {
      console.warn(
        'pgvector not enabled — run docs/enable-pgvector.sql in Supabase SQL Editor'
      )
      return []
    }
    throw error
  }
}

export async function getRelatedArticles(
  articleId: string,
  limit = 5
): Promise<SemanticSearchResult[]> {
  try {
    const results = await prisma.$queryRaw<SemanticSearchResult[]>`
      SELECT
        a.id, a.title, a.excerpt, a."aiSummary", a."sourceName", a."publishedAt",
        a.category, a."imageUrl", a."sourceUrl",
        1 - (a.embedding <=> src.embedding) as similarity
      FROM articles a, articles src
      WHERE src.id = ${articleId}
        AND a.id != ${articleId}
        AND a.status = 'published'
        AND a.embedding IS NOT NULL
        AND src.embedding IS NOT NULL
      ORDER BY a.embedding <=> src.embedding
      LIMIT ${limit}
    `

    return results
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (
      message.includes('operator does not exist') ||
      message.includes('type "vector" does not exist')
    ) {
      console.warn(
        'pgvector not enabled — related articles falling back to default behavior'
      )
      return []
    }
    throw error
  }
}
