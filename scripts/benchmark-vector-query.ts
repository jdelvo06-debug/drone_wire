/**
 * Read-only pgvector plan benchmark.
 * Usage: VECTOR_BENCHMARK_ARTICLE_ID=<published-id> npm run benchmark:vector
 */
import 'dotenv/config'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const articleId = process.env.VECTOR_BENCHMARK_ARTICLE_ID
  if (!articleId) {
    throw new Error('VECTOR_BENCHMARK_ARTICLE_ID is required')
  }

  const plan = await prisma.$queryRaw<Array<{ 'QUERY PLAN': unknown }>>(Prisma.sql`
    EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
    SELECT a.id
    FROM articles a, articles src
    WHERE src.id = ${articleId}
      AND a.id <> ${articleId}
      AND a.status = 'published'
      AND a.embedding IS NOT NULL
      AND src.embedding IS NOT NULL
    ORDER BY a.embedding <=> src.embedding
    LIMIT 10
  `)

  console.log(JSON.stringify(plan[0]?.['QUERY PLAN'] ?? plan, null, 2))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
