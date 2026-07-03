import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Defense-in-depth: middleware already covers /api/admin, but enforce at route level too
  const authError = await requireAdmin(req)
  if (authError) return authError

  const { slug } = params

  let body: { imageUrl: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!('imageUrl' in body)) {
    return NextResponse.json({ error: 'imageUrl field required' }, { status: 400 })
  }

  const { imageUrl } = body

  if (imageUrl !== null && typeof imageUrl !== 'string') {
    return NextResponse.json({ error: 'imageUrl must be a string or null' }, { status: 400 })
  }

  try {
    const system = await prisma.system.update({
      where: { slug },
      data: { imageUrl },
    })
    return NextResponse.json(system)
  } catch {
    return NextResponse.json({ error: `System "${slug}" not found` }, { status: 404 })
  }
}
