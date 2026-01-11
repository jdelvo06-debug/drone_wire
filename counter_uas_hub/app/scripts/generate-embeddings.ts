import OpenAI from 'openai'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.ROUTELLM_API_KEY,
  baseURL: 'https://routellm.abacus.ai/v1',
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
  const articles = await prisma.article.findMany({
    where: {
      aiSummary: { not: null },
    },
    select: {
      id: true,
      title: true,
      aiSummary: true,
      keyPoints: true,
      embedding: true,
    },
  })

  // Filter to only those without embeddings
  const articlesWithoutEmbeddings = articles.filter(
    a => !a.embedding || a.embedding.length === 0
  )

  console.log(`Found ${articlesWithoutEmbeddings.length} articles without embeddings`)

  let processed = 0
  let failed = 0

  for (const article of articlesWithoutEmbeddings) {
    try {
      const embeddingText = `${article.title}. ${article.aiSummary || ''}. ${(article.keyPoints || []).join('. ')}`

      console.log(`Processing: ${article.title.slice(0, 50)}...`)

      const embedding = await generateEmbedding(embeddingText)

      if (embedding) {
        await prisma.article.update({
          where: { id: article.id },
          data: { embedding },
        })
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
