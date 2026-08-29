'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export interface ContractResult {
  id: string; contractNumber: string | null; title: string; company: string; awardDate: string
  value: number; currency: string; agency: string; category: string; status: string
  duration: number | null; description: string | null; sourceUrl: string | null
  location?: string | null; office?: string | null
}

export interface ContractsResponse {
  contracts: ContractResult[]
  pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean }
  aggregates: { totalValue: number; averageValue: number; maxValue: number }
}

interface ExplorerContext {
  data: ContractsResponse | null
  facets: { agencies: string[]; categories: string[]; statuses: string[] }
  loading: boolean
  error: string | null
  refresh: () => void
}

const Context = createContext<ExplorerContext | null>(null)

export function ContractsExplorer({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const signature = searchParams.toString()
  const [refreshKey, setRefreshKey] = useState(0)
  const [data, setData] = useState<ContractsResponse | null>(null)
  const [facets, setFacets] = useState<ExplorerContext['facets']>({ agencies: [], categories: [], statuses: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams(signature)
    if (!params.has('page')) params.set('page', '1')
    if (!params.has('limit')) params.set('limit', '20')
    if (!params.has('sortBy')) params.set('sortBy', 'awardDate')
    if (!params.has('sortOrder')) params.set('sortOrder', 'desc')
    setLoading(true)
    Promise.all([
      fetch(`/api/contracts?${params}`, { signal: controller.signal }),
      fetch('/api/contracts', { method: 'OPTIONS', signal: controller.signal }),
    ]).then(async ([recordsResponse, facetsResponse]) => {
      if (!recordsResponse.ok || !facetsResponse.ok) throw new Error('Failed to load contracts explorer')
      const [records, availableFacets] = await Promise.all([recordsResponse.json(), facetsResponse.json()])
      setData(records)
      setFacets({ agencies: availableFacets.agencies || [], categories: availableFacets.categories || [], statuses: availableFacets.statuses || [] })
      setError(null)
    }).catch((requestError) => {
      if (requestError instanceof Error && requestError.name !== 'AbortError') setError('Failed to load contracts explorer')
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false)
    })
    return () => controller.abort()
  }, [signature, refreshKey])

  const value = useMemo(() => ({ data, facets, loading, error, refresh: () => setRefreshKey((key) => key + 1) }), [data, facets, loading, error])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useContractsExplorer() {
  const context = useContext(Context)
  if (!context) throw new Error('useContractsExplorer must be used inside ContractsExplorer')
  return context
}
