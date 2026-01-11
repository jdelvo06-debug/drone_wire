import OpenAI from 'openai';
import { prisma } from '@/lib/db';
import { extractContentFromUrl, estimateReadTime } from './content-extractor';
import slugify from 'slugify';

// RouteLLM API (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: process.env.ROUTELLM_API_KEY,
  baseURL: 'https://routellm.abacus.ai/v1',
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
  // Only generate embeddings if using a provider that supports them
  // RouteLLM doesn't support embeddings, so skip for now
  // To enable: set OPENAI_API_KEY and update this function to use OpenAI directly
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const OpenAI = (await import('openai')).default;
    const openaiDirect = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openaiDirect.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    });
    return response.data[0]?.embedding || null;
  } catch (error) {
    console.error('Embedding generation error:', error);
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

async function callAI(prompt: string): Promise<AIProcessingResult | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return null;
    }

    return JSON.parse(content) as AIProcessingResult;
  } catch (error) {
    console.error('AI processing error:', error);
    return null;
  }
}

export async function processArticleWithAI(articleId: string): Promise<boolean> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    console.error(`Article not found: ${articleId}`);
    return false;
  }

  // Extract full content if not already available
  let content = article.content;
  let imageUrl = article.imageUrl;

  if ((!content || content.length < 500) && article.sourceUrl) {
    console.log(`Extracting content from ${article.sourceUrl}`);
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
    console.log(`Not enough content to process: ${article.id}`);
    return false;
  }

  const prompt = `Analyze this counter-UAS/drone warfare related news article and provide a structured analysis.

Article Title: ${article.title}

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

Tags should include relevant:
- Technologies (radar, jamming, laser, AI)
- Companies (Anduril, Raytheon, DroneShield)
- Countries (USA, Ukraine, Russia, Israel)
- Systems (Coyote, Iron Dome, Roadrunner)

Confidence score (0-1) reflects how well this article fits the counter-UAS/drone warfare theme.`;

  const result = await callAI(prompt);

  if (!result) {
    console.error(`AI processing failed for article: ${articleId}`);
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
      ...(embedding && { embedding }),
    },
  });

  // Create and link tags
  for (const tagName of result.tags) {
    await createAndLinkTag(articleId, tagName);
  }

  console.log(`Successfully processed article: ${article.title.slice(0, 50)}...`);
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
    console.log(`Tag linking skipped for ${tagName}: already exists`);
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

export async function processPendingArticles(limit: number = 10): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    processed: 0,
    failed: 0,
    errors: [],
  };

  // Get articles that need AI processing
  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { status: 'pending_ai' },
        { aiSummary: null },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  console.log(`Processing ${articles.length} articles...`);

  for (const article of articles) {
    try {
      const success = await processArticleWithAI(article.id);
      if (success) {
        stats.processed++;
      } else {
        stats.failed++;
        stats.errors.push(`Failed to process: ${article.title.slice(0, 50)}`);
      }
    } catch (error) {
      stats.failed++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      stats.errors.push(`Error processing ${article.id}: ${errorMsg}`);
    }

    // Delay between API calls
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return stats;
}
