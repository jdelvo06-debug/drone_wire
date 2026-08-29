/** @jest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContractsTable from '@/components/contracts/contracts-table'
import { ContractsExplorer } from '@/components/contracts/contracts-explorer'
import { formatContractAwardDate } from '@/lib/contracts/date'

const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}))

const contract = {
  id: 'cmqf823s00001id04i1f8r18r',
  contractNumber: 'SPE8EL26FJ1Y1',
  title: '4571157251',
  company: 'W S DARLEY & CO',
  awardDate: '2026-03-11T00:00:00.000Z',
  value: 111188.64,
  currency: 'USD',
  agency: 'Department of Defense',
  category: 'general',
  status: 'active',
  duration: null,
  description: 'GHOUL COUNTER UAS SYSTEM USED TO PROTECT',
  sourceUrl: 'https://www.usaspending.gov/award/example/',
  location: null,
}

describe('contract award date display', () => {
  const originalTimezone = process.env.TZ

  beforeAll(() => { process.env.TZ = 'America/New_York' })
  afterAll(() => {
    if (originalTimezone === undefined) delete process.env.TZ
    else process.env.TZ = originalTimezone
  })

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn((input: RequestInfo | URL, init?: RequestInit) => Promise.resolve({
      ok: true,
      json: async () => init?.method === 'OPTIONS'
        ? { agencies: [], categories: [], statuses: ['active'] }
        : {
            contracts: [contract],
            pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasMore: false },
            aggregates: { totalValue: contract.value, averageValue: contract.value, maxValue: contract.value },
          },
    } as Response)) as typeof fetch
  })

  it('keeps a UTC-midnight award date on its stored calendar day in Eastern time', () => {
    expect(new Date(contract.awardDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/New_York',
    })).toBe('Mar 10, 2026')
    expect(formatContractAwardDate(contract.awardDate)).toBe('Mar 11, 2026')
  })

  it('preserves local-time behavior for timestamps with time-of-day semantics', () => {
    expect(formatContractAwardDate('2026-03-11T01:30:00.000Z')).toBe('Mar 10, 2026')
  })

  it('uses the corrected date on both desktop and mobile render paths', async () => {
    render(<ContractsExplorer><ContractsTable /></ContractsExplorer>)

    expect(await screen.findAllByText('Mar 11, 2026')).toHaveLength(2)
    expect(screen.queryByText('Mar 10, 2026')).not.toBeInTheDocument()
  })

  it('keeps award-date sorting routed through the API query', async () => {
    render(<ContractsExplorer><ContractsTable /></ContractsExplorer>)
    fireEvent.click(await screen.findByRole('button', { name: 'Award Date' }))

    expect(mockReplace).toHaveBeenCalledWith('/contracts?sortBy=awardDate&sortOrder=asc&page=1')
  })
})
