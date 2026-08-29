import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import { prisma } from '../lib/db'
import { normalizeArticleClassification } from '../lib/article-category'
import {
  buildPrompt,
  parseAndValidateResult,
  SYSTEM_PROMPT,
  type AIProcessingResult,
} from '../lib/services/ai-processor'
import { extractContentFromUrl } from '../lib/services/content-extractor'

const PUBLISHED_SAMPLE_SIZE = 25
const PENDING_SAMPLE_SIZE = 3
// Pilot comparison models are env-overridable so new models can be evaluated
// without editing constants. Defaults match current production routing.
const PRODUCTION_PRIMARY = process.env.PILOT_PRIMARY_MODEL || 'deepseek-v4-flash'
const PRODUCTION_FALLBACK = process.env.PILOT_FALLBACK_MODEL || 'glm-5.2'
const OUTPUT_PREFIX = '/private/tmp/'
const GENERIC_OPENING = /^(?:this|the) (?:article|report|story|development)\b|^in (?:a|an) (?:significant|major|notable|recent) (?:development|move|step)\b|^according to (?:the )?(?:article|report)\b/i
const STOP_WORDS = new Set([
  'about', 'after', 'again', 'against', 'also', 'among', 'and', 'are', 'because', 'been',
  'before', 'being', 'between', 'both', 'but', 'can', 'could', 'defense', 'drone', 'drones',
  'during', 'each', 'for', 'from', 'has', 'have', 'into', 'its', 'more', 'most', 'new', 'not',
  'over', 'said', 'such', 'system', 'systems', 'than', 'that', 'the', 'their', 'these', 'they',
  'this', 'through', 'under', 'using', 'was', 'were', 'which', 'will', 'with', 'would',
])

interface ArticleMetadata {
  id: string
  category: string
  sourceName: string
  publishedAt: Date
}

interface ArticleRecord extends ArticleMetadata {
  title: string
  status: string
  sourceUrl: string | null
  excerpt: string | null
  content: string | null
  imageUrl: string | null
  aiSummary: string | null
}

interface PreparedSample {
  sampleNumber: number
  cohort: 'published' | 'pending'
  articleId: string
  title: string
  sourceName: string
  sourceDomain: string | null
  publishedAt: string
  storedCategory: string
  expectedCategory: string
  currentSummaryGeneric: boolean | null
  sourceTextHash: string
  sourceTextOrigin: 'fresh-extraction' | 'stored-content' | 'excerpt' | 'title-only'
  extraction: {
    quality: 'clean' | 'missing-content' | 'debris-contaminated' | 'manual-review-required'
    qualityReasons: string[]
    extractionMethod: string
    cleanArticleText: boolean
    navigationCookieFooterDebris: boolean
    debrisMatches: string[]
    tooLittleContent: boolean
    missingContent: boolean
    manualReviewRequired: boolean
    extractedWordCount: number
    usableImage: boolean
    brokenOrMisleadingImage: boolean
    imageQuality: 'usable' | 'missing' | 'rejected' | 'manual-review-required'
    imageReasons: string[]
    imageAssessment: string
  }
  prompt: string
  sourceText: string
}

interface ModelAttempt {
  model: string
  available: boolean
  validStructuredOutput: boolean
  attempts: number
  retries: number
  latencyMs: number
  failureKind: string | null
  failureStatus: number | null
  output: AIProcessingResult | null
}

function deterministicOrder(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function selectPublishedSample(rows: ArticleMetadata[]): string[] {
  const ordered = [...rows].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
  const selected: ArticleMetadata[] = []
  const sourceCounts = new Map<string, number>()
  const bucketCount = 5

  for (let bucket = 0; bucket < bucketCount; bucket++) {
    const start = Math.floor((ordered.length * bucket) / bucketCount)
    const end = Math.floor((ordered.length * (bucket + 1)) / bucketCount)
    const candidates = ordered.slice(start, end).sort((a, b) => deterministicOrder(a.id).localeCompare(deterministicOrder(b.id)))
    const bucketCategories = new Set<string>()
    let selectedInBucket = 0

    while (selectedInBucket < 5) {
      const remaining = candidates.filter((candidate) => !selected.some((item) => item.id === candidate.id))
      if (remaining.length === 0) break
      remaining.sort((a, b) => {
        const aCategory = normalizeArticleClassification(a.category).category
        const bCategory = normalizeArticleClassification(b.category).category
        const aScore = (sourceCounts.has(a.sourceName) ? 0 : 8) + (bucketCategories.has(aCategory) ? 0 : 4) - (sourceCounts.get(a.sourceName) || 0)
        const bScore = (sourceCounts.has(b.sourceName) ? 0 : 8) + (bucketCategories.has(bCategory) ? 0 : 4) - (sourceCounts.get(b.sourceName) || 0)
        return bScore - aScore || deterministicOrder(a.id).localeCompare(deterministicOrder(b.id))
      })
      const choice = remaining[0]
      selected.push(choice)
      selectedInBucket++
      sourceCounts.set(choice.sourceName, (sourceCounts.get(choice.sourceName) || 0) + 1)
      bucketCategories.add(normalizeArticleClassification(choice.category).category)
    }
  }

  return selected.slice(0, PUBLISHED_SAMPLE_SIZE).map((row) => row.id)
}

function selectPendingSample(rows: ArticleMetadata[], excludedSources: Set<string>): string[] {
  const ordered = [...rows].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())
  const selected: ArticleMetadata[] = []
  for (const row of ordered) {
    if (selected.some((item) => item.sourceName === row.sourceName)) continue
    selected.push(row)
    if (selected.length === PENDING_SAMPLE_SIZE) break
  }
  if (selected.length < PENDING_SAMPLE_SIZE) {
    for (const row of ordered) {
      if (selected.some((item) => item.id === row.id)) continue
      selected.push(row)
      if (selected.length === PENDING_SAMPLE_SIZE) break
    }
  }
  return selected
    .sort((a, b) => Number(excludedSources.has(a.sourceName)) - Number(excludedSources.has(b.sourceName)))
    .slice(0, PENDING_SAMPLE_SIZE)
    .map((row) => row.id)
}

async function mapLimit<T, R>(items: T[], limit: number, task: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await task(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

function safeDomain(value: string | null): string | null {
  try {
    return value ? new URL(value).hostname.replace(/^www\./, '') : null
  } catch {
    return null
  }
}

function sanitizeText(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\b(?:sk|pk|api|token)[-_][A-Za-z0-9_-]{16,}\b/gi, '[redacted-token]')
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [redacted-token]')
}

async function prepareSample(article: ArticleRecord, sampleNumber: number): Promise<PreparedSample> {
  const extracted = article.sourceUrl ? await extractContentFromUrl(article.sourceUrl) : null
  const extractedContent = extracted?.content.trim() || ''
  const quality = extracted?.quality || 'missing-content'
  const qualityReasons = extracted?.qualityReasons || ['extraction-unavailable']
  const debrisMatches = qualityReasons.filter((reason) => reason.startsWith('residual-'))
  const tooLittleContent = qualityReasons.includes('thin-content')
  const missingContent = quality === 'missing-content'
  const cleanArticleText = quality === 'clean'

  const sourceTextOrigin = cleanArticleText
    ? 'fresh-extraction'
    : article.content?.trim()
      ? 'stored-content'
      : article.excerpt?.trim()
        ? 'excerpt'
        : 'title-only'
  const sourceText = cleanArticleText
    ? extractedContent
    : article.content?.trim() || article.excerpt?.trim() || article.title
  // Keep clean-cohort prompts aligned with production: title plus only the
  // freshly extracted source. Flagged rows may still use stored content or an
  // excerpt for non-publishable comparison, as recorded by sourceTextOrigin.
  const textForAnalysis = sourceText
  const classification = normalizeArticleClassification(article.category)

  return {
    sampleNumber,
    cohort: article.status === 'published' ? 'published' : 'pending',
    articleId: article.id,
    title: sanitizeText(article.title),
    sourceName: sanitizeText(article.sourceName),
    sourceDomain: safeDomain(article.sourceUrl),
    publishedAt: article.publishedAt.toISOString(),
    storedCategory: article.category,
    expectedCategory: classification.category,
    currentSummaryGeneric: article.aiSummary ? GENERIC_OPENING.test(article.aiSummary.trim()) : null,
    sourceTextHash: crypto.createHash('sha256').update(sourceText).digest('hex'),
    sourceTextOrigin,
    extraction: {
      quality,
      qualityReasons,
      extractionMethod: extracted?.extractionMethod || 'none',
      cleanArticleText,
      navigationCookieFooterDebris: quality === 'debris-contaminated',
      debrisMatches,
      tooLittleContent,
      missingContent,
      manualReviewRequired: quality === 'manual-review-required',
      extractedWordCount: extracted?.wordCount || 0,
      usableImage: extracted?.imageQuality === 'usable',
      brokenOrMisleadingImage: extracted?.imageQuality === 'rejected',
      imageQuality: extracted?.imageQuality || 'missing',
      imageReasons: extracted?.imageReasons || ['extraction-unavailable'],
      imageAssessment: extracted?.imageReasons.join(',') || 'extraction-unavailable',
    },
    prompt: buildPrompt(article.title, textForAnalysis),
    sourceText,
  }
}

function providerFailure(error: unknown): { failureKind: string; failureStatus: number | null } {
  const candidate = error as { status?: number; statusCode?: number; code?: string; name?: string }
  const status = candidate.status ?? candidate.statusCode ?? null
  if (status === 401 || status === 403) return { failureKind: 'authentication-or-entitlement', failureStatus: status }
  if (status === 404 || status === 410) return { failureKind: 'model-id-unavailable', failureStatus: status }
  if (status === 429) return { failureKind: 'rate-limited', failureStatus: status }
  if (typeof status === 'number' && status >= 500) return { failureKind: 'provider-failure', failureStatus: status }
  if (/timeout/i.test(candidate.name || '') || /TIME|CONN|NETWORK/i.test(candidate.code || '')) {
    return { failureKind: 'network-or-timeout', failureStatus: status }
  }
  return { failureKind: 'request-failure', failureStatus: status }
}

async function callModel(client: OpenAI, model: string, prompt: string, maxAttempts = 2): Promise<ModelAttempt> {
  const started = performance.now()
  let lastFailure = { failureKind: 'request-failure', failureStatus: null as number | null }
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: 'json_object' },
      })
      const content = response.choices[0]?.message?.content || ''
      const output = parseAndValidateResult(content)
      return {
        model,
        available: true,
        validStructuredOutput: Boolean(output),
        attempts: attempt,
        retries: attempt - 1,
        latencyMs: Math.round(performance.now() - started),
        failureKind: output ? null : 'invalid-structured-output',
        failureStatus: null,
        output,
      }
    } catch (error) {
      lastFailure = providerFailure(error)
      if (attempt < maxAttempts) await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** (attempt - 1)))
    }
  }
  return {
    model,
    available: false,
    validStructuredOutput: false,
    attempts: maxAttempts,
    retries: maxAttempts - 1,
    latencyMs: Math.round(performance.now() - started),
    failureKind: lastFailure.failureKind,
    failureStatus: lastFailure.failureStatus,
    output: null,
  }
}

function meaningfulTokens(value: string): Set<string> {
  return new Set((value.toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) || [])
    .filter((token) => !STOP_WORDS.has(token)))
}

function concreteTerms(value: string): string[] {
  const numbers = value.match(/\b\d+(?:[.,]\d+)*(?:%|m|bn|million|billion|km|mi)?\b/gi) || []
  const acronyms = value.match(/\b[A-Z][A-Z0-9-]{2,}\b/g) || []
  return Array.from(new Set([...numbers, ...acronyms]))
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

function scoreModelOutput(sample: PreparedSample, attempt: ModelAttempt) {
  if (!attempt.output) {
    return {
      ...attempt,
      summaryCompleteness: 0,
      sourceFidelity: 0,
      hallucinatedClaimFlags: [] as string[],
      categoryAccurate: false,
      keyPointUsefulness: 0,
      confidenceBehavior: 'no-valid-output',
      genericOpening: false,
      qualityScore: 0,
      output: null,
    }
  }

  const output = attempt.output
  const sentences = output.aiSummary.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length
  const summaryCompleteness = round([
    sentences >= 2 && sentences <= 3,
    output.aiSummary.length >= 120 && output.aiSummary.length <= 800,
    output.keyPoints.length >= 3 && output.keyPoints.length <= 7,
    output.whyItMatters.length >= 80,
  ].filter(Boolean).length / 4)

  const sourceTokens = meaningfulTokens(`${sample.title} ${sample.sourceText}`)
  const outputText = `${output.aiSummary} ${output.keyPoints.join(' ')} ${output.whyItMatters}`
  const outputTokens = meaningfulTokens(outputText)
  const supportedTokenCount = Array.from(outputTokens).filter((token) => sourceTokens.has(token)).length
  const lexicalSupport = outputTokens.size ? supportedTokenCount / outputTokens.size : 0
  const sourceConcrete = new Set(concreteTerms(`${sample.title} ${sample.sourceText}`).map((term) => term.toLowerCase()))
  const unsupportedConcrete = concreteTerms(outputText)
    .filter((term) => !sourceConcrete.has(term.toLowerCase()))
  const concreteOutput = concreteTerms(outputText)
  const concreteSupport = concreteOutput.length
    ? (concreteOutput.length - unsupportedConcrete.length) / concreteOutput.length
    : 1
  const sourceFidelity = round((lexicalSupport * 0.65) + (concreteSupport * 0.35))

  const pointScores = output.keyPoints.map((point) => {
    const words = point.trim().split(/\s+/).length
    const tokens = meaningfulTokens(point)
    const supported = tokens.size
      ? Array.from(tokens).filter((token) => sourceTokens.has(token)).length / tokens.size
      : 0
    return ((words >= 6 && words <= 35 ? 1 : 0) + supported) / 2
  })
  const uniquePoints = new Set(output.keyPoints.map((point) => point.toLowerCase().replace(/\W+/g, ' ').trim())).size
  const keyPointUsefulness = round(
    ((pointScores.reduce((sum, value) => sum + value, 0) / pointScores.length) * 0.8)
      + ((uniquePoints / output.keyPoints.length) * 0.2),
  )
  const categoryAccurate = output.category === sample.expectedCategory
  const genericOpening = GENERIC_OPENING.test(output.aiSummary.trim())
  const overconfident = output.confidence >= 0.8 && (
    sourceFidelity < 0.65
    || unsupportedConcrete.length > 0
    || !categoryAccurate
    || sample.extraction.missingContent
  )
  const confidenceBehavior = overconfident
    ? 'overconfident-for-evidence'
    : output.confidence < 0.5 && sourceFidelity >= 0.75 && categoryAccurate
      ? 'underconfident-for-evidence'
      : 'proportionate'
  const qualityScore = round(Math.max(0, (
    summaryCompleteness
    + sourceFidelity
    + keyPointUsefulness
    + Number(categoryAccurate)
    + Number(!genericOpening)
  ) / 5 - Math.min(0.25, unsupportedConcrete.length * 0.05)))

  return {
    ...attempt,
    summaryCompleteness,
    sourceFidelity,
    hallucinatedClaimFlags: unsupportedConcrete,
    categoryAccurate,
    keyPointUsefulness,
    confidenceBehavior,
    genericOpening,
    qualityScore,
    output: {
      ...output,
      aiSummary: sanitizeText(output.aiSummary),
      keyPoints: output.keyPoints.map(sanitizeText),
      whyItMatters: sanitizeText(output.whyItMatters),
      tags: output.tags.map(sanitizeText),
    },
  }
}

function average(values: number[]): number | null {
  return values.length ? round(values.reduce((sum, value) => sum + value, 0) / values.length) : null
}

function resolveTmpReportPath(value: string | undefined, flag: string): string | null {
  if (!value) return null
  const resolved = path.resolve(value)
  if (path.dirname(resolved) !== OUTPUT_PREFIX.replace(/\/$/, '')) {
    throw new Error(`${flag} must name a direct child of ${OUTPUT_PREFIX}`)
  }
  return resolved
}

function aggregateModel(results: Array<ReturnType<typeof scoreModelOutput>>, model: string) {
  const rows = results.filter((result) => result.model === model)
  const valid = rows.filter((result) => result.validStructuredOutput)
  return {
    model,
    samples: rows.length,
    availableResponses: rows.filter((result) => result.available).length,
    validStructuredOutputs: valid.length,
    failures: rows.length - valid.length,
    retries: rows.reduce((sum, result) => sum + result.retries, 0),
    genericSummaries: valid.filter((result) => result.genericOpening).length,
    hallucinatedClaimFlags: valid.reduce((sum, result) => sum + result.hallucinatedClaimFlags.length, 0),
    categoryMatches: valid.filter((result) => result.categoryAccurate).length,
    overconfidentOutputs: valid.filter((result) => result.confidenceBehavior === 'overconfident-for-evidence').length,
    averageLatencyMs: average(rows.map((result) => result.latencyMs)),
    averageSummaryCompleteness: average(valid.map((result) => result.summaryCompleteness)),
    averageSourceFidelity: average(valid.map((result) => result.sourceFidelity)),
    averageKeyPointUsefulness: average(valid.map((result) => result.keyPointUsefulness)),
    averageQualityScore: average(valid.map((result) => result.qualityScore)),
    failureKinds: Array.from(new Set(rows.map((result) => result.failureKind).filter(Boolean))),
  }
}

async function main() {
  const outputArg = resolveTmpReportPath(
    process.argv.find((argument) => argument.startsWith('--output='))?.slice('--output='.length),
    '--output',
  )
  const sampleFromArg = resolveTmpReportPath(
    process.argv.find((argument) => argument.startsWith('--sample-from='))?.slice('--sample-from='.length),
    '--sample-from',
  )
  if (!outputArg) throw new Error(`--output must name a direct child of ${OUTPUT_PREFIX}`)
  const fixedSampleIds = sampleFromArg
    ? (JSON.parse(await fs.readFile(sampleFromArg, 'utf8')) as { results?: Array<{ sample?: { articleId?: string } }> }).results
      ?.map((row) => row.sample?.articleId)
      .filter((id): id is string => Boolean(id)) || []
    : []
  if (sampleFromArg && (fixedSampleIds.length !== PUBLISHED_SAMPLE_SIZE + PENDING_SAMPLE_SIZE || new Set(fixedSampleIds).size !== fixedSampleIds.length)) {
    throw new Error(`--sample-from must contain ${PUBLISHED_SAMPLE_SIZE + PENDING_SAMPLE_SIZE} unique sample article IDs`)
  }

  const data = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY')
    const publishedMetadata = await tx.article.findMany({
      where: { status: 'published' },
      select: { id: true, category: true, sourceName: true, publishedAt: true },
      orderBy: { publishedAt: 'asc' },
    })
    const pendingMetadata = await tx.article.findMany({
      where: { status: 'pending_ai' },
      select: { id: true, category: true, sourceName: true, publishedAt: true },
      orderBy: { publishedAt: 'asc' },
    })
    const publishedIds = fixedSampleIds.length ? [] : selectPublishedSample(publishedMetadata)
    const publishedSources = new Set(publishedMetadata.filter((row) => publishedIds.includes(row.id)).map((row) => row.sourceName))
    const pendingIds = fixedSampleIds.length ? [] : selectPendingSample(pendingMetadata, publishedSources)
    const selectedIds = fixedSampleIds.length ? fixedSampleIds : [...publishedIds, ...pendingIds]
    const articles = await tx.article.findMany({
      where: { id: { in: selectedIds } },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        sourceName: true,
        sourceUrl: true,
        publishedAt: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        aiSummary: true,
      },
    })
    const byId = new Map(articles.map((article) => [article.id, article]))
    return {
      inventory: { published: publishedMetadata.length, pending: pendingMetadata.length },
      articles: selectedIds.map((id) => byId.get(id)).filter((article): article is ArticleRecord => Boolean(article)),
    }
  }, { timeout: 30_000 })

  process.stderr.write(`Selected ${data.articles.length} articles (${PUBLISHED_SAMPLE_SIZE} published, ${PENDING_SAMPLE_SIZE} pending)${sampleFromArg ? ' from baseline report' : ''}\n`)
  const prepared = await mapLimit(data.articles, 3, async (article, index) => {
    const sample = await prepareSample(article, index + 1)
    process.stderr.write(`Extraction ${index + 1}/${data.articles.length}: ${sample.extraction.cleanArticleText ? 'clean' : 'flagged'}\n`)
    return sample
  })

  const client = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY || 'ollama',
    baseURL: 'https://ollama.com/v1',
    maxRetries: 0,
    timeout: 90_000,
  })
  let modelList: string[] = []
  let modelListFailure: ReturnType<typeof providerFailure> | null = null
  try {
    const response = await client.models.list()
    modelList = response.data.map((model) => model.id).sort()
  } catch (error) {
    modelListFailure = providerFailure(error)
  }

  const providerListedDeepSeekModel = modelList.includes('deepseek-v4-flash:0731')
    ? 'deepseek-v4-flash:0731'
    : modelList.includes('deepseek-v4-flash:preview')
      ? 'deepseek-v4-flash:preview'
      : PRODUCTION_PRIMARY
  const primaryProbe = await callModel(client, PRODUCTION_PRIMARY, prepared[0].prompt, 3)
  process.stderr.write(`Production primary probe: ${primaryProbe.available ? 'available' : primaryProbe.failureKind}\n`)

  const deepSeekComparisonModel = primaryProbe.available ? PRODUCTION_PRIMARY : providerListedDeepSeekModel
  const comparisonModels = Array.from(new Set([deepSeekComparisonModel, PRODUCTION_FALLBACK]))
  const evaluated = await mapLimit(prepared, 2, async (sample, index) => {
    const attempts = await Promise.all(comparisonModels.map((model) => callModel(client, model, sample.prompt)))
    process.stderr.write(`Models ${index + 1}/${prepared.length}: ${attempts.map((attempt) => `${attempt.model}=${attempt.validStructuredOutput ? 'valid' : attempt.failureKind}`).join(', ')}\n`)
    return {
      sample: {
        sampleNumber: sample.sampleNumber,
        cohort: sample.cohort,
        articleId: sample.articleId,
        title: sample.title,
        sourceName: sample.sourceName,
        sourceDomain: sample.sourceDomain,
        publishedAt: sample.publishedAt,
        storedCategory: sample.storedCategory,
        expectedCategory: sample.expectedCategory,
        currentSummaryGeneric: sample.currentSummaryGeneric,
        sourceTextHash: sample.sourceTextHash,
        sourceTextOrigin: sample.sourceTextOrigin,
        extraction: sample.extraction,
      },
      models: attempts.map((attempt) => scoreModelOutput(sample, attempt)),
    }
  })

  const flatModelResults = evaluated.flatMap((row) => row.models)
  const modelAggregates = comparisonModels.map((model) => aggregateModel(flatModelResults, model))
  const cleanModelResults = evaluated.filter((row) => row.sample.extraction.cleanArticleText).flatMap((row) => row.models)
  const modelAggregatesCleanExtraction = comparisonModels.map((model) => aggregateModel(cleanModelResults, model))
  const extraction = {
    samples: prepared.length,
    cleanArticleText: prepared.filter((sample) => sample.extraction.cleanArticleText).length,
    navigationCookieFooterDebris: prepared.filter((sample) => sample.extraction.navigationCookieFooterDebris).length,
    tooLittleContent: prepared.filter((sample) => sample.extraction.tooLittleContent).length,
    missingContent: prepared.filter((sample) => sample.extraction.missingContent).length,
    manualReviewRequired: prepared.filter((sample) => sample.extraction.manualReviewRequired).length,
    usableImage: prepared.filter((sample) => sample.extraction.usableImage).length,
    brokenOrMisleadingImage: prepared.filter((sample) => sample.extraction.brokenOrMisleadingImage).length,
    manualReviewImage: prepared.filter((sample) => sample.extraction.imageQuality === 'manual-review-required').length,
    currentPublishedGenericSummaries: prepared.filter((sample) => sample.cohort === 'published' && sample.currentSummaryGeneric).length,
  }
  const report = {
    generatedAt: new Date().toISOString(),
    mode: 'read-only',
    databaseTransaction: 'read-only',
    sanitized: true,
    sampleDesign: {
      inventory: data.inventory,
      publishedSampleSize: prepared.filter((sample) => sample.cohort === 'published').length,
      pendingSampleSize: prepared.filter((sample) => sample.cohort === 'pending').length,
      publishedSelection: sampleFromArg ? 'reused exact baseline article IDs in baseline order' : 'five chronological buckets, source/category diversity within each bucket',
      pendingSelection: sampleFromArg ? 'reused exact baseline article IDs in baseline order' : 'oldest-first with source diversity',
      sampleFrom: sampleFromArg || null,
    },
    provider: {
      apiKeyConfigured: Boolean(process.env.OLLAMA_API_KEY),
      modelListAvailable: modelListFailure === null,
      modelListFailure,
      productionPrimary: PRODUCTION_PRIMARY,
      productionPrimaryListed: modelList.includes(PRODUCTION_PRIMARY),
      productionPrimaryProbe: { ...primaryProbe, output: null },
      matchingProviderModels: modelList.filter((model) => /deepseek-v4-flash|glm-5/i.test(model)),
      providerListedDeepSeekModel,
      deepSeekComparisonModel,
      productionFallback: PRODUCTION_FALLBACK,
      productionFallbackListed: modelList.includes(PRODUCTION_FALLBACK),
      likelyPrimaryFailureCause: primaryProbe.available && !modelList.includes(PRODUCTION_PRIMARY)
        ? 'model-list alias mismatch: inference succeeds even though the exact ID is omitted from models.list()'
        : !modelList.includes(PRODUCTION_PRIMARY) && modelList.some((model) => model.startsWith(`${PRODUCTION_PRIMARY}:`))
          ? 'configured model ID is not listed; tagged variants are available'
          : primaryProbe.failureKind,
    },
    extraction,
    modelAggregates,
    modelAggregatesCleanExtraction,
    routingDecision: `no routing change from this pilot: evaluated ${comparisonModels.join(' vs ')}; production remains deepseek-v4-flash primary, glm-5.2 fallback`,
    evaluationLimitations: [
      'Flagged sources use stored content only for comparative measurement and are not publishable.',
      'Category agreement uses the normalized stored category as a proxy, not a human-reviewed gold label.',
      'Model outputs are stochastic; aggregate changes do not by themselves justify a routing change.',
    ],
    results: evaluated,
  }

  await fs.writeFile(outputArg, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
  process.stdout.write(`${JSON.stringify({
    output: outputArg,
    sampleDesign: report.sampleDesign,
    provider: report.provider,
    extraction,
    modelAggregates,
    modelAggregatesCleanExtraction,
    routingDecision: report.routingDecision,
  }, null, 2)}\n`)
}

main()
  .catch((error) => {
    process.stderr.write(`Pilot failed: ${error instanceof Error ? error.message : 'unknown error'}\n`)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
