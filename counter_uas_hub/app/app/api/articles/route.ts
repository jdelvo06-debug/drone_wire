import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    // Filter params
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';

    // Sort params
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Build where clause
    const where: Record<string, unknown> = {
      status,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { aiSummary: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (['publishedAt', 'views', 'createdAt', 'confidence'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.publishedAt = 'desc';
    }

    // Fetch articles with tags
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // Transform response
    const transformedArticles = articles.map((article) => ({
      ...article,
      tags: article.tags.map((at) => at.tag),
    }));

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + articles.length < total,
      },
    });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// Increment view count
export async function POST(req: NextRequest) {
  try {
    const { articleId } = await req.json();

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID required' },
        { status: 400 }
      );
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        views: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View increment error:', error);
    return NextResponse.json(
      { error: 'Failed to update views' },
      { status: 500 }
    );
  }
}
