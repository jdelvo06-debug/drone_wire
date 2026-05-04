// Centralized image constants and utilities

export const PLACEHOLDER_IMAGES = {
  article: '/images/placeholder-article.svg',
  explainer: '/images/placeholder-article.svg', // Reuse for explainers
} as const;

/**
 * Get the appropriate placeholder image based on content type
 */
export function getPlaceholderImage(type: 'article' | 'explainer' = 'article'): string {
  return PLACEHOLDER_IMAGES[type];
}

/**
 * Get image URL with fallback to placeholder if missing or empty
 */
export function getImageWithFallback(
  imageUrl: string | null | undefined,
  type: 'article' | 'explainer' = 'article'
): string {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return getPlaceholderImage(type);
}

/**
 * Check if a URL is a valid image URL (not a tracking pixel, icon, etc.)
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || url.trim() === '') {
    return false;
  }

  // Skip tracking pixels, icons, and logos
  const skipPatterns = [
    /1x1/i,
    /pixel/i,
    /tracking/i,
    /spacer/i,
    /blank\./i,
    /transparent/i,
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

/**
 * Check if URL likely points to an image based on extension or patterns
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  const lowerUrl = url.toLowerCase();

  // Check extension
  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
    return true;
  }

  // Check for image hosting patterns
  const imageHostPatterns = [
    /images?\./i,
    /img\./i,
    /media\./i,
    /cdn\./i,
    /wp-content\/uploads/i,
    /cloudfront/i,
    /imgix/i,
  ];

  return imageHostPatterns.some((pattern) => pattern.test(url));
}
