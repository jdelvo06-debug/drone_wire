import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import FederatedSearchPage from '@/components/search/federated-search-page'

const replace = jest.fn()
let currentQuery = ''

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(currentQuery ? `q=${encodeURIComponent(currentQuery)}` : ''),
}))

describe('federated search page states', () => {
  beforeEach(() => {
    currentQuery = ''
    replace.mockReset()
    global.fetch = jest.fn()
  })

  it('shows a useful empty-query state and all four entity filters', () => {
    render(<FederatedSearchPage />)

    expect(screen.getByText(/search articles, systems, explainers, and contracts/i)).toBeInTheDocument()
    for (const type of ['article', 'system', 'explainer', 'contract']) {
      expect(screen.getByRole('button', { name: type })).toHaveAttribute('aria-pressed', 'true')
    }
  })

  it('shows loading and then a typed result with its link and provenance', async () => {
    let resolveFetch: ((value: Response) => void) | undefined
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise((resolve) => { resolveFetch = resolve }))
    render(<FederatedSearchPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'KuRFS' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/searching/i)

    resolveFetch?.({
      ok: true,
      json: async () => ({ results: [{
        entityType: 'system', id: 'system-1', title: 'KuRFS', href: '/systems/kurfs',
        snippet: 'Radar system', category: 'sensor', imageUrl: null,
        provenanceLabel: 'partially-sourced', score: 10,
      }] }),
    } as Response)

    const link = await screen.findByRole('link', { name: /KuRFS/i })
    expect(link).toHaveAttribute('href', '/systems/kurfs')
    expect(screen.getAllByText('system')).toHaveLength(2)
    expect(screen.getByText('partially-sourced')).toBeInTheDocument()
  })

  it('shows a no-results state after a submitted search', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ results: [] }) })
    render(<FederatedSearchPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'nothing' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    expect(await screen.findByText(/no results found/i)).toBeInTheDocument()
  })

  it('shows API errors and reruns a valid query when a type filter changes', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Search unavailable' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) })
    render(<FederatedSearchPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'radar' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Search unavailable')

    fireEvent.click(screen.getByRole('button', { name: 'contract' }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2))
    expect(String((global.fetch as jest.Mock).mock.calls[1][0])).not.toContain('contract')
  })

  it('issues one request when submission updates the URL query', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ results: [] }) })
    const view = render(<FederatedSearchPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Sentinel' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    currentQuery = 'Sentinel'
    view.rerender(<FederatedSearchPage />)
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
  })

  it('ignores an older response after a filter starts a newer request', async () => {
    const resolvers: Array<(value: Response) => void> = []
    ;(global.fetch as jest.Mock).mockImplementation(() => new Promise((resolve) => resolvers.push(resolve)))
    render(<FederatedSearchPage />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'radar' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    fireEvent.click(screen.getByRole('button', { name: 'contract' }))
    expect(global.fetch).toHaveBeenCalledTimes(2)

    resolvers[1]({
      ok: true,
      json: async () => ({ results: [{
        entityType: 'system', id: 'new', title: 'New result', href: '/systems/new',
        snippet: 'new', category: 'sensor', imageUrl: null, provenanceLabel: 'unverified', score: 1,
      }] }),
    } as Response)
    expect(await screen.findByText('New result')).toBeInTheDocument()

    resolvers[0]({
      ok: true,
      json: async () => ({ results: [{
        entityType: 'system', id: 'old', title: 'Old result', href: '/systems/old',
        snippet: 'old', category: 'sensor', imageUrl: null, provenanceLabel: 'unverified', score: 1,
      }] }),
    } as Response)
    await waitFor(() => expect(screen.queryByText('Old result')).not.toBeInTheDocument())
    expect(screen.getByText('New result')).toBeInTheDocument()
  })
})
