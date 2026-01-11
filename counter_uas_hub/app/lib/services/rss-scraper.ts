import Parser from 'rss-parser';
import { prisma } from '@/lib/db';
import { isRelevantContent } from '@/lib/constants/rss-feeds';

const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'DroneWire/1.0 (Counter-UAS Intelligence Hub)',
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
  enclosure?: { url?: string };
  'media:content'?: { $?: { url?: string } };
}

function extractImageUrl(item: RssFeedItem): string | null {
  // Try various common RSS image fields
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url;
  }
  return null;
}

function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();

  if (text.includes('contract') || text.includes('award') || text.includes('procurement')) {
    return 'contracts';
  }
  if (text.includes('counter-uas') || text.includes('counter-drone') || text.includes('c-uas')) {
    return 'counter-uas';
  }
  if (text.includes('policy') || text.includes('regulation') || text.includes('legislation')) {
    return 'policy';
  }
  if (text.includes('drone') || text.includes('uav') || text.includes('unmanned')) {
    return 'drone-warfare';
  }
  return 'general';
}

function estimateReadTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

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
    console.log('No active RSS feeds found');
    return result;
  }

  for (const feed of feeds) {
    try {
      console.log(`Scraping feed: ${feed.name} (${feed.url})`);
      const parsed = await parser.parseURL(feed.url);
      result.feedsProcessed++;

      for (const item of parsed.items as RssFeedItem[]) {
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
        console.log(`Added article: ${item.title.slice(0, 50)}...`);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error scraping ${feed.name}: ${errorMessage}`);
      result.errors.push({ feed: feed.name, error: errorMessage });

      // Update feed error status
      await prisma.rssFeed.update({
        where: { id: feed.id },
        data: {
          lastChecked: new Date(),
          errorCount: { increment: 1 },
        },
      });

      // Disable feeds with too many errors
      if (feed.errorCount >= 5) {
        await prisma.rssFeed.update({
          where: { id: feed.id },
          data: { isActive: false },
        });
        console.log(`Disabled feed ${feed.name} due to repeated errors`);
      }
    }

    // Small delay between feeds to be respectful
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
