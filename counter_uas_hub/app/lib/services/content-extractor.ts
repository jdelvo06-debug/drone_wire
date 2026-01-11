import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

interface ContentSelectors {
  article: string;
  image?: string;
  removeSelectors?: string[];
}

// Site-specific content selectors
const SITE_SELECTORS: Record<string, ContentSelectors> = {
  'defensenews.com': {
    article: 'article .article-body, .article-content',
    image: '.article-header img, .featured-image img',
    removeSelectors: ['.ad', '.related-content', '.newsletter-signup'],
  },
  'breakingdefense.com': {
    article: '.post-content, .entry-content',
    image: '.featured-image img, .post-thumbnail img',
    removeSelectors: ['.ad-container', '.related-posts'],
  },
  'defenseone.com': {
    article: '.content-body, article',
    image: '.lead-image img',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'militarytimes.com': {
    article: '.article-body, .story-content',
    image: '.article-image img',
    removeSelectors: ['.advertisement', '.related'],
  },
  'thedrive.com': {
    article: '.post-content, article',
    image: '.featured-image img',
    removeSelectors: ['.ad', '.newsletter'],
  },
  'dronelife.com': {
    article: '.entry-content, article',
    image: '.post-thumbnail img',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'suasnews.com': {
    article: '.entry-content',
    image: '.post-thumbnail img',
    removeSelectors: ['.ad-container'],
  },
  'c4isrnet.com': {
    article: '.article-body',
    image: '.article-header img',
    removeSelectors: ['.ad', '.related-content'],
  },
};

const DEFAULT_SELECTORS: ContentSelectors = {
  article: 'article, .post-content, .entry-content, .article-content, main',
  image: 'article img, .featured-image img, .post-thumbnail img',
  removeSelectors: [
    'script',
    'style',
    'nav',
    'footer',
    'header',
    '.ad',
    '.advertisement',
    '.sidebar',
    '.comments',
    '.share-buttons',
    '.related-posts',
    '.newsletter-signup',
  ],
};

function getDomainFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. prefix if present
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getSelectorsForUrl(url: string): ContentSelectors {
  const domain = getDomainFromUrl(url);

  // Check for matching site selectors
  for (const [siteDomain, selectors] of Object.entries(SITE_SELECTORS)) {
    if (domain.includes(siteDomain)) {
      return selectors;
    }
  }

  return DEFAULT_SELECTORS;
}

export interface ExtractedContent {
  content: string;
  imageUrl: string | null;
  wordCount: number;
}

export async function extractContentFromUrl(url: string): Promise<ExtractedContent | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DroneWire/1.0; +https://dronewire.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      timeout: 15000,
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const selectors = getSelectorsForUrl(url);

    // Remove unwanted elements
    const removeSelectors = selectors.removeSelectors || DEFAULT_SELECTORS.removeSelectors;
    removeSelectors?.forEach((selector) => $(selector).remove());

    // Extract main content
    const articleElement = $(selectors.article);
    let content = '';

    if (articleElement.length > 0) {
      // Get text content, preserving paragraph structure
      content = articleElement
        .find('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 0)
        .join('\n\n');
    }

    // Fallback: get all paragraph text if article selector didn't work
    if (!content || content.length < 200) {
      content = $('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 50) // Filter out short paragraphs (likely navigation)
        .slice(0, 20) // Limit paragraphs
        .join('\n\n');
    }

    // Extract image
    let imageUrl: string | null = null;
    const imageSelector = selectors.image || DEFAULT_SELECTORS.image;
    const imgElement = $(imageSelector!).first();

    if (imgElement.length > 0) {
      imageUrl = imgElement.attr('src') || imgElement.attr('data-src') || null;

      // Make relative URLs absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        const baseUrl = new URL(url);
        imageUrl = new URL(imageUrl, baseUrl.origin).toString();
      }
    }

    // Also check OpenGraph image
    if (!imageUrl) {
      imageUrl = $('meta[property="og:image"]').attr('content') || null;
    }

    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;

    return {
      content: content.slice(0, 50000), // Limit content size
      imageUrl,
      wordCount,
    };
  } catch (error) {
    console.error(`Error extracting content from ${url}:`, error);
    return null;
  }
}

// Estimate read time in minutes
export function estimateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
