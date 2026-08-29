import * as cheerio from 'cheerio';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { request as requestHttp } from 'node:http';
import { request as requestHttps } from 'node:https';
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
    article: '.post-single__content, .post-single__article, .post-content, .entry-content',
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
  'twz.com': {
    article: '.entry-content.Article-bodyText, .featured-template-content',
    image: '.article-featured-image img, .featured-template-post img',
    removeSelectors: ['.pp-notice', '.related-posts', '.post-content'],
  },
  'dronelife.com': {
    article: '.entry-content, article',
    image: '.post-thumbnail img, .wp-post-image',
    removeSelectors: ['.ad', '.sidebar'],
  },
  'suasnews.com': {
    article: '.the_content, .entry-content',
    image: '.post-thumbnail img, .wp-post-image',
    removeSelectors: ['.ad-container'],
  },
  'c4isrnet.com': {
    article: '.c-articleBody, .o-articleBody, .article-body',
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
  'route-fifty.com': {
    article: '.content-body.wysiwyg',
    image: '.content-image img',
    removeSelectors: ['.privacy-modal', '.interstitial-ad-body', '.js-article-top-ad'],
  },
  'defence-blog.com': {
    article: '.tdb_single_content, .td-post-content',
    image: '.tdb_single_featured_image img, .entry-thumb',
    removeSelectors: ['.db-ad--inarticle', '.post-summary-box', '.td-post-sharing'],
  },
  'calcalistech.com': {
    article: '.public-DraftEditor-content',
    image: '.firstImageInArticle img, .ArticleImageComponenta img',
    removeSelectors: ['.taboola-below-article-thumbnails'],
  },
  'strategicstudyindia.com': {
    article: '.post-body.entry-content',
    image: '.post-body.entry-content img',
    removeSelectors: ['.post-footer', '.comments'],
  },
  'spendergast.blogspot.com': {
    article: '.post-body.entry-content',
    image: '.post-body.entry-content img',
    removeSelectors: ['.post-footer', '.comments'],
  },
  'worldfutureawards.com': {
    article: '.sws-content',
    image: '.post-image img, .sws-content img',
    removeSelectors: ['.sws-more-posts', '.subscription-block-content'],
  },
  'visionofhumanity.org': {
    article: '.block-paragraph-content',
    image: '.news-article-detail img, .post-thumbnail img',
    removeSelectors: ['.related-posts', '.speaker-content'],
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
    'aside',
    '[class*="cookie-banner"]',
    '[class*="cookie-consent"]',
    '[id*="cookie-banner"]',
    '[id*="cookie-consent"]',
    '[class*="privacy-modal"]',
    '[class*="privacy-notice"]',
    '[class*="subscription"]',
    '[class*="subscribe"]',
    '[class*="newsletter"]',
    '[class*="interstitial-ad"]',
    '[class*="ad-container"]',
    '[class*="ad-wrapper"]',
    '[class*="related-content"]',
    '[class*="recommended-content"]',
    '[aria-label*="cookie" i]',
  ],
};

const MAX_RESPONSE_BYTES = 2_000_000;
const MAX_REDIRECTS = 3;

function isPrivateAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^\[|\]$/g, '');
  if (normalized.includes(':')) {
    // Only ordinary global-unicast IPv6 addresses are valid fetch targets.
    // This also blocks IPv4-compatible/mapped forms that can otherwise encode
    // loopback or cloud-metadata addresses in hexadecimal notation.
    const firstHextet = Number.parseInt(normalized.split(':')[0] || '0', 16);
    if (!Number.isFinite(firstHextet) || firstHextet < 0x2000 || firstHextet > 0x3fff) {
      return true;
    }
    return (
      normalized.startsWith('2001:0:') ||
      normalized.startsWith('2001:0000:') ||
      normalized.startsWith('2001:db8:') ||
      normalized.startsWith('2002:')
    );
  }

  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export async function isSafeExternalUrl(value: string): Promise<boolean> {
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (url.username || url.password) return false;

    const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
    if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost')) return false;

    if (isIP(hostname)) return !isPrivateAddress(hostname);

    const addresses = await lookup(hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every(({ address }) => !isPrivateAddress(address));
  } catch {
    return false;
  }
}

async function resolvePinnedAddress(url: URL): Promise<{ address: string; family: 4 | 6 } | null> {
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost')) return null;
  const literalFamily = isIP(hostname);
  if (literalFamily) return isPrivateAddress(hostname) ? null : { address: hostname, family: literalFamily as 4 | 6 };
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) return null;
  const selected = addresses[0];
  return { address: selected.address, family: selected.family as 4 | 6 };
}

export async function fetchPinnedExternal(
  value: string,
  options: { method?: 'GET' | 'HEAD'; headers?: Record<string, string>; signal?: AbortSignal } = {},
): Promise<Response | null> {
  let url: URL;
  try {
    url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
  } catch {
    return null;
  }
  const pinned = await resolvePinnedAddress(url);
  if (!pinned) return null;

  return new Promise<Response>((resolve, reject) => {
    const request = (url.protocol === 'https:' ? requestHttps : requestHttp)({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || undefined,
      path: `${url.pathname}${url.search}`,
      method: options.method || 'GET',
      headers: options.headers,
      signal: options.signal,
      lookup: (_hostname, _options, callback) => {
        if (typeof _options === 'object' && _options && 'all' in _options && _options.all) {
          const pinnedAllCallback = callback as unknown as (error: null, addresses: Array<{ address: string; family: number }>) => void;
          pinnedAllCallback(null, [pinned]);
        } else {
          const pinnedCallback = callback as unknown as (error: null, address: string, family: number) => void;
          pinnedCallback(null, pinned.address, pinned.family);
        }
      },
      ...(url.protocol === 'https:' ? { servername: url.hostname } : {}),
    }, (incoming) => {
      const chunks: Buffer[] = [];
      let total = 0;
      incoming.on('data', (chunk: Buffer) => {
        total += chunk.length;
        if (total > MAX_RESPONSE_BYTES) {
          request.destroy(new Error('Response body exceeds maximum size'));
          return;
        }
        chunks.push(chunk);
      });
      incoming.on('end', () => {
        const headers = new Headers();
        for (const [name, rawValue] of Object.entries(incoming.headers)) {
          if (Array.isArray(rawValue)) rawValue.forEach((entry) => headers.append(name, entry));
          else if (rawValue !== undefined) headers.set(name, String(rawValue));
        }
        resolve(new Response(options.method === 'HEAD' ? null : Buffer.concat(chunks), {
          status: incoming.statusCode || 500,
          statusText: incoming.statusMessage,
          headers,
        }));
      });
      incoming.on('error', reject);
    });
    request.on('error', reject);
    request.end();
  });
}

async function readLimitedText(response: Response): Promise<string> {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
    throw new Error('Response body exceeds maximum size');
  }
  if (!response.body) return '';

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error('Response body exceeds maximum size');
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(combined);
}

async function fetchExternalHtml(
  initialUrl: string,
  signal: AbortSignal,
): Promise<{ response: Response; finalUrl: string } | null> {
  let currentUrl = initialUrl;
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const response = await fetchPinnedExternal(currentUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DroneWire/1.0; +https://dronewire.org)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal,
    });
    if (!response) return null;

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, finalUrl: currentUrl };
    }
    const location = response.headers.get('location');
    if (!location || redirectCount === MAX_REDIRECTS) return null;
    currentUrl = new URL(location, currentUrl).toString();
  }
  return null;
}

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
    if (domain === siteDomain || domain.endsWith(`.${siteDomain}`)) {
      return selectors;
    }
  }

  return DEFAULT_SELECTORS;
}

export type ExtractionQuality =
  | 'clean'
  | 'missing-content'
  | 'debris-contaminated'
  | 'manual-review-required';

export type ImageQuality = 'usable' | 'missing' | 'rejected' | 'manual-review-required';
export type ExtractionMethod =
  | 'structured-data'
  | 'site-selector'
  | 'semantic-selector'
  | 'generic-main-selector'
  | 'paragraph-fallback'
  | 'none';

export interface ExtractedContent {
  content: string;
  imageUrl: string | null;
  wordCount: number;
  quality: ExtractionQuality;
  qualityReasons: string[];
  extractionMethod: ExtractionMethod;
  imageQuality: ImageQuality;
  imageReasons: string[];
}

const MIN_CLEAN_WORDS = 150;
const DEBRIS_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'cookie-controls', pattern: /\b(?:accept (?:all )?cookies|cookie (?:preferences|policy|settings))\b/i },
  { label: 'newsletter-prompt', pattern: /\b(?:sign up (?:for|to)|subscribe (?:to|for)) (?:our|the)\b/i },
  { label: 'copyright-footer', pattern: /\ball rights reserved\b/i },
  { label: 'privacy-footer', pattern: /\bprivacy policy\b/i },
  { label: 'related-content', pattern: /\brelated (?:articles|stories|content)\b/i },
  { label: 'advertisement', pattern: /\badvertisement\b/i },
  { label: 'skip-navigation', pattern: /\bskip to (?:content|navigation)\b/i },
  { label: 'embedded-instructions', pattern: /\b(?:ignore (?:all |any )?(?:previous|prior) instructions|system prompt|assistant\s*:|respond (?:only |with )?(?:in|using|with))\b/i },
];
const DEBRIS_CONTAINER_SELECTOR = [
  'footer',
  '.newsletter-signup',
  '[class*="cookie-banner"]',
  '[class*="cookie-consent"]',
  '[id*="cookie-banner"]',
  '[id*="cookie-consent"]',
  '[class*="privacy-modal"]',
  '[class*="privacy-notice"]',
  '[class*="subscription"]',
  '[class*="subscribe"]',
  '[class*="newsletter"]',
  '[class*="interstitial-ad"]',
  '[class*="ad-container"]',
  '[class*="ad-wrapper"]',
  '[class*="related-content"]',
  '[class*="recommended-content"]',
].join(', ');

function wordCount(value: string): number {
  return value.split(/\s+/).filter(Boolean).length;
}

function normalizeExtractedText(value: string): string {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function debrisLabels(value: string): string[] {
  return DEBRIS_PATTERNS.filter(({ pattern }) => pattern.test(value)).map(({ label }) => label);
}

function shouldRemoveDebrisParagraph(value: string): boolean {
  const labels = debrisLabels(value);
  if (labels.length === 0) return false;
  return wordCount(value) <= 80 || /^(?:accept|manage|sign up|subscribe|all rights|privacy|related|advertisement|skip to)\b/i.test(value.trim());
}

function jsonLdObjects(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) return value.flatMap(jsonLdObjects);
  if (!value || typeof value !== 'object') return [];
  const object = value as Record<string, unknown>;
  return [object, ...jsonLdObjects(object['@graph'])];
}

function structuredUrlValues(entry: Record<string, unknown>): string[] {
  const values: string[] = [];
  for (const candidate of [entry.url, entry.mainEntityOfPage]) {
    if (typeof candidate === 'string') values.push(candidate);
    if (candidate && typeof candidate === 'object') {
      const object = candidate as Record<string, unknown>;
      for (const value of [object.url, object['@id']]) {
        if (typeof value === 'string') values.push(value);
      }
    }
  }
  return values;
}

function urlsIdentifySamePage(candidate: string, requested: string): boolean {
  try {
    const left = new URL(candidate, requested);
    const right = new URL(requested);
    const normalizePath = (value: string) => value.replace(/\/+$/, '') || '/';
    const canonicalQuery = (value: URL) => {
      const params = new URLSearchParams(value.search);
      for (const key of Array.from(params.keys())) {
        if (/^utm_/i.test(key) || /^(?:fbclid|gclid)$/i.test(key)) params.delete(key);
      }
      params.sort();
      return params.toString();
    };
    return left.hostname.replace(/^www\./, '') === right.hostname.replace(/^www\./, '')
      && left.port === right.port
      && normalizePath(left.pathname) === normalizePath(right.pathname)
      && canonicalQuery(left) === canonicalQuery(right);
  } catch {
    return false;
  }
}

function structuredArticleData($: ReturnType<typeof cheerio.load>, url: string): Array<Record<string, unknown>> {
  const articles = $('script[type="application/ld+json"]').map((_, script) => {
    try {
      return jsonLdObjects(JSON.parse($(script).html() || 'null'));
    } catch {
      return [];
    }
  }).get().flat().filter((entry) => {
    const rawType = entry['@type'];
    const types = Array.isArray(rawType) ? rawType : [rawType];
    return types.some((type) => typeof type === 'string' && /^(?:News)?Article$|^Report$/i.test(type));
  });
  const withBodies = articles.filter((entry) => typeof entry.articleBody === 'string' && entry.articleBody.trim());
  const matching = withBodies.filter((entry) => structuredUrlValues(entry).some((candidate) => urlsIdentifySamePage(candidate, url)));
  if (matching.length > 0) return matching;
  if (withBodies.length === 1 && structuredUrlValues(withBodies[0]).length === 0) return withBodies;
  return [];
}

function structuredImageValue(entry: Record<string, unknown>): string | null {
  const candidates = [entry.image, entry.thumbnailUrl].flatMap((candidate) => Array.isArray(candidate) ? candidate : [candidate]);
  for (const candidate of candidates) {
    if (typeof candidate === 'string') return candidate;
    if (candidate && typeof candidate === 'object') {
      const url = (candidate as Record<string, unknown>).url;
      if (typeof url === 'string') return url;
    }
  }
  return null;
}

function imageCandidateIsEditorial(value: string): boolean {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return false;
    const path = `${parsed.pathname}${parsed.search}`;
    return !/(?:^|[\/_\-.])(?:1x1|pixel|tracking|spacer|blank|transparent|icon|logo|avatar|badge|button|share|social|favicon|sprite|emoji|placeholder|default[-_]?image|advert|banner)(?:[\/_\-.]|$)|\.gif(?:$|\?)/i.test(path);
  } catch {
    return false;
  }
}

function missingResult(reason: string): ExtractedContent {
  return {
    content: '',
    imageUrl: null,
    wordCount: 0,
    quality: 'missing-content',
    qualityReasons: [reason],
    extractionMethod: 'none',
    imageQuality: 'missing',
    imageReasons: ['missing-image'],
  };
}

export function extractContentFromHtml(html: string, url: string): ExtractedContent {
  const $ = cheerio.load(html);
  const selectors = getSelectorsForUrl(url);
  const siteSpecific = selectors !== DEFAULT_SELECTORS;
  const structuredArticles = structuredArticleData($, url);
  const structuredBody = structuredArticles
    .map((entry) => typeof entry.articleBody === 'string' ? normalizeExtractedText(entry.articleBody) : '')
    .sort((a, b) => b.length - a.length)[0] || '';

  type ImageCandidateSource = 'site-selector' | 'open-graph' | 'twitter-card' | 'structured-data' | 'generic-dom';
  const rawImageCandidates: Array<{ value: string | null | undefined; source: ImageCandidateSource }> = [];
  const metadataCandidates: Array<{ value: string | null | undefined; source: ImageCandidateSource }> = [
    { value: $('meta[property="og:image"]').attr('content'), source: 'open-graph' },
    { value: $('meta[property="og:image:url"]').attr('content'), source: 'open-graph' },
    { value: $('meta[name="twitter:image"]').attr('content'), source: 'twitter-card' },
    { value: $('meta[name="twitter:image:src"]').attr('content'), source: 'twitter-card' },
    ...structuredArticles.map((entry) => ({ value: structuredImageValue(entry), source: 'structured-data' as const })),
  ];
  if (!siteSpecific) rawImageCandidates.push(...metadataCandidates);
  const imageSelector = selectors.image || DEFAULT_SELECTORS.image || '';
  for (const selector of imageSelector.split(',').map((value) => value.trim()).filter(Boolean)) {
    const image = $(selector).first();
    if (!image.length) continue;
    const width = Number.parseInt(image.attr('width') || '0', 10);
    const height = Number.parseInt(image.attr('height') || '0', 10);
    if (width > 0 && height > 0 && width < 200 && height < 150) continue;
    const source: ImageCandidateSource = siteSpecific ? 'site-selector' : 'generic-dom';
    rawImageCandidates.push(
      { value: image.attr('src'), source },
      { value: image.attr('data-src'), source },
      { value: image.attr('data-lazy-src'), source },
      { value: image.attr('data-original'), source },
    );
  }
  if (siteSpecific) rawImageCandidates.push(...metadataCandidates);

  const normalizedImageCandidates = rawImageCandidates.filter((candidate) => Boolean(candidate.value)).map((candidate) => {
    try {
      return { url: new URL(candidate.value!, url).toString(), source: candidate.source };
    } catch {
      return null;
    }
  }).filter((candidate): candidate is { url: string; source: ImageCandidateSource } => Boolean(candidate));
  const selectedImage = normalizedImageCandidates.find((candidate) => imageCandidateIsEditorial(candidate.url)) || null;
  const imageUrl = selectedImage?.url || null;
  const hadRejectedImage = normalizedImageCandidates.length > 0 && !selectedImage;
  const imageNeedsEditorialReview = selectedImage?.source === 'generic-dom';

  const hadDebrisContainers = $(DEBRIS_CONTAINER_SELECTOR).length > 0;
  const removeSelectors = Array.from(new Set([
    ...(DEFAULT_SELECTORS.removeSelectors || []),
    ...(selectors.removeSelectors || []),
  ]));
  removeSelectors.forEach((selector) => $(selector).remove());

  let content = structuredBody;
  let extractionMethod: ExtractionMethod = structuredBody ? 'structured-data' : 'none';
  let removedDebrisParagraph = false;

  if (!content) {
    const candidateSelectors = selectors.article.split(',').map((selector) => selector.trim()).filter(Boolean);
    let bestCandidate = '';
    let bestSelector = '';
    for (const selector of candidateSelectors) {
      const root = $(selector).first();
      if (!root.length) continue;
      const paragraphValues = root.find('p').map((_, paragraph) => normalizeExtractedText($(paragraph).text())).get().filter(Boolean);
      const keptParagraphs = paragraphValues.filter((paragraph) => {
        const remove = shouldRemoveDebrisParagraph(paragraph);
        removedDebrisParagraph ||= remove;
        return !remove;
      });
      let candidate = normalizeExtractedText(keptParagraphs.join('\n\n'));
      if (wordCount(candidate) < 50 && siteSpecific) {
        const clone = root.clone();
        clone.find('br').replaceWith('\n');
        clone.find('div, li, blockquote, h2, h3, h4').each((_, element) => {
          $(element).append('\n');
        });
        candidate = normalizeExtractedText(clone.text());
      }
      if (candidate.length > bestCandidate.length) {
        bestCandidate = candidate;
        bestSelector = selector;
      }
      if (wordCount(candidate) >= MIN_CLEAN_WORDS) break;
    }
    content = bestCandidate;
    if (content) {
      extractionMethod = siteSpecific
        ? 'site-selector'
        : bestSelector === 'main'
          ? 'generic-main-selector'
          : 'semantic-selector';
    }
  }

  if (wordCount(content) < 50) {
    const paragraphValues = $('p').map((_, paragraph) => normalizeExtractedText($(paragraph).text())).get().filter((paragraph) => paragraph.length > 50);
    const keptParagraphs = paragraphValues.filter((paragraph) => {
      const remove = shouldRemoveDebrisParagraph(paragraph);
      removedDebrisParagraph ||= remove;
      return !remove;
    });
    const fallback = normalizeExtractedText(keptParagraphs.slice(0, 30).join('\n\n'));
    if (fallback.length > content.length) {
      content = fallback;
      extractionMethod = 'paragraph-fallback';
    }
  }

  content = content.slice(0, 50_000);
  const extractedWordCount = wordCount(content);
  const residualDebris = debrisLabels(content);
  const qualityReasons: string[] = [];
  if (hadDebrisContainers || removedDebrisParagraph) qualityReasons.push('debris-removed');

  let quality: ExtractionQuality;
  if (extractedWordCount === 0) {
    quality = 'missing-content';
    qualityReasons.push('no-article-content');
    extractionMethod = 'none';
  } else if (residualDebris.length > 0) {
    quality = 'debris-contaminated';
    qualityReasons.push(...residualDebris.map((label) => `residual-${label}`));
  } else if (extractedWordCount < MIN_CLEAN_WORDS) {
    quality = 'manual-review-required';
    qualityReasons.push('thin-content');
  } else if (extractionMethod === 'paragraph-fallback') {
    quality = 'manual-review-required';
    qualityReasons.push('generic-paragraph-fallback');
  } else if (extractionMethod === 'generic-main-selector') {
    quality = 'manual-review-required';
    qualityReasons.push('generic-main-selector');
  } else {
    quality = 'clean';
  }

  return {
    content,
    imageUrl,
    wordCount: extractedWordCount,
    quality,
    qualityReasons,
    extractionMethod,
    imageQuality: imageUrl ? 'manual-review-required' : hadRejectedImage ? 'rejected' : 'missing',
    imageReasons: imageUrl
      ? [imageNeedsEditorialReview ? 'editorial-correlation-required' : 'http-validation-required']
      : hadRejectedImage
        ? ['non-editorial-image-candidate']
        : ['missing-image'],
  };
}

const MAX_IMAGE_BYTES = 12_000_000;

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function inspectImagePayload(
  bytes: Uint8Array,
  declaredContentType: string,
): { valid: boolean; reason: string; width?: number; height?: number } {
  const mime = declaredContentType.toLowerCase().split(';')[0].trim();
  let format: 'jpeg' | 'png' | 'webp' | null = null;
  let width = 0;
  let height = 0;

  if (
    bytes.length >= 33
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
    && bytes[8] === 0x00
    && bytes[9] === 0x00
    && bytes[10] === 0x00
    && bytes[11] === 0x0d
    && String.fromCharCode(...bytes.slice(12, 16)) === 'IHDR'
    && [1, 2, 4, 8, 16].includes(bytes[24])
    && [0, 2, 3, 4, 6].includes(bytes[25])
    && bytes[26] === 0x00
    && bytes[27] === 0x00
    && [0x00, 0x01].includes(bytes[28])
    && crc32(bytes.slice(12, 29)) === (
      (bytes[29] * 0x1000000) + (bytes[30] << 16) + (bytes[31] << 8) + bytes[32]
    )
  ) {
    format = 'png';
    width = (bytes[16] * 0x1000000) + (bytes[17] << 16) + (bytes[18] << 8) + bytes[19];
    height = (bytes[20] * 0x1000000) + (bytes[21] << 16) + (bytes[22] << 8) + bytes[23];
  } else if (bytes.length >= 12 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    format = 'jpeg';
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = bytes[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      const segmentLength = (bytes[offset + 2] << 8) + bytes[offset + 3];
      if (segmentLength < 2 || offset + 2 + segmentLength > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        height = (bytes[offset + 5] << 8) + bytes[offset + 6];
        width = (bytes[offset + 7] << 8) + bytes[offset + 8];
        break;
      }
      offset += 2 + segmentLength;
    }
  } else if (
    bytes.length >= 30
    && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    format = 'webp';
    const chunk = String.fromCharCode(...bytes.slice(12, 16));
    if (chunk === 'VP8X' && bytes.length >= 30) {
      width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
      height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
    } else if (chunk === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
      width = 1 + bytes[21] + ((bytes[22] & 0x3f) << 8);
      height = 1 + ((bytes[22] & 0xc0) >> 6) + (bytes[23] << 2) + ((bytes[24] & 0x0f) << 10);
    } else if (chunk === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      width = (bytes[26] + (bytes[27] << 8)) & 0x3fff;
      height = (bytes[28] + (bytes[29] << 8)) & 0x3fff;
    }
  }

  const expectedMime = format === 'jpeg' ? /^image\/(?:jpeg|jpg)$/ : new RegExp(`^image/${format || 'unsupported'}$`);
  if (!format || !expectedMime.test(mime)) return { valid: false, reason: 'image-signature-mismatch' };
  if (width < 300 || height < 150) return { valid: false, reason: 'image-dimensions-too-small', width, height };
  if (width > 12_000 || height > 12_000 || width * height > 60_000_000) {
    return { valid: false, reason: 'image-dimensions-too-large', width, height };
  }
  return { valid: true, reason: `verified-${format}-${width}x${height}`, width, height };
}

export function declaredImageSize(response: Response): number | null {
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) return null;
  if (response.status !== 206) return contentLength;
  const match = response.headers.get('content-range')?.match(/^bytes (\d+)-(\d+)\/(\d+)$/i);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  const total = Number(match[3]);
  if (![start, end, total].every(Number.isSafeInteger)) return null;
  if (start !== 0 || end < start || end >= total || end - start + 1 !== contentLength) return null;
  return total;
}

async function validateImageCandidate(
  imageUrl: string,
  signal: AbortSignal,
): Promise<{ imageUrl: string | null; imageQuality: ImageQuality; imageReasons: string[] }> {
  let currentUrl = imageUrl;
  try {
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      const response = await fetchPinnedExternal(currentUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DroneWire/1.0; +https://dronewire.org)',
          Accept: 'image/*',
        },
        signal,
      });
      if (!response) {
        return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['blocked-or-unresolvable'] };
      }
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location || redirectCount === MAX_REDIRECTS) {
          return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['unverified-redirect'] };
        }
        currentUrl = new URL(location, currentUrl).toString();
        if (!imageCandidateIsEditorial(currentUrl)) {
          return { imageUrl: null, imageQuality: 'rejected', imageReasons: ['redirected-to-non-editorial-image'] };
        }
        continue;
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() || '';
      if ([403, 405].includes(response.status)) break;
      if (response.status === 429 || contentType === 'application/octet-stream') {
        return {
          imageUrl: currentUrl,
          imageQuality: 'manual-review-required',
          imageReasons: [contentType === 'application/octet-stream' ? 'ambiguous-content-type' : `http-${response.status}`],
        };
      }
      if (!response.ok) return { imageUrl: null, imageQuality: 'rejected', imageReasons: [`http-${response.status}`] };
      const declaredSize = declaredImageSize(response);
      if (!declaredSize) {
        return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['image-size-unverified'] };
      }
      if (declaredSize > MAX_IMAGE_BYTES) {
        return { imageUrl: null, imageQuality: 'rejected', imageReasons: ['image-too-large'] };
      }
      if (contentType && !/^image\/(?:jpeg|jpg|png|webp)(?:;|$)/.test(contentType)) {
        return { imageUrl: null, imageQuality: 'rejected', imageReasons: [`unsupported-image-${contentType}`] };
      }
      break;
    }

    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      const response = await fetchPinnedExternal(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DroneWire/1.0; +https://dronewire.org)',
          Accept: 'image/jpeg,image/png,image/webp',
          Range: 'bytes=0-262143',
        },
        signal,
      });
      if (!response) return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['blocked-or-unresolvable'] };
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location || redirectCount === MAX_REDIRECTS) {
          return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['unverified-redirect'] };
        }
        currentUrl = new URL(location, currentUrl).toString();
        if (!imageCandidateIsEditorial(currentUrl)) {
          return { imageUrl: null, imageQuality: 'rejected', imageReasons: ['redirected-to-non-editorial-image'] };
        }
        continue;
      }
      if ([403, 405, 429].includes(response.status)) {
        return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: [`http-${response.status}`] };
      }
      if (!response.ok) return { imageUrl: null, imageQuality: 'rejected', imageReasons: [`http-${response.status}`] };
      const declaredSize = declaredImageSize(response);
      if (!declaredSize) {
        return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['image-size-unverified'] };
      }
      if (declaredSize > MAX_IMAGE_BYTES) {
        return { imageUrl: null, imageQuality: 'rejected', imageReasons: ['image-too-large'] };
      }
      const contentType = response.headers.get('content-type') || '';
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength !== Number(response.headers.get('content-length'))) {
        return { imageUrl: null, imageQuality: 'rejected', imageReasons: ['image-length-mismatch'] };
      }
      const inspection = inspectImagePayload(bytes, contentType);
      if (!inspection.valid) return { imageUrl: null, imageQuality: 'rejected', imageReasons: [inspection.reason] };
      return { imageUrl: currentUrl, imageQuality: 'usable', imageReasons: [inspection.reason] };
    }
  } catch {
    return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['request-failed'] };
  }
  return { imageUrl: currentUrl, imageQuality: 'manual-review-required', imageReasons: ['unverified-image'] };
}

function redirectedArticleToHomepage(initialUrl: string, finalUrl: string): boolean {
  try {
    const initial = new URL(initialUrl);
    const final = new URL(finalUrl);
    return initial.pathname !== '/' && final.pathname === '/';
  } catch {
    return false;
  }
}

export async function extractContentFromUrl(url: string): Promise<ExtractedContent | null> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 15_000);
    const fetched = await fetchExternalHtml(url, controller.signal);

    if (!fetched) {
      logger.error('External content fetch failed: blocked destination');
      return null;
    }
    if (!fetched.response.ok) {
      logger.error(`External content fetch failed: ${fetched.response.status}`);
      return missingResult(`http-${fetched.response.status}`);
    }
    if (redirectedArticleToHomepage(url, fetched.finalUrl)) {
      return missingResult('redirected-to-homepage');
    }

    const contentType = fetched.response.headers.get('content-type') || '';
    if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      return missingResult(`non-html-${contentType.toLowerCase()}`);
    }

    const html = await readLimitedText(fetched.response);
    const extracted = extractContentFromHtml(html, fetched.finalUrl);
    if (!extracted.imageUrl || extracted.imageReasons.includes('editorial-correlation-required')) return extracted;
    const image = await validateImageCandidate(extracted.imageUrl, controller.signal);
    return { ...extracted, ...image };
  } catch {
    logger.error('External content extraction failed');
    return null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

// Estimate read time in minutes
export function estimateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
