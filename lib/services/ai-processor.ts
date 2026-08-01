import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { extractContentFromUrl, estimateReadTime } from './content-extractor';
import slugify from 'slugify';

// Ollama Cloud API (for chat completions)
const ollama = new OpenAI({
  apiKey: process.env.OLLAMA_API_KEY || 'ollama',
  baseURL: 'https://ollama.com/v1',
});

// OpenAI API (for embeddings only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------------------------------------------------------------
// Model configuration — environment-configurable with safe defaults
// ---------------------------------------------------------------------------

function getPrimaryModel(): string {
  return process.env.OLLAMA_MODEL || 'deepseek-v4-flash';
}

function getFallbackModel(): string {
  const configuredFallback = process.env.OLLAMA_FALLBACK_MODEL;
  const fallback = configuredFallback === undefined ? 'glm-5.2' : configuredFallback.trim();
  // If fallback is the same as primary or blank, there is no meaningful fallback
  const primary = getPrimaryModel();
  if (!fallback || fallback.trim() === '' || fallback === primary) {
    return '';
  }
  return fallback;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AIProcessingResult {
  aiSummary: string;
  keyPoints: string[];
  whyItMatters: string;
  tags: string[];
  confidence: number;
  category: string;
}

export interface ModelAvailabilityResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  primaryModel: string;
  fallbackModel: string;
  primaryAvailable: boolean;
  fallbackAvailable: boolean;
  message: string;
}

export interface ProcessingStats {
  processed: number;
  failed: number;
  errors: string[];
  providerUnavailable?: boolean;
  providerStatus?: ModelAvailabilityResult;
}

// ---------------------------------------------------------------------------
// Health: model availability check
// ---------------------------------------------------------------------------

export async function checkAIModelAvailability(): Promise<ModelAvailabilityResult> {
  const primaryModel = getPrimaryModel();
  const fallbackModel = getFallbackModel();

  try {
    const response = await ollama.models.list();
    const availableIds: Set<string> = new Set(
      (response as any).data?.map((m: { id: string }) => m.id) ?? [],
    );

    const primaryAvailable = availableIds.has(primaryModel);
    const fallbackAvailable =
      fallbackModel !== '' && availableIds.has(fallbackModel);

    if (primaryAvailable && fallbackAvailable) {
      return {
        status: 'healthy',
        primaryModel,
        fallbackModel: fallbackModel || 'none',
        primaryAvailable: true,
        fallbackAvailable: true,
        message: `Primary (${primaryModel}) and fallback (${fallbackModel}) models available`,
      };
    }

    if (primaryAvailable && !fallbackAvailable) {
      const fallbackConfigured = fallbackModel !== '';
      return {
        status: fallbackConfigured ? 'degraded' : 'healthy',
        primaryModel,
        fallbackModel: fallbackModel || 'none',
        primaryAvailable: true,
        fallbackAvailable: false,
        message: fallbackConfigured
          ? `Primary (${primaryModel}) available, fallback (${fallbackModel}) unavailable`
          : `Primary (${primaryModel}) available; no fallback configured`,
      };
    }

    if (!primaryAvailable && fallbackAvailable) {
      return {
        status: 'degraded',
        primaryModel,
        fallbackModel,
        primaryAvailable: false,
        fallbackAvailable: true,
        message: `Primary (${primaryModel}) unavailable, fallback (${fallbackModel}) available`,
      };
    }

    // Neither available
    return {
      status: 'unhealthy',
      primaryModel,
      fallbackModel: fallbackModel || 'none',
      primaryAvailable: false,
      fallbackAvailable: false,
      message: `Neither primary (${primaryModel}) nor fallback (${fallbackModel || 'none'}) models available`,
    };
  } catch (error) {
    logger.error('AI model availability check failed:', error);
    return {
      status: 'unhealthy',
      primaryModel,
      fallbackModel: fallbackModel || 'none',
      primaryAvailable: false,
      fallbackAvailable: false,
      message: 'AI model availability check failed',
    };
  }
}

// ---------------------------------------------------------------------------
// Embeddings (unchanged behavior)
// ---------------------------------------------------------------------------

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    });
    return response.data[0]?.embedding || null;
  } catch (error) {
    logger.error('Embedding generation error:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// AI generation with model fallback
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an expert defense analyst specializing in counter-UAS (Unmanned Aerial Systems) technology, drone warfare, and military defense systems. Your task is to analyze news articles and provide structured intelligence summaries.

When analyzing articles, focus on:
- Counter-UAS systems and technologies
- Drone warfare tactics and developments
- Defense contracts and procurement
- Military policy related to drones and air defense
- Key players: companies, countries, military units

Be concise, factual, and focused on actionable intelligence.`;

/**
 * Error thrown when the provider/model itself is unavailable (404/410, auth,
 * rate-limit, timeout/network). This lets the caller distinguish systemic
 * provider failures from ordinary content/parse failures.
 */
export class ProviderUnavailableError extends Error {
  constructor(message: string, public readonly model: string) {
    super(message);
    this.name = 'ProviderUnavailableError';
  }
}

/**
 * Distinguish provider-level errors from ordinary parse errors.
 * Provider errors: HTTP 408, 404/410, 401/403 (auth), 429 (rate-limit),
 * all 5xx responses, and timeout/network failures.
 */
function isProviderError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const err = error as any;
  // OpenAI SDK attaches status
  const status = err.status ?? err.statusCode;
  if (status === 408) return true;
  if (status === 404 || status === 410) return true;
  if (status === 401 || status === 403) return true;
  if (status === 429) return true;
  if (typeof status === 'number' && status >= 500 && status <= 599) return true;
  // Network / timeout errors
  if (
    err.name === 'APIConnectionError' ||
    err.name === 'APIConnectionTimeoutError' ||
    err.name === 'TimeoutError' ||
    err.code === 'ECONNRESET' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'EAI_AGAIN' ||
    err.code === 'ENETUNREACH' ||
    err.code === 'EHOSTUNREACH' ||
    err.code === 'ECONNABORTED' ||
    err.code === 'EPIPE' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'ENOTFOUND'
  ) {
    return true;
  }
  const msg = err.message?.toLowerCase() ?? '';
  if (
    /\b(?:timeout|time(?:d)?[\s-]+out)\b/.test(msg) ||
    msg.includes('network') ||
    msg.includes('connection') ||
    msg.includes('econnrefused') ||
    msg.includes('socket hang up') ||
    msg.includes('fetch failed')
  ) {
    return true;
  }
  return false;
}

/**
 * Parse and validate an AI response into AIProcessingResult.
 * Returns null if the JSON is invalid or any required field is missing/invalid.
 */
function parseAndValidateResult(content: string): AIProcessingResult | null {
  try {
    // Extract JSON from potential markdown code blocks (Ollama models may wrap JSON in ```json...```)
    let jsonStr = content.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    const allowedFields = new Set([
      'aiSummary',
      'keyPoints',
      'whyItMatters',
      'tags',
      'confidence',
      'category',
    ]);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed) ||
      Object.keys(parsed).length !== allowedFields.size ||
      Object.keys(parsed).some((field) => !allowedFields.has(field))
    ) return null;

    // Validate all required fields
    if (typeof parsed.aiSummary !== 'string' || !parsed.aiSummary.trim()) return null;
    if (!Array.isArray(parsed.keyPoints) || parsed.keyPoints.length < 3 || parsed.keyPoints.length > 7) return null;
    if (!parsed.keyPoints.every((p: unknown) => typeof p === 'string' && p.trim())) return null;
    if (typeof parsed.whyItMatters !== 'string' || !parsed.whyItMatters.trim()) return null;
    if (!Array.isArray(parsed.tags) || parsed.tags.length < 3 || parsed.tags.length > 8) return null;
    if (!parsed.tags.every((t: unknown) => typeof t === 'string' && t.trim())) return null;
    if (
      typeof parsed.confidence !== 'number' ||
      !Number.isFinite(parsed.confidence) ||
      parsed.confidence < 0 ||
      parsed.confidence > 1
    ) return null;
    if (!['counter-uas', 'drone-warfare', 'contracts', 'policy', 'general'].includes(parsed.category)) return null;

    return {
      aiSummary: parsed.aiSummary,
      keyPoints: parsed.keyPoints,
      whyItMatters: parsed.whyItMatters,
      tags: parsed.tags,
      confidence: parsed.confidence,
      category: parsed.category,
    };
  } catch {
    return null;
  }
}

/**
 * Call a single model and return a validated result.
 * Throws ProviderUnavailableError if the provider/model itself is unavailable.
 * Returns null for malformed/invalid output (caller can try fallback).
 */
async function callModel(model: string, prompt: string): Promise<AIProcessingResult | null> {
  try {
    const response = await ollama.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    return parseAndValidateResult(content);
  } catch (error) {
    if (isProviderError(error)) {
      throw new ProviderUnavailableError(
        `Provider unavailable for model ${model}: ${error instanceof Error ? error.message : 'unknown'}`,
        model,
      );
    }
    // Non-provider error (e.g. JSON parse issues are handled in parseAndValidateResult)
    logger.error(`AI processing error (${model}):`, error);
    return null;
  }
}

/**
 * Build a single comprehensive prompt that requests all required fields.
 */
function buildPrompt(title: string, textForAnalysis: string): string {
  return `You are an expert defense analyst specializing in counter-UAS technology and drone warfare. Provide a structured intelligence summary.

Article Title: ${title}

Article Content:
${textForAnalysis.slice(0, 8000)}

Respond in JSON format with these exact fields:
{
  "aiSummary": "A concise 2-3 sentence summary of the key developments",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "whyItMatters": "2-3 sentences explaining the strategic significance and implications",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.85,
  "category": "counter-uas|drone-warfare|contracts|policy|general"
}

Requirements:
- aiSummary: non-empty string, concise 2-3 sentence summary
- keyPoints: non-empty array of strings, 3-7 key points
- whyItMatters: non-empty string, strategic significance
- tags: array of strings, relevant technologies, companies, countries, systems (3-8 tags)
- confidence: number 0-1, how well this fits C-UAS/drone warfare theme
- category: one of counter-uas, drone-warfare, contracts, policy, general

Be concise, factual, and focused on actionable intelligence.`;
}

/**
 * Attempt AI generation with primary model, then fallback.
 * Throws ProviderUnavailableError if BOTH models have provider-level failures.
 * Returns null if both models return malformed/invalid output (ordinary failure).
 */
async function generateWithFallback(prompt: string): Promise<AIProcessingResult | null> {
  const primaryModel = getPrimaryModel();
  const fallbackModel = getFallbackModel();

  let primaryProviderError: ProviderUnavailableError | null = null;

  // Try primary
  try {
    const result = await callModel(primaryModel, prompt);
    if (result) return result;
    logger.debug(`Primary model ${primaryModel} returned invalid/incomplete output, trying fallback...`);
  } catch (error) {
    if (error instanceof ProviderUnavailableError) {
      primaryProviderError = error;
      logger.warn(`Primary model ${primaryModel} unavailable: ${error.message}`);
    } else {
      throw error;
    }
  }

  // Try fallback (if configured and different from primary)
  if (fallbackModel) {
    try {
      const result = await callModel(fallbackModel, prompt);
      if (result) return result;
      logger.debug(`Fallback model ${fallbackModel} also returned invalid/incomplete output`);
    } catch (error) {
      if (error instanceof ProviderUnavailableError) {
        logger.warn(`Fallback model ${fallbackModel} unavailable: ${error.message}`);
        // If both had provider errors, this is a systemic failure
        if (primaryProviderError) {
          throw new ProviderUnavailableError(
            `Both primary (${primaryModel}) and fallback (${fallbackModel}) models unavailable`,
            fallbackModel,
          );
        }
        // Mixed malformed/provider outcomes are ordinary article failures.
        return null;
      }
      throw error;
    }
  }

  // Both models returned malformed data, a mixed failure occurred, or no
  // fallback was configured to independently confirm a systemic outage.
  return null;
}

// ---------------------------------------------------------------------------
// Per-article processing
// ---------------------------------------------------------------------------

export async function processArticleWithAI(articleId: string): Promise<boolean> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    logger.error(`Article not found: ${articleId}`);
    return false;
  }

  // Extract full content if not already available
  let content = article.content;
  let imageUrl = article.imageUrl;

  if ((!content || content.length < 500) && article.sourceUrl) {
    logger.debug(`Extracting content from ${article.sourceUrl}`);
    const extracted = await extractContentFromUrl(article.sourceUrl);

    if (extracted) {
      content = extracted.content;
      if (!imageUrl && extracted.imageUrl) {
        imageUrl = extracted.imageUrl;
      }
    }
  }

  const textForAnalysis = `${article.title}\n\n${article.excerpt || ''}\n\n${content || ''}`;

  if (textForAnalysis.length < 100) {
    logger.debug(`Not enough content to process: ${article.id}`);
    return false;
  }

  // Single prompt requiring all fields — one chat call in healthy path
  const prompt = buildPrompt(article.title, textForAnalysis);

  const result = await generateWithFallback(prompt);

  if (!result) {
    logger.error(`AI processing failed for article: ${articleId} — both models returned invalid output`);
    return false;
  }

  // Generate embedding for similarity search
  const embeddingText = `${article.title}. ${result.aiSummary}. ${result.keyPoints.join('. ')}`;
  const embedding = await generateEmbedding(embeddingText);

  // Update article with AI-generated content
  await prisma.article.update({
    where: { id: articleId },
    data: {
      content: content || article.content,
      imageUrl: imageUrl || article.imageUrl,
      aiSummary: result.aiSummary,
      keyPoints: result.keyPoints,
      whyItMatters: result.whyItMatters,
      confidence: result.confidence,
      category: result.category || article.category,
      status: 'published',
    },
  });

  // Store embedding via raw SQL (Unsupported type in Prisma)
  if (embedding) {
    const vectorStr = `[${embedding.join(',')}]`;
    await prisma.$executeRaw`UPDATE articles SET embedding = ${vectorStr}::vector WHERE id = ${articleId}`;
  }

  // Create and link tags
  for (const tagName of result.tags) {
    await createAndLinkTag(articleId, tagName);
  }

  logger.debug(`Successfully processed article: ${article.title.slice(0, 50)}...`);
  return true;
}

async function createAndLinkTag(articleId: string, tagName: string): Promise<void> {
  const slug = slugify(tagName, { lower: true, strict: true });

  // Determine tag category
  const category = categorizeTag(tagName);

  try {
    // Upsert the tag
    const tag = await prisma.tag.upsert({
      where: { slug },
      create: {
        name: tagName,
        slug,
        category,
      },
      update: {}, // Don't update existing tags
    });

    // Link tag to article (ignore if already linked)
    await prisma.articleTag.upsert({
      where: {
        articleId_tagId: {
          articleId,
          tagId: tag.id,
        },
      },
      create: {
        articleId,
        tagId: tag.id,
      },
      update: {},
    });
  } catch (error) {
    // Ignore duplicate errors
    logger.debug(`Tag linking skipped for ${tagName}: already exists`);
  }
}

function categorizeTag(tagName: string): string {
  const lowerTag = tagName.toLowerCase();

  const companies = ['anduril', 'raytheon', 'northrop', 'lockheed', 'boeing', 'droneshield', 'dedrone', 'skydio', 'general atomics'];
  const countries = ['usa', 'ukraine', 'russia', 'israel', 'china', 'iran', 'turkey', 'nato'];
  const systems = ['coyote', 'iron dome', 'roadrunner', 'switchblade', 'shahed', 'lancet', 'patriot'];

  if (companies.some((c) => lowerTag.includes(c))) return 'company';
  if (countries.some((c) => lowerTag.includes(c))) return 'country';
  if (systems.some((s) => lowerTag.includes(s))) return 'system-type';

  return 'technology';
}

// ---------------------------------------------------------------------------
// Batch processing with systemic-failure detection
// ---------------------------------------------------------------------------

export async function processPendingArticles(limit: number = 25): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    processed: 0,
    failed: 0,
    errors: [],
  };

  // Get articles that need AI processing (skip those that failed too many times)
  const articles = await prisma.article.findMany({
    where: {
      aiRetryCount: { lt: 3 },
      OR: [
        { status: 'pending_ai' },
        { aiSummary: null },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  logger.debug(`Processing ${articles.length} articles...`);

  if (articles.length === 0) {
    return stats;
  }

  // Process one article at a time so a systemic provider failure can stop the
  // batch before another article starts. Keep the existing pause after every
  // five attempts to avoid changing provider pacing beyond removing concurrency.
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];

    try {
      const success = await processArticleWithAI(article.id);
      if (success) {
        stats.processed++;
      } else {
        // Ordinary article failure (insufficient content or malformed data from both models)
        await prisma.article.update({
          where: { id: article.id },
          data: { aiRetryCount: { increment: 1 } },
        });
        stats.failed++;
        stats.errors.push(`Failed to process: ${article.title.slice(0, 50)}`);
      }
    } catch (error) {
      if (error instanceof ProviderUnavailableError) {
        // Systemic provider failure — do NOT increment retry count or start another article.
        stats.failed++;
        stats.providerUnavailable = true;
        stats.errors.push(error.message);
        stats.providerStatus = await checkAIModelAvailability();
        logger.warn('Provider unavailable detected — short-circuiting remaining articles');
        break;
      }

      // Ordinary per-article exception — increment retry and continue.
      await prisma.article.update({
        where: { id: article.id },
        data: { aiRetryCount: { increment: 1 } },
      });
      stats.failed++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      stats.errors.push(`Error processing ${article.id}: ${errorMsg}`);
    }

    if ((i + 1) % 5 === 0 && i + 1 < articles.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return stats;
}
