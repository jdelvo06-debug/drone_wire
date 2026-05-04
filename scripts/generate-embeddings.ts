import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    })
    return response.data[0]?.embedding || null
  } catch (error) {
    console.error('Embedding generation error:', error)
    return null
  }
}

async function main() {
  console.log('Generating embeddings for articles without embeddings...')

  // Get articles that have AI summaries but no embeddings
  const articles = await prisma.$queryRaw<
    { id: string; title: string; aiSummary: string | null; keyPoints: string[] }[]
  >`SELECT id, title, "aiSummary", "keyPoints" FROM articles WHERE "aiSummary" IS NOT NULL AND embedding IS NULL`

  const articlesWithoutEmbeddings = articles

  console.log(`Found ${articlesWithoutEmbeddings.length} articles without embeddings`)

  let processed = 0
  let failed = 0

  for (const article of articlesWithoutEmbeddings) {
    try {
      const embeddingText = `${article.title}. ${article.aiSummary || ''}. ${(article.keyPoints || []).join('. ')}`

      console.log(`Processing: ${article.title.slice(0, 50)}...`)

      const embedding = await generateEmbedding(embeddingText)

      if (embedding) {
        const vectorStr = `[${embedding.join(',')}]`
        await prisma.$executeRaw`UPDATE articles SET embedding = ${vectorStr}::vector WHERE id = ${article.id}`
        processed++
        console.log(`  ✓ Generated embedding (${embedding.length} dimensions)`)
      } else {
        failed++
        console.log(`  ✗ Failed to generate embedding`)
      }

      // Delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      failed++
      console.error(`  ✗ Error processing ${article.id}:`, error)
    }
  }

  console.log(`\nCompleted!`)
  console.log(`  Processed: ${processed}`)
  console.log(`  Failed: ${failed}`)

  await prisma.$disconnect()
}

main().catch(console.error)
