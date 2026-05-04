import Exa from 'exa-js';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { RSS_FEEDS } from '@/lib/constants/rss-feeds';
import { categorizeArticle } from '@/lib/utils';

const EXA_QUERIES = [
  'emerging counter-drone systems anti-UAS technologies research development testing',
  'drone warfare tactics battlefield FPV Ukraine Middle East combat evolution',
  'defense procurement drone counter-drone programs international contracts',
  'artificial intelligence autonomous systems air defense research startups',
  'international counter-UAS developments Israel Europe Asia-Pacific defense',
  'drone policy regulation strategic analysis doctrine think tank report',
];

const RESULTS_PER_QUERY = 15;
const DELAY_BETWEEN_QUERIES_MS = 1500;
const LOOKBACK_DAYS = 7;
const DEDUP_LOOKBACK_DAYS = 14;

export interface ExaSearchResult {
  queriesRun: number;
  articlesAdded: number;
  articlesSkipped: number;
  errors: Array<{ query: string; error: string }>;
}

function getExcludedDomains(): string[] {
  return RSS_FEEDS.map((feed) => {
    try {
      const url = new URL(feed.url);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }).filter(Boolean);
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTitleSimilar(a: string, b: string): boolean {
  const normA = normalizeTitle(a);
  const normB = normalizeTitle(b);

  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Check if one title starts with the other (handles truncated titles)
  const shorter = normA.length < normB.length ? normA : normB;
  const longer = normA.length < normB.length ? normB : normA;
  if (shorter.length > 20 && longer.startsWith(shorter.slice(0, 40))) return true;

  return false;
}

function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    // Extract readable name from hostname
    const parts = hostname.split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return 'Unknown';
  }
}

export async function searchWithExa(): Promise<ExaSearchResult> {
  const result: ExaSearchResult = {
    queriesRun: 0,
    articlesAdded: 0,
    articlesSkipped: 0,
    errors: [],
  };

  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    logger.warn('EXA_API_KEY not configured, skipping Exa search');
    return result;
  }

  const exa = new Exa(apiKey);
  const excludedDomains = getExcludedDomains();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - LOOKBACK_DAYS);

  // Fetch recent titles for dedup
  const dedupCutoff = new Date();
  dedupCutoff.setDate(dedupCutoff.getDate() - DEDUP_LOOKBACK_DAYS);
  const recentArticles = await prisma.article.findMany({
    where: { publishedAt: { gte: dedupCutoff } },
    select: { title: true, sourceUrl: true },
  });

  const existingUrls = new Set(recentArticles.map((a) => a.sourceUrl).filter(Boolean));
  const existingTitles = recentArticles.map((a) => a.title);

  logger.info(`Exa search: starting ${EXA_QUERIES.length} queries, excluding ${excludedDomains.length} domains`);

  for (const query of EXA_QUERIES) {
    try {
      const response = await exa.searchAndContents(query, {
        type: 'auto',
        numResults: RESULTS_PER_QUERY,
        startPublishedDate: startDate.toISOString().split('T')[0],
        excludeDomains: excludedDomains,
        text: { maxCharacters: 3000 },
        highlights: { numSentences: 3 },
      });

      result.queriesRun++;

      // Batch dedup: collect all URLs from this query's results and check DB in one query
      const resultUrls = response.results
        .map((item) => item.url)
        .filter((url): url is string => !!url);
      const dbMatches = await prisma.article.findMany({
        where: { sourceUrl: { in: resultUrls } },
        select: { sourceUrl: true },
      });
      for (const match of dbMatches) {
        if (match.sourceUrl) {
          existingUrls.add(match.sourceUrl);
        }
      }

      for (const item of response.results) {
        if (!item.title || !item.url) {
          result.articlesSkipped++;
          continue;
        }

        // Dedup: check URL
        if (existingUrls.has(item.url)) {
          result.articlesSkipped++;
          continue;
        }

        // Dedup: check title similarity
        if (existingTitles.some((t) => isTitleSimilar(t, item.title!))) {
          result.articlesSkipped++;
          continue;
        }

        const content = item.text || '';
        const highlights = item.highlights?.join(' ') || '';
        const sourceName = extractSourceName(item.url);
        const publishedAt = item.publishedDate
          ? new Date(item.publishedDate)
          : new Date();

        await prisma.article.create({
          data: {
            title: item.title,
            content: content || null,
            excerpt: (highlights || content.slice(0, 500)) || null,
            sourceUrl: item.url,
            sourceName: `${sourceName} (via Exa)`,
            publishedAt,
            category: categorizeArticle(item.title, content),
            status: 'pending_ai',
            views: 0,
          },
        });

        result.articlesAdded++;
        existingUrls.add(item.url);
        existingTitles.push(item.title);
        logger.debug(`Exa: added "${item.title.slice(0, 60)}..." from ${sourceName}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Exa query error: "${query.slice(0, 40)}..." - ${errorMessage}`);
      result.errors.push({ query, error: errorMessage });
    }

    // Rate limiting between queries
    await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_QUERIES_MS));
  }

  logger.info(
    `Exa search complete: ${result.queriesRun} queries, ${result.articlesAdded} added, ${result.articlesSkipped} skipped`
  );

  return result;
}
