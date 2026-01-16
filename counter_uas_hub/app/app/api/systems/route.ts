import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;

    // Filter params
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const manufacturer = searchParams.get('manufacturer');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // Sort params
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

    // Build where clause
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: 'insensitive' };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { primaryCapability: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const orderBy: Record<string, string>[] = [];

    // Always sort featured first
    orderBy.push({ featured: 'desc' });

    if (['name', 'manufacturer', 'country', 'views', 'createdAt'].includes(sortBy)) {
      orderBy.push({ [sortBy]: sortOrder });
    } else {
      orderBy.push({ name: 'asc' });
    }

    // Fetch systems with tags
    const [systems, total] = await Promise.all([
      prisma.system.findMany({
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
      prisma.system.count({ where }),
    ]);

    // Transform response
    const transformedSystems = systems.map((system) => ({
      ...system,
      tags: system.tags.map((st) => st.tag),
    }));

    return NextResponse.json({
      systems: transformedSystems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + systems.length < total,
      },
    });
  } catch (error) {
    console.error('Systems API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch systems' },
      { status: 500 }
    );
  }
}

// Increment view count
export async function POST(req: NextRequest) {
  try {
    const { systemId } = await req.json();

    if (!systemId) {
      return NextResponse.json(
        { error: 'System ID required' },
        { status: 400 }
      );
    }

    await prisma.system.update({
      where: { id: systemId },
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
