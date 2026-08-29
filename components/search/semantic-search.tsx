'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SearchResult {
  entityType: 'article' | 'system' | 'explainer' | 'contract'
  id: string
  title: string
  href: string
  snippet: string
  category: string | null
  imageUrl: string | null
  provenanceLabel: string
  score: number
}

interface SemanticSearchProps {
  compact?: boolean
  categoryFilter?: string
}

export default function SemanticSearch({ compact = false, categoryFilter }: SemanticSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams({ q: searchQuery })
      if (categoryFilter) params.set('category', categoryFilter)
      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data.results)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [categoryFilter])

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (query.length < 3) {
      setResults([])
      setHasSearched(false)
      return
    }
    debounceTimer.current = setTimeout(() => doSearch(query), 500)
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [query, doSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    doSearch(query)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="Semantic search"
            type="search"
            placeholder={compact ? 'Semantic search...' : 'Search with AI (e.g. "drone jamming technology")'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="submit"
          size={compact ? 'sm' : 'default'}
          disabled={isLoading || query.length < 3}
          aria-label="Run semantic search"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </form>

      {isLoading && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Searching with AI...
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No results found. Try a different query.
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((result) => (
            <Link key={`${result.entityType}:${result.id}`} href={result.href}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className={compact ? 'p-3' : 'p-4'}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold text-foreground line-clamp-2 ${compact ? 'text-sm' : ''}`}>
                      {result.title}
                    </h4>
                    <Badge variant="secondary" className="text-xs shrink-0">{result.entityType}</Badge>
                  </div>
                  {!compact && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {result.snippet}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{result.provenanceLabel}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {result.category?.replace('-', ' ') || 'general'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
