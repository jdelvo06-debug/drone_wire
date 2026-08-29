/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: () => '/articles',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}))

import Header from '@/components/layout/header'
import SemanticSearch from '@/components/search/semantic-search'
import ContractsTable from '@/components/contracts/contracts-table'
import { ContractsExplorer } from '@/components/contracts/contracts-explorer'

describe('shared accessibility behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('labels navigation and search and exposes the current page', () => {
    render(<Header />)

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Articles' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('searchbox', { name: 'Search DroneWire' })).not.toHaveLength(0)
  })

  it('gives semantic search controls accessible names', () => {
    render(<SemanticSearch />)

    expect(screen.getByRole('searchbox', { name: 'Semantic search' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run semantic search' })).toBeInTheDocument()
  })

  it('exposes contract sort and expansion state', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        contracts: [{
          id: 'contract-1',
          contractNumber: 'ABC-123',
          title: 'Counter-UAS Integration',
          company: 'Example Defense',
          awardDate: '2026-08-01T00:00:00.000Z',
          value: 1000000,
          currency: 'USD',
          agency: 'DOD',
          category: 'counter-uas',
          status: 'active',
          duration: 12,
          description: 'Test contract',
          sourceUrl: 'https://example.com/contract',
        }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1, hasMore: false },
        aggregates: { totalValue: 1000000, averageValue: 1000000, maxValue: 1000000 },
      }),
    })
    global.fetch = fetchMock as typeof fetch
    render(<ContractsExplorer><ContractsTable /></ContractsExplorer>)

    const expand = await screen.findByRole('button', { name: 'Show details for Counter-UAS Integration' })
    expect(expand).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('columnheader', { name: /Award Date/ })).toHaveAttribute('aria-sort', 'descending')

    fireEvent.click(expand)
    await waitFor(() => expect(expand).toHaveAttribute('aria-expanded', 'true'))
  })
})
