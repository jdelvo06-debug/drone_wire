import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination params
    const parsedPage = Number.parseInt(searchParams.get('page') || '', 10);
    const parsedLimit = Number.parseInt(searchParams.get('limit') || '', 10);
    const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;
    const limit = Number.isFinite(parsedLimit) ? Math.min(100, Math.max(1, parsedLimit)) : 20;
    const skip = (page - 1) * limit;

    // Filter params
    const category = searchParams.get('category');
    const agency = searchParams.get('agency');
    const company = searchParams.get('company');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const minValue = searchParams.get('minValue');
    const maxValue = searchParams.get('maxValue');

    // Sort params
    const sortBy = searchParams.get('sortBy') || 'awardDate';
    const requestedSortOrder = searchParams.get('sortOrder') || searchParams.get('sortDir');
    const sortOrder = requestedSortOrder === 'asc' ? 'asc' : 'desc';

    // Build where clause
    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (agency && agency !== 'all') {
      where.agency = { contains: agency, mode: 'insensitive' };
    }

    if (company) {
      where.company = { contains: company, mode: 'insensitive' };
    }

    if (status && status !== 'all') {
      where.status = status;
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

    const sqlConditions: Prisma.Sql[] = [];
    if (category && category !== 'all') sqlConditions.push(Prisma.sql`"category" = ${category}`);
    if (agency && agency !== 'all') sqlConditions.push(Prisma.sql`"agency" ILIKE ${`%${agency}%`}`);
    if (company) sqlConditions.push(Prisma.sql`"company" ILIKE ${`%${company}%`}`);
    if (status && status !== 'all') sqlConditions.push(Prisma.sql`"status" = ${status}`);
    if (search) {
      const pattern = `%${search}%`;
      sqlConditions.push(Prisma.sql`(
        "title" ILIKE ${pattern} OR
        "description" ILIKE ${pattern} OR
        "company" ILIKE ${pattern}
      )`);
    }
    const parsedMin = minValue ? Number(minValue) : Number.NaN;
    const parsedMax = maxValue ? Number(maxValue) : Number.NaN;
    if (Number.isFinite(parsedMin)) sqlConditions.push(Prisma.sql`"value" >= ${parsedMin}`);
    if (Number.isFinite(parsedMax)) sqlConditions.push(Prisma.sql`"value" <= ${parsedMax}`);
    const sqlWhere = sqlConditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(sqlConditions, ' AND ')}`
      : Prisma.empty;

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (['awardDate', 'title', 'value', 'company', 'agency', 'createdAt'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.awardDate = 'desc';
    }

    // Fetch contracts and aggregates
    const [contracts, total, aggregates] = await Promise.all([
      prisma.contract.findMany({
        where,
        select: {
          id: true,
          contractNumber: true,
          title: true,
          company: true,
          awardDate: true,
          value: true,
          currency: true,
          agency: true,
          category: true,
          status: true,
          duration: true,
          description: true,
          sourceUrl: true,
          location: true,
        },
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
      prisma.$queryRaw<Array<{ month: Date; totalValue: Prisma.Decimal }>>(Prisma.sql`
        SELECT date_trunc('month', "awardDate") AS "month", SUM("value") AS "totalValue"
        FROM "contracts"
        ${sqlWhere}
        GROUP BY date_trunc('month', "awardDate")
        ORDER BY "month" ASC
      `),
    ]);

    // Transform by agency data
    const byAgency = byAgencyRaw.map((item) => ({
      agency: item.agency,
      count: item._count.id,
      totalValue: item._sum.value?.toNumber() || 0,
    }));

    const byMonth = byMonthRaw.slice(-12).map((row) => ({
      month: row.month.toISOString().slice(0, 7),
      totalValue: row.totalValue.toNumber(),
    }));

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
    const [agencies, categories, companies, statuses] = await Promise.all([
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
      prisma.contract.findMany({ select: { status: true }, distinct: ['status'] }),
    ]);

    return NextResponse.json({
      agencies: agencies.map((a) => a.agency),
      categories: categories.map((c) => c.category),
      companies: companies.map((c) => c.company),
      statuses: statuses.map((entry) => entry.status),
    });
  } catch (error) {
    logger.error('Contracts filters API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
