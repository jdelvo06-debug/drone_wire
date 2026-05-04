import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [articles, contracts, explainers] = await Promise.all([
    prisma.article.count({ where: { status: 'published' } }),
    prisma.contract.count(),
    prisma.explainer.count(),
  ])

  return NextResponse.json({
    articles,
    contracts,
    explainers,
  })
}
