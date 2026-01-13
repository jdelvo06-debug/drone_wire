import { prisma } from '@/lib/db';
import { extractContentFromUrl } from './content-extractor';

export interface ReprocessingResult {
  processed: number;
  updated: number;
  failed: number;
  errors: string[];
}

export interface ImageStats {
  total: number;
  withImages: number;
  withoutImages: number;
  percentage: number;
}

/**
 * Reprocess articles to extract missing images
 * @param limit Maximum number of articles to process
 * @param onlyMissing If true, only process articles without images
 */
export async function reprocessArticlesForImages(
  limit: number = 50,
  onlyMissing: boolean = true
): Promise<ReprocessingResult> {
  const result: ReprocessingResult = {
    processed: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  // Get articles that need image extraction
  const where = onlyMissing
    ? { imageUrl: null, sourceUrl: { not: null } }
    : { sourceUrl: { not: null } };

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      sourceUrl: true,
      imageUrl: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  console.log(`Processing ${articles.length} articles for image extraction...`);

  for (const article of articles) {
    result.processed++;

    if (!article.sourceUrl) {
      continue;
    }

    try {
      console.log(`Extracting image for: ${article.title.slice(0, 50)}...`);
      const extracted = await extractContentFromUrl(article.sourceUrl);

      if (extracted?.imageUrl) {
        await prisma.article.update({
          where: { id: article.id },
          data: { imageUrl: extracted.imageUrl },
        });
        result.updated++;
        console.log(`  Updated with image: ${extracted.imageUrl.slice(0, 60)}...`);
      } else {
        console.log(`  No image found`);
      }
    } catch (error) {
      result.failed++;
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`${article.id}: ${errorMsg}`);
      console.error(`  Error: ${errorMsg}`);
    }

    // Rate limiting - wait 1.5 seconds between requests
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  return result;
}

/**
 * Get statistics about article images
 */
export async function getImageStats(): Promise<ImageStats> {
  const [total, withImages] = await Promise.all([
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({
      where: {
        status: 'published',
        imageUrl: { not: null },
      },
    }),
  ]);

  return {
    total,
    withImages,
    withoutImages: total - withImages,
    percentage: total > 0 ? Math.round((withImages / total) * 100) : 0,
  };
}
