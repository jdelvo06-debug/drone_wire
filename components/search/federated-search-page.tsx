'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { FederatedSearchResult, SearchEntityType } from '@/lib/search/federated-search'

const SEARCH_TYPES: SearchEntityType[] = ['article', 'system', 'explainer', 'contract']

export default function FederatedSearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [types, setTypes] = useState<SearchEntityType[]>(SEARCH_TYPES)
  const [results, setResults] = useState<FederatedSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(initialQuery.trim().length >= 3)
  const activeRequest = useRef<{ id: number; controller: AbortController } | null>(null)
  const nextRequestId = useRef(0)
  const skipUrlSearch = useRef<string | null>(null)

  async function runSearch(value: string, selectedTypes = types) {
    const trimmed = value.trim()
    activeRequest.current?.controller.abort()
    if (trimmed.length < 3) {
      activeRequest.current = null
      setResults([])
      setError(trimmed ? 'Enter at least three characters.' : null)
      setHasSearched(false)
      setLoading(false)
      return
    }

    const request = {
      id: nextRequestId.current + 1,
      controller: new AbortController(),
    }
    nextRequestId.current = request.id
    activeRequest.current = request
    setLoading(true)
    setHasSearched(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q: trimmed, types: selectedTypes.join(','), limit: '20' })
      const response = await fetch(`/api/search?${params}`, { signal: request.controller.signal })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Search failed')
      if (activeRequest.current?.id !== request.id) return
      setResults(payload.results)
    } catch (searchError) {
      if (activeRequest.current?.id !== request.id || request.controller.signal.aborted) return
      setResults([])
      setError(searchError instanceof Error ? searchError.message : 'Search failed')
    } finally {
      if (activeRequest.current?.id === request.id) {
        activeRequest.current = null
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const trimmed = initialQuery.trim()
    setQuery(initialQuery)
    if (skipUrlSearch.current === trimmed) {
      skipUrlSearch.current = null
      return
    }
    skipUrlSearch.current = null
    void runSearch(trimmed)
    // The URL query initializes the view; filters deliberately rerun only on submit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  useEffect(() => () => activeRequest.current?.controller.abort(), [])

  function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed !== initialQuery.trim()) skipUrlSearch.current = trimmed
    router.replace(`/search?q=${encodeURIComponent(trimmed)}`)
    void runSearch(trimmed)
  }

  function toggleType(type: SearchEntityType) {
    const next = types.includes(type)
      ? types.length === 1 ? types : types.filter((item) => item !== type)
      : [...types, type]
    setTypes(next)
    if (query.trim().length >= 3) void runSearch(query, next)
  }

  return (
    <section className="mt-8" aria-label="Federated search">
      <form onSubmit={submit} className="flex max-w-3xl gap-2">
        <Input aria-label="Search all DroneWire content" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Button type="submit" disabled={loading || query.trim().length < 3}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Result types">
        {SEARCH_TYPES.map((type) => (
          <Button key={type} type="button" size="sm" variant={types.includes(type) ? 'secondary' : 'outline'} aria-pressed={types.includes(type)} onClick={() => toggleType(type)}>
            {type}
          </Button>
        ))}
      </div>
      {!hasSearched && !error && (
        <p className="mt-8 text-muted-foreground">
          Search articles, systems, explainers, and contracts by title, name, source, or other metadata.
        </p>
      )}
      {loading && (
        <p className="mt-6 flex items-center text-sm text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching DroneWire…
        </p>
      )}
      {error && <p className="mt-6 text-destructive" role="alert">{error}</p>}
      {!loading && !error && hasSearched && results.length === 0 && (
        <p className="mt-8 text-muted-foreground">No results found. Check the spelling or try a broader term.</p>
      )}
      <div className="mt-8 space-y-3">
        {results.map((result) => (
          <Link key={`${result.entityType}:${result.id}`} href={result.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{result.title}</h2>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{result.entityType}</Badge>
                    <Badge variant="outline">{result.provenanceLabel}</Badge>
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{result.snippet}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
