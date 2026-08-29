import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '../lib/db'
import {
  normalizeArticleClassification,
  summarizeArticleCategoryOrigins,
} from '../lib/article-category'
import { calculateReadTime } from '../lib/articles/quality'
import { eventFingerprint, scoreArticleRelevance, selectClusterRepresentative } from '../lib/articles/clustering'

const apply = process.argv.includes('--apply')
const exportArg = process.argv.find((arg) => arg.startsWith('--export='))?.slice('--export='.length)

function sourceQuality(sourceUrl: string | null, sourceName: string) {
  try {
    if (sourceUrl && /\.(gov|mil)$/i.test(new URL(sourceUrl).hostname)) return 3
  } catch {
    // Invalid legacy URLs remain lowest-quality until separately repaired.
  }
  if (/department|ministry|army|navy|air force|official/i.test(sourceName)) return 3
  if (/reuters|associated press|defense news|breaking defense|janes/i.test(sourceName)) return 2
  return 1
}

async function main() {
  const [schema] = await prisma.$queryRaw<Array<{ ready: boolean }>>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'articles' AND column_name = 'topics'
    ) AS "ready"
  `
  if (!schema?.ready) {
    const rows = await prisma.$queryRaw<Array<{ id: string; title: string; category: string; sourceName: string; sourceUrl: string | null; publishedAt: Date; content: string | null; excerpt: string | null }>>`
      SELECT "id", "title", "category", "sourceName", "sourceUrl", "publishedAt", "content", "excerpt" FROM "articles" ORDER BY "publishedAt" ASC
    `
    const proposed = rows.map((article) => ({
      classification: normalizeArticleClassification(article.category),
      relevanceScore: scoreArticleRelevance([article.title, article.excerpt, article.content].filter(Boolean).join(' ')),
      fingerprint: eventFingerprint(article.title),
    }))
    const originSummary = summarizeArticleCategoryOrigins(rows.map((article) => ({
      category: article.category,
      count: 1,
    })))
    process.stdout.write(`${JSON.stringify({ apply, schemaReady: false, articles: rows.length, clusters: new Set(proposed.map((item) => item.fingerprint)).size, malformedCategories: proposed.filter((item) => item.classification.classificationLabel === 'unverified').length, categoryOrigins: originSummary, lowRelevance: proposed.filter((item) => item.relevanceScore < 0.25).length, nextStep: 'Apply the approved foundation migration before article remediation' }, null, 2)}\n`)
    if (apply) throw new Error('Foundation migration is required before --apply')
    return
  }
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'asc' } })
  const groups = new Map<string, typeof articles>()
  for (const article of articles) {
    const fingerprint = eventFingerprint(article.title)
    groups.set(fingerprint, [...(groups.get(fingerprint) || []), article])
  }
  const changes = Array.from(groups.entries()).flatMap(([fingerprint, candidates]) => {
    const representative = selectClusterRepresentative(candidates.map((article) => ({
      article,
      id: article.id,
      contentCompleteness: [article.content, article.excerpt, article.aiSummary, article.sourceUrl, article.imageUrl].filter(Boolean).length,
      sourceQuality: sourceQuality(article.sourceUrl, article.sourceName),
      publishedAt: article.publishedAt,
    })))
    return candidates.map((article) => {
      const classification = normalizeArticleClassification(article.category)
      const relevanceScore = scoreArticleRelevance([article.title, article.excerpt, article.content].filter(Boolean).join(' '))
      return {
        id: article.id,
        fingerprint,
        category: classification.category,
        topics: Array.from(new Set([...article.topics, ...classification.topics])),
        classificationLabel: classification.classificationLabel,
        categoryOrigin: classification.categoryOrigin,
        readTime: calculateReadTime(article.content || article.excerpt || article.title),
        relevanceScore,
        exclusionReason: relevanceScore < 0.25 ? 'low-relevance' : null,
        isClusterRepresentative: representative?.id === article.id,
      }
    })
  })

  const originSummary = summarizeArticleCategoryOrigins(articles.map((article) => ({
    category: article.category,
    count: 1,
  })))
  process.stdout.write(`${JSON.stringify({ apply, articles: articles.length, clusters: groups.size, excluded: changes.filter((change) => change.exclusionReason).length, categoryOrigins: originSummary }, null, 2)}\n`)
  if (!apply) return
  if (!exportArg || !path.isAbsolute(exportArg)) throw new Error('--apply requires an absolute --export path')
  await fs.writeFile(exportArg, `${JSON.stringify({ exportedAt: new Date().toISOString(), articles }, null, 2)}\n`, { flag: 'wx' })

  for (const [fingerprint, candidates] of groups) {
    const cluster = await prisma.eventCluster.upsert({ where: { fingerprint }, create: { fingerprint }, update: {} })
    for (const change of changes.filter((item) => item.fingerprint === fingerprint)) {
      await prisma.article.update({
        where: { id: change.id },
        data: {
          category: change.category,
          topics: change.topics,
          classificationLabel: change.classificationLabel,
          categoryOrigin: change.categoryOrigin,
          readTime: change.readTime,
          relevanceScore: change.relevanceScore,
          exclusionReason: change.exclusionReason,
          isClusterRepresentative: change.isClusterRepresentative,
          eventClusterId: cluster.id,
        },
      })
    }
    const representative = candidates.find((article) => changes.find((item) => item.id === article.id)?.isClusterRepresentative)
    if (representative) await prisma.eventCluster.update({ where: { id: cluster.id }, data: { representativeArticleId: representative.id } })
  }
}

main().finally(() => prisma.$disconnect())
