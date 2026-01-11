'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Filter, SortDesc } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ArticleFiltersProps {
  currentCategory?: string
  currentSearch?: string
  currentSort?: string
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'counter-uas', label: 'Counter-UAS' },
  { value: 'drone-warfare', label: 'Drone Warfare' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'policy', label: 'Policy' },
]

const sortOptions = [
  { value: 'publishedAt', label: 'Most Recent' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'confidence', label: 'Highest Relevance' },
]

export default function ArticleFilters({
  currentCategory,
  currentSearch,
  currentSort,
}: ArticleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch || '')

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Reset page when filters change
    params.delete('page')

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    startTransition(() => {
      router.push(`/articles?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchValue || undefined })
  }

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value })
  }

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value })
  }

  const clearFilters = () => {
    setSearchValue('')
    startTransition(() => {
      router.push('/articles')
    })
  }

  const hasFilters = currentCategory || currentSearch || currentSort

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={currentCategory || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <SortDesc className="w-4 h-4 text-muted-foreground" />
          <Select
            value={currentSort || 'publishedAt'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
