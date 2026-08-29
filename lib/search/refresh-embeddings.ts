import OpenAI from 'openai'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { isLocalDatabaseUrl } from '@/lib/search/search-projection'

interface PendingSearchEmbedding {
  entityType: string
  entityId: string
  searchableText: string
  sourceUpdatedAt: Date
}

interface SearchEmbeddingApproval {
  providerApproved: true
}

export async function refreshMissingSearchEmbeddings(
  limit = 50,
  approval?: SearchEmbeddingApproval,
): Promise<{ refreshed: number; deferred: number }> {
  if (approval?.providerApproved !== true) {
    throw new Error('Search embedding generation requires explicit provider approval')
  }
  if (!isLocalDatabaseUrl(process.env.DATABASE_URL)) {
    throw new Error('Search embedding generation is restricted to a local database')
  }
  if (!process.env.OPENAI_API_KEY) return { refreshed: 0, deferred: 0 }
  const [projection] = await prisma.$queryRaw<Array<{ available: boolean }>>`
    SELECT to_regclass('public.search_documents') IS NOT NULL AS "available"
  `
  if (!projection?.available) return { refreshed: 0, deferred: 0 }

  const documents = await prisma.$queryRaw<PendingSearchEmbedding[]>`
    SELECT "entityType", "entityId", "searchableText", "sourceUpdatedAt"
    FROM "search_documents"
    WHERE "embedding" IS NULL
    ORDER BY "sourceUpdatedAt" ASC
    LIMIT ${Math.min(Math.max(limit, 1), 50)}
  `
  if (documents.length === 0) return { refreshed: 0, deferred: 0 }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: documents.map((document) => document.searchableText.slice(0, 8000)),
    })
    const updated = await prisma.$transaction(documents.map((document, index) => {
      const vector = `[${response.data[index].embedding.join(',')}]`
      return prisma.$executeRaw`
        UPDATE "search_documents"
        SET "embedding" = ${vector}::vector, "updatedAt" = CURRENT_TIMESTAMP
        WHERE "entityType" = ${document.entityType}
          AND "entityId" = ${document.entityId}
          AND "embedding" IS NULL
          AND "searchableText" = ${document.searchableText}
          AND "sourceUpdatedAt" = ${document.sourceUpdatedAt}
      `
    }))
    const refreshed = updated.reduce((sum, count) => sum + Number(count), 0)
    return { refreshed, deferred: documents.length - refreshed }
  } catch {
    logger.warn('Search embedding refresh deferred after provider failure')
    return { refreshed: 0, deferred: documents.length }
  }
}
