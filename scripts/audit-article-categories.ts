import 'dotenv/config'
import { prisma } from '../lib/db'
import {
  isArticleCategory,
  normalizeArticleClassification,
  summarizeArticleCategoryOrigins,
} from '../lib/article-category'

async function main() {
  const groups = await prisma.article.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  const invalid = groups.filter((group) => !isArticleCategory(group.category))
  const validCount = groups
    .filter((group) => isArticleCategory(group.category))
    .reduce((sum, group) => sum + group._count.id, 0)
  const invalidCount = invalid.reduce((sum, group) => sum + group._count.id, 0)
  const originSummary = summarizeArticleCategoryOrigins(groups.map((group) => ({
    category: group.category,
    count: group._count.id,
  })))

  console.log(JSON.stringify({
    mode: 'read-only',
    validCount,
    invalidCount,
    originSummary,
    invalidCategories: invalid.map((group) => ({
      category: group.category,
      count: group._count.id,
      classification: normalizeArticleClassification(group.category),
    })),
  }, null, 2))
}

main()
  .catch((error) => {
    console.error('Category audit failed:', error instanceof Error ? error.message : 'unknown error')
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
