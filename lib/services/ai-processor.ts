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

interface AIProcessingResult {
  aiSummary: string;
  keyPoints: string[];
  whyItMatters: string;
  tags: string[];
  confidence: number;
  category: string;
}

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

const SYSTEM_PROMPT = `You are an expert defense analyst specializing in counter-UAS (Unmanned Aerial Systems) technology, drone warfare, and military defense systems. Your task is to analyze news articles and provide structured intelligence summaries.

When analyzing articles, focus on:
- Counter-UAS systems and technologies
- Drone warfare tactics and developments
- Defense contracts and procurement
- Military policy related to drones and air defense
- Key players: companies, countries, military units

Be concise, factual, and focused on actionable intelligence.`;

async function callAI(prompt: string, preferMini = false): Promise<AIProcessingResult | null> {
  // Gemma 3 27B — fast inference, no reasoning tokens, solid structured output
  const model = 'gemma3:27b';
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

    // Extract JSON from potential markdown code blocks (Ollama models may wrap JSON in ```json...```)
    let jsonStr = content.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    return JSON.parse(jsonStr) as AIProcessingResult;
  } catch (error) {
    logger.error('AI processing error:', error);
    return null;
  }
}

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

  // Two-stage processing: mini for tags/category/confidence, gpt-4o for quality summaries
  const miniPrompt = `You are a defense analyst. Quickly classify and tag this article.

Article Title: ${article.title}

Article Content:
${textForAnalysis.slice(0, 4000)}

Respond in JSON with these exact fields:
{
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.85,
  "category": "counter-uas|drone-warfare|contracts|policy|general"
}

Tags should include relevant technologies, companies, countries, and systems. Confidence (0-1) = how well this fits the C-UAS/drone warfare theme.`;

  const fullPrompt = `You are an expert defense analyst specializing in counter-UAS technology and drone warfare. Provide a structured intelligence summary.

Article Title: ${article.title}

Article Content:
${textForAnalysis.slice(0, 8000)}

Respond in JSON format with these exact fields:
{
  "aiSummary": "A concise 2-3 sentence summary of the key developments",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "whyItMatters": "2-3 sentences explaining the strategic significance and implications",
  "tags": [],
  "confidence": 0,
  "category": ""
}

Be concise, factual, and focused on actionable intelligence.`;

  // Run both in parallel: mini for metadata, gpt-4o for quality prose
  const [miniResult, fullResult] = await Promise.all([
    callAI(miniPrompt, true),
    callAI(fullPrompt, false),
  ]);

  // Merge results — use gpt-4o prose + mini metadata
  const result: AIProcessingResult | null = fullResult ? {
    aiSummary: fullResult.aiSummary,
    keyPoints: fullResult.keyPoints,
    whyItMatters: fullResult.whyItMatters,
    tags: miniResult?.tags ?? fullResult.tags,
    confidence: miniResult?.confidence ?? fullResult.confidence,
    category: miniResult?.category ?? fullResult.category,
  } : miniResult;

  if (!result) {
    logger.error(`AI processing failed for article: ${articleId}`);
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

export interface ProcessingStats {
  processed: number;
  failed: number;
  errors: string[];
}

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

  // Process articles in parallel batches of 5
  for (let i = 0; i < articles.length; i += 5) {
    const chunk = articles.slice(i, i + 5);

    const results = await Promise.allSettled(
      chunk.map(async (article) => {
        try {
          const success = await processArticleWithAI(article.id);
          if (!success) {
            await prisma.article.update({
              where: { id: article.id },
              data: { aiRetryCount: { increment: 1 } },
            });
            return { success: false, error: `Failed to process: ${article.title.slice(0, 50)}` };
          }
          return { success: true };
        } catch (error) {
          await prisma.article.update({
            where: { id: article.id },
            data: { aiRetryCount: { increment: 1 } },
          });
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          return { success: false, error: `Error processing ${article.id}: ${errorMsg}` };
        }
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        stats.processed++;
      } else {
        stats.failed++;
        const error = result.status === 'fulfilled' ? result.value.error : result.reason?.message;
        stats.errors.push(error || 'Unknown error');
      }
    }

    // Delay between chunks
    if (i + 5 < articles.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return stats;
}
