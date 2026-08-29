/** @jest-environment jsdom */

import { render, waitFor } from '@testing-library/react'
import ViewTracker from '@/components/analytics/view-tracker'

describe('ViewTracker production beacon', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV
    global.fetch = originalFetch
  })

  it('does not send a view beacon outside Production', async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview'
    const fetchMock = jest.fn()
    global.fetch = fetchMock as typeof fetch

    render(<ViewTracker entityType="article" entityId="article-1" />)

    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled())
  })

  it('sends one view beacon in Production', async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production'
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as typeof fetch

    render(<ViewTracker entityType="system" entityId="system-1" />)

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith('/api/views', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ entityType: 'system', entityId: 'system-1' }),
      keepalive: true,
    }))
  })

  it('does not send a second beacon when props change on the same mount', async () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production'
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as typeof fetch

    const view = render(<ViewTracker entityType="article" entityId="article-1" />)
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    view.rerender(<ViewTracker entityType="article" entityId="article-2" />)
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/views', expect.objectContaining({
      body: JSON.stringify({ entityType: 'article', entityId: 'article-1' }),
    }))
  })
})
