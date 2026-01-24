import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Filter params
    const category = searchParams.get('category');
    const agency = searchParams.get('agency');
    const company = searchParams.get('company');
    const search = searchParams.get('search');
    const minValue = searchParams.get('minValue');
    const maxValue = searchParams.get('maxValue');

    // Sort params
    const sortBy = searchParams.get('sortBy') || 'awardDate';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Build where clause
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (agency) {
      where.agency = { contains: agency, mode: 'insensitive' };
    }

    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minValue || maxValue) {
      where.value = {};
      if (minValue) {
        const parsedMin = parseFloat(minValue);
        if (!isNaN(parsedMin)) {
          (where.value as Record<string, number>).gte = parsedMin;
        }
      }
      if (maxValue) {
        const parsedMax = parseFloat(maxValue);
        if (!isNaN(parsedMax)) {
          (where.value as Record<string, number>).lte = parsedMax;
        }
      }
    }

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (['awardDate', 'value', 'company', 'agency', 'createdAt'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.awardDate = 'desc';
    }

    // Fetch contracts and aggregates
    const [contracts, total, aggregates] = await Promise.all([
      prisma.contract.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.contract.count({ where }),
      prisma.contract.aggregate({
        where,
        _sum: { value: true },
        _avg: { value: true },
        _max: { value: true },
      }),
    ]);

    // Fetch aggregation data for charts (by agency and by month)
    const [byAgencyRaw, byMonthRaw] = await Promise.all([
      // Group by agency
      prisma.contract.groupBy({
        by: ['agency'],
        where,
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _sum: { value: 'desc' } },
        take: 10, // Top 10 agencies
      }),
      // Group by month - get all contracts and aggregate in JS
      prisma.contract.findMany({
        where,
        select: {
          awardDate: true,
          value: true,
        },
        orderBy: { awardDate: 'asc' },
      }),
    ]);

    // Transform by agency data
    const byAgency = byAgencyRaw.map((item) => ({
      agency: item.agency,
      count: item._count.id,
      totalValue: item._sum.value?.toNumber() || 0,
    }));

    // Aggregate by month
    const monthlyMap = new Map<string, number>();
    for (const contract of byMonthRaw) {
      const monthKey = `${contract.awardDate.getFullYear()}-${String(contract.awardDate.getMonth() + 1).padStart(2, '0')}`;
      const currentValue = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, currentValue + contract.value.toNumber());
    }

    // Convert to sorted array (last 12 months or all available)
    const byMonth = Array.from(monthlyMap.entries())
      .map(([month, totalValue]) => ({ month, totalValue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    // Transform decimal values to numbers for JSON
    const transformedContracts = contracts.map((contract) => ({
      ...contract,
      value: contract.value.toNumber(),
    }));

    return NextResponse.json({
      contracts: transformedContracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + contracts.length < total,
      },
      aggregates: {
        totalValue: aggregates._sum.value?.toNumber() || 0,
        averageValue: aggregates._avg.value?.toNumber() || 0,
        maxValue: aggregates._max.value?.toNumber() || 0,
      },
      byAgency,
      byMonth,
    });
  } catch (error) {
    logger.error('Contracts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// Get unique agencies and categories for filters
export async function OPTIONS() {
  try {
    const [agencies, categories, companies] = await Promise.all([
      prisma.contract.findMany({
        select: { agency: true },
        distinct: ['agency'],
      }),
      prisma.contract.findMany({
        select: { category: true },
        distinct: ['category'],
      }),
      prisma.contract.findMany({
        select: { company: true },
        distinct: ['company'],
        take: 50, // Limit companies
      }),
    ]);

    return NextResponse.json({
      agencies: agencies.map((a) => a.agency),
      categories: categories.map((c) => c.category),
      companies: companies.map((c) => c.company),
    });
  } catch (error) {
    logger.error('Contracts filters API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
