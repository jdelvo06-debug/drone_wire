
'use client'

import { useState } from 'react'
import { Search, BookOpen, Filter, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export type ExplainerCategoryCounts = Record<string, number>

export function buildExplainerCategories(counts: ExplainerCategoryCounts) {
  return [
    { value: 'all', label: 'All Categories', count: Object.values(counts).reduce((sum, count) => sum + count, 0) },
    { value: 'systems', label: 'Defense Systems', count: counts.systems || 0 },
    { value: 'threats', label: 'Threat Analysis', count: counts.threats || 0 },
    { value: 'countermeasures', label: 'Countermeasures', count: counts.countermeasures || 0 },
    { value: 'policy', label: 'Policy & Strategy', count: counts.policy || 0 },
    { value: 'concepts', label: 'Core Concepts', count: counts.concepts || 0 },
  ]
}

export default function ExplainersHeader({ categoryCounts }: { categoryCounts: ExplainerCategoryCounts }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = buildExplainerCategories(categoryCounts)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Explainers Library</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Learn how counter-drone tech works—from radar basics to directed energy weapons to policy frameworks.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search explainers"
            placeholder="Search explainers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center space-x-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" aria-label="Filter explainers by category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.label}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || searchTerm) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
              {categories.find(c => c.value === selectedCategory)?.label}
              <button className="ml-1 text-xs">×</button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => setSearchTerm('')}>
              &quot;{searchTerm}&quot;
              <button className="ml-1 text-xs">×</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
