import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeContractsCsv } from '@/lib/contracts/csv'
import { enforcePublicRequest } from '@/lib/security/request-guard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const blocked = await enforcePublicRequest(request, { route: 'contracts-export', limit: 5, windowSeconds: 60 })
  if (blocked) return blocked
  const params = request.nextUrl.searchParams
  const bounded = (name: string) => params.get(name)?.trim().slice(0, 120) || undefined
  const search = bounded('search')
  const agency = bounded('agency')
  const category = params.get('category')
  const status = params.get('status')
  const company = bounded('company')
  const minValueRaw = params.get('minValue')
  const maxValueRaw = params.get('maxValue')
  const minValue = minValueRaw?.trim() ? Number(minValueRaw) : Number.NaN
  const maxValue = maxValueRaw?.trim() ? Number(maxValueRaw) : Number.NaN
  const sortBy = ['awardDate', 'title', 'value', 'company', 'agency'].includes(params.get('sortBy') || '') ? params.get('sortBy')! : 'awardDate'
  const sortOrder = params.get('sortOrder') === 'asc' ? 'asc' : 'desc'
  const where = {
    ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { description: { contains: search, mode: 'insensitive' as const } }, { company: { contains: search, mode: 'insensitive' as const } }] } : {}),
    ...(agency && agency !== 'all' ? { agency: { contains: agency, mode: 'insensitive' as const } } : {}),
    ...(category && category !== 'all' ? { category } : {}),
    ...(status && status !== 'all' ? { status } : {}),
    ...(company ? { company: { contains: company, mode: 'insensitive' as const } } : {}),
    ...(Number.isFinite(minValue) || Number.isFinite(maxValue) ? {
      value: {
        ...(Number.isFinite(minValue) ? { gte: minValue } : {}),
        ...(Number.isFinite(maxValue) ? { lte: maxValue } : {}),
      },
    } : {}),
  }

  const contracts = await prisma.contract.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    take: 2000,
    select: { contractNumber: true, title: true, company: true, agency: true, category: true, status: true, value: true, currency: true, awardDate: true, duration: true, location: true, sourceUrl: true },
  })
  const csv = serializeContractsCsv(contracts.map((contract) => ({ ...contract, value: contract.value.toString() })))
  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="dronewire-contracts.csv"',
      'cache-control': 'private, no-store',
    },
  })
}
