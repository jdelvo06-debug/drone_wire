import * as cheerio from 'cheerio';
import { logger } from '@/lib/logger';
// Using native fetch (Node.js 20+)

interface ContentSelectors {
  article: string;
  image?: string;
  removeSelectors?: string[];
}

// Site-specific content selectors
const SITE_SELECTORS: Record<string, ContentSelectors> = {
  // Major Defense News Sites
  'defensenews.com': {
    article: 'article .article-body, .article-content',
    image: '.article-header img, .featured-image img, [data-testid="featured-image"] img',
    removeSelectors: ['.ad', '.related-content', '.newsletter-signup'],
  },
  'breakingdefense.com': {
    article: '.post-content, .entry-content',
    image: '.featured-image img, .post-thumbnail img, .wp-post-image',
    removeSelectors: ['.ad-container', '.related-posts'],
  },
  'defenseone.com': {
    article: '.content-body, article',
    image: '.lead-image img, .hero-image img',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'militarytimes.com': {
    article: '.article-body, .story-content',
    image: '.article-image img, .featured-media img',
    removeSelectors: ['.advertisement', '.related'],
  },
  'thedrive.com': {
    article: '.post-content, article',
    image: '.featured-image img, .hero img',
    removeSelectors: ['.ad', '.newsletter'],
  },
  'dronelife.com': {
    article: '.entry-content, article',
    image: '.post-thumbnail img, .wp-post-image',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'suasnews.com': {
    article: '.entry-content',
    image: '.post-thumbnail img, .wp-post-image',
    removeSelectors: ['.ad-container'],
  },
  'c4isrnet.com': {
    article: '.article-body',
    image: '.article-header img, .featured-image img',
    removeSelectors: ['.ad', '.related-content'],
  },
  // Additional News Sources
  'reuters.com': {
    article: '[data-testid="article-body"], .article-body-text, .StandardArticleBody_body',
    image: '[data-testid="lead-image"] img, .LeadImage img, .ArticleLead img',
    removeSelectors: ['.ad-slot', '.related-topics'],
  },
  'apnews.com': {
    article: '.RichTextStoryBody, .Article, .story-body',
    image: '.LeadFeature img, .Figure img, .lead-media img',
    removeSelectors: ['.Advertisement'],
  },
  'janes.com': {
    article: '.article-content, .story-body, .article-body',
    image: '.article-image img, .lead-image img, .hero-image img',
    removeSelectors: ['.ad', '.promo'],
  },
  'defensescoop.com': {
    article: '.article-content, .post-body, .entry-content',
    image: '.featured-image img, .wp-post-image',
    removeSelectors: ['.ad', '.newsletter'],
  },
  'nationaldefensemagazine.org': {
    article: '.article-body, .content-area, .entry-content',
    image: '.article-featured-image img, .featured-image img',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'armyrecognition.com': {
    article: '.article-content, .entry-content',
    image: '.article-image img, .main-image img',
    removeSelectors: ['.ad'],
  },
  'airforcemag.com': {
    article: '.entry-content, .article-content',
    image: '.featured-image img, .wp-post-image',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'bbc.com': {
    article: '[data-component="text-block"], article',
    image: '[data-component="image-block"] img, .ssrcss-evoj7m-Image img',
    removeSelectors: ['.ssrcss-3xpbzf-PromoContent'],
  },
  'cnn.com': {
    article: '.article__content, .zn-body__paragraph',
    image: '.image__container img, .l-container img',
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

function isValidImageUrl(url: string): boolean {
  // Skip tracking pixels, icons, logos, and other small images
  const skipPatterns = [
    /1x1/i,
    /pixel/i,
    /tracking/i,
    /spacer/i,
    /blank\./i,
    /transparent/i,
    /icon/i,
    /logo/i,
    /avatar/i,
    /badge/i,
    /button/i,
    /share/i,
    /social/i,
    /\.gif$/i, // Skip most GIFs (often tracking/animated)
  ];

  if (skipPatterns.some((pattern) => pattern.test(url))) {
    return false;
  }

  // Ensure it's a valid URL
  try {
    new URL(url);
    return true;
  } catch {
    return false;
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
    // Use AbortController for timeout with native fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DroneWire/1.0; +https://dronewire.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      logger.error(`Failed to fetch ${url}: ${response.status}`);
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

    // Extract image - enhanced logic with multiple fallbacks
    let imageUrl: string | null = null;

    // 1. Try site-specific selector
    const imageSelector = selectors.image || DEFAULT_SELECTORS.image;
    const imgElement = $(imageSelector!).first();
    if (imgElement.length > 0) {
      imageUrl =
        imgElement.attr('src') ||
        imgElement.attr('data-src') ||
        imgElement.attr('data-lazy-src') ||
        imgElement.attr('data-original') ||
        null;
    }

    // 2. Try OpenGraph image (most reliable for articles)
    if (!imageUrl) {
      imageUrl =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[property="og:image:url"]').attr('content') ||
        null;
    }

    // 3. Try Twitter card image
    if (!imageUrl) {
      imageUrl =
        $('meta[name="twitter:image"]').attr('content') ||
        $('meta[name="twitter:image:src"]').attr('content') ||
        null;
    }

    // 4. Try schema.org JSON-LD image
    if (!imageUrl) {
      const schemaScript = $('script[type="application/ld+json"]').first().html();
      if (schemaScript) {
        try {
          const schema = JSON.parse(schemaScript);
          const schemaImage = schema.image?.url || schema.image || schema.thumbnailUrl;
          if (typeof schemaImage === 'string') {
            imageUrl = schemaImage;
          } else if (Array.isArray(schemaImage) && schemaImage[0]) {
            imageUrl = typeof schemaImage[0] === 'string' ? schemaImage[0] : schemaImage[0].url;
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    }

    // 5. Fallback: first large image in article
    if (!imageUrl && articleElement.length > 0) {
      const articleImg = articleElement
        .find('img')
        .filter((_, el) => {
          const $el = $(el);
          const width = parseInt($el.attr('width') || '0', 10);
          const height = parseInt($el.attr('height') || '0', 10);
          const src = $el.attr('src') || '';
          // Only consider reasonably sized images, skip icons/logos
          const isLargeEnough = width >= 200 || height >= 150 || (!width && !height);
          const isNotIcon = !/(icon|logo|avatar|badge|button|1x1|pixel)/i.test(src);
          return isLargeEnough && isNotIcon;
        })
        .first();

      if (articleImg.length > 0) {
        imageUrl = articleImg.attr('src') || articleImg.attr('data-src') || null;
      }
    }

    // Make relative URLs absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        imageUrl = new URL(imageUrl, baseUrl.origin).toString();
      } catch {
        imageUrl = null;
      }
    }

    // Validate image URL
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      imageUrl = null;
    }

    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;

    return {
      content: content.slice(0, 50000), // Limit content size
      imageUrl,
      wordCount,
    };
  } catch (error) {
    logger.error(`Error extracting content from ${url}:`, error);
    return null;
  }
}

// Estimate read time in minutes
export function estimateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
