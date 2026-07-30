import Parser from 'rss-parser';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { isRelevantContent } from '@/lib/constants/rss-feeds';
import { isImageUrl as checkIsImageUrl } from '@/lib/constants/images';
import { categorizeArticle } from '@/lib/utils';

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'DroneWire/1.0 (Counter-UAS Intelligence Hub)',
  },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['media:group', 'media:group'],
      ['itunes:image', 'itunes:image'],
      ['content:encoded', 'content:encoded'],
    ],
  },
});

export interface ScrapingResult {
  feedsProcessed: number;
  articlesAdded: number;
  articlesSkipped: number;
  errors: Array<{ feed: string; error: string }>;
}

interface RssFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  isoDate?: string;
  // Standard image fields
  enclosure?: { url?: string; type?: string };
  image?: { url?: string };
  // Media RSS namespace fields
  'media:content'?: { $?: { url?: string; medium?: string } };
  'media:thumbnail'?: { $?: { url?: string } };
  'media:group'?: { 'media:content'?: Array<{ $?: { url?: string } }> };
  'itunes:image'?: { $?: { href?: string } };
  // Content fields that may contain images
  'content:encoded'?: string;
}

function extractImageUrl(item: RssFeedItem): string | null {
  // 1. Standard enclosure (most common for images)
  if (item.enclosure?.url && checkIsImageUrl(item.enclosure.url)) {
    return item.enclosure.url;
  }

  // 2. Media RSS content
  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url;
  }

  // 3. Media thumbnail (common in news feeds)
  if (item['media:thumbnail']?.$?.url) {
    return item['media:thumbnail'].$.url;
  }

  // 4. Media group (multiple media items - take first)
  const mediaGroup = item['media:group']?.['media:content'];
  if (Array.isArray(mediaGroup) && mediaGroup[0]?.$?.url) {
    return mediaGroup[0].$.url;
  }

  // 5. iTunes image (podcast-style feeds)
  if (item['itunes:image']?.$?.href) {
    return item['itunes:image'].$.href;
  }

  // 6. Direct image element
  if (item.image?.url) {
    return item.image.url;
  }

  // 7. Extract from HTML content (last resort)
  const htmlContent = item['content:encoded'] || item.content || '';
  if (htmlContent) {
    const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1] && checkIsImageUrl(imgMatch[1])) {
      return imgMatch[1];
    }
  }

  return null;
}

function estimateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Splits an array into batches of at most `limit` items.
 * Pure helper — exported for unit testing.
 */
export function chunkArray<T>(items: T[], limit: number): T[][] {
  if (limit < 1) throw new Error('chunkArray limit must be >= 1');
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += limit) {
    chunks.push(items.slice(i, i + limit));
  }
  return chunks;
}

// Maximum number of feeds fetched/parsed concurrently.
export const FEED_CONCURRENCY = 5;

export async function scrapeRssFeeds(): Promise<ScrapingResult> {
  const result: ScrapingResult = {
    feedsProcessed: 0,
    articlesAdded: 0,
    articlesSkipped: 0,
    errors: [],
  };

  // Get all active RSS feeds
  const feeds = await prisma.rssFeed.findMany({
    where: { isActive: true },
  });

  if (feeds.length === 0) {
    logger.info('No active RSS feeds found');
    return result;
  }

  // Phase 1: Fetch and parse all feeds concurrently in limited-size batches.
  // Network I/O is parallelized; DB processing is deferred to Phase 2 (serial)
  // to avoid duplicate-insert races on Article.sourceUrl (which is NOT unique).
  type FeedParseResult = {
    feed: (typeof feeds)[number];
  } & (
    | { status: 'fulfilled'; items: RssFeedItem[] }
    | { status: 'rejected'; error: string }
  );

  const parseResults: FeedParseResult[] = [];

  const batches = chunkArray(feeds, FEED_CONCURRENCY);
  for (const batch of batches) {
    const settled = await Promise.allSettled(
      batch.map(async (feed) => {
        logger.debug(`Scraping feed: ${feed.name} (${feed.url})`);
        const parsed = await parser.parseURL(feed.url);
        return { feed, items: parsed.items as RssFeedItem[] };
      }),
    );

    for (let i = 0; i < settled.length; i++) {
      const feed = batch[i];
      const outcome = settled[i];
      if (outcome.status === 'fulfilled') {
        parseResults.push({ status: 'fulfilled', ...outcome.value });
      } else {
        const errorMessage =
          outcome.reason instanceof Error
            ? outcome.reason.message
            : 'Unknown error';
        parseResults.push({ status: 'rejected', feed, error: errorMessage });
      }
    }
  }

  async function recordFeedFailure(
    feed: (typeof feeds)[number],
    errorMessage: string,
    phase: 'scraping' | 'processing',
  ) {
    logger.error(`Error ${phase} ${feed.name}: ${errorMessage}`);
    result.errors.push({ feed: feed.name, error: errorMessage });

    const updatedFeed = await prisma.rssFeed.update({
      where: { id: feed.id },
      data: {
        lastChecked: new Date(),
        errorCount: { increment: 1 },
      },
    });

    if (updatedFeed.errorCount >= 5) {
      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: { isActive: false },
      });
      logger.warn(`Disabled feed ${feed.name} due to repeated errors`);
    }
  }

  // Phase 2: Process parse outcomes serially in original feed order. Article
  // writes stay serial so two feeds cannot race the existing
  // findFirst→create dedupe check on the non-unique sourceUrl column.
  for (const parseResult of parseResults) {
    const { feed } = parseResult;

    if (parseResult.status === 'rejected') {
      await recordFeedFailure(feed, parseResult.error, 'scraping');
      continue;
    }

    try {
      result.feedsProcessed++;

      for (const item of parseResult.items) {
        // Skip if no title or link
        if (!item.title || !item.link) {
          continue;
        }

        const textContent = `${item.title} ${item.contentSnippet || item.content || ''}`;

        // Check if relevant to counter-UAS topics
        if (!isRelevantContent(textContent)) {
          result.articlesSkipped++;
          continue;
        }

        // Check if article already exists (by source URL)
        const existingArticle = await prisma.article.findFirst({
          where: { sourceUrl: item.link },
        });

        if (existingArticle) {
          result.articlesSkipped++;
          continue;
        }

        // Parse publish date
        const publishedAt = item.isoDate || item.pubDate
          ? new Date(item.isoDate || item.pubDate!)
          : new Date();

        // Create the article
        await prisma.article.create({
          data: {
            title: item.title,
            excerpt: item.contentSnippet?.slice(0, 500) || null,
            content: item.content || null,
            sourceUrl: item.link,
            sourceName: feed.name,
            publishedAt,
            imageUrl: extractImageUrl(item),
            category: categorizeArticle(item.title, textContent),
            status: 'pending_ai', // Will be processed by AI later
            views: 0,
          },
        });

        result.articlesAdded++;
        logger.debug(`Added article: ${item.title.slice(0, 50)}...`);
      }

      // Update feed success status
      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: {
          lastChecked: new Date(),
          lastSuccess: new Date(),
          errorCount: 0,
        },
      });
    } catch (error) {
      // Defensive: if per-feed DB processing throws after a successful parse,
      // record it as an error and update the feed's error status.
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await recordFeedFailure(feed, errorMessage, 'processing');
    }
  }

  return result;
}

// Get pending articles that need AI processing
export async function getPendingArticles(limit: number = 10) {
  return prisma.article.findMany({
    where: {
      OR: [
        { status: 'pending_ai' },
        { aiSummary: null, status: 'published' },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}
