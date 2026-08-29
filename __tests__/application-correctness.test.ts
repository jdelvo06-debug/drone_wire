/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    contract: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    $queryRaw: jest.fn(),
  },
}))

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { GET as getContracts } from '@/app/api/contracts/route'
import { middleware } from '@/middleware'

describe('confirmed application correctness regressions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.ADMIN_SECRET = 'admin-secret-for-test'
    ;(prisma.contract.findMany as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
    ;(prisma.contract.count as jest.Mock).mockResolvedValue(0)
    ;(prisma.contract.aggregate as jest.Mock).mockResolvedValue({
      _sum: { value: null },
      _avg: { value: null },
      _max: { value: null },
    })
    ;(prisma.contract.groupBy as jest.Mock).mockResolvedValue([])
    ;(prisma.$queryRaw as jest.Mock).mockResolvedValue([])
  })

  afterEach(() => {
    delete process.env.ADMIN_SECRET
  })

  it('preserves an admin deep link without double encoding it', async () => {
    const response = await middleware(new NextRequest('https://dronewire.org/admin/systems'))
    const location = new URL(response.headers.get('location') || '')

    expect(location.pathname).toBe('/admin/login')
    expect(location.searchParams.get('from')).toBe('/admin/systems')
  })

  it('sorts contracts by title and honors ascending direction', async () => {
    const response = await getContracts(new NextRequest(
      'https://dronewire.org/api/contracts?sortBy=title&sortOrder=asc',
    ))

    expect(response.status).toBe(200)
    expect(prisma.contract.findMany).toHaveBeenNthCalledWith(1, expect.objectContaining({
      orderBy: { title: 'asc' },
    }))
    expect(prisma.contract.findMany).toHaveBeenCalledTimes(1)
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })
})
