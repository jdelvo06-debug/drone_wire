'use client'

import { useState } from 'react'
import { Search, Crosshair, Filter, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface SystemsHeaderProps {
  onSearch?: (term: string) => void
  onCategoryChange?: (category: string) => void
  onStatusChange?: (status: string) => void
}

export default function SystemsHeader({ onSearch, onCategoryChange, onStatusChange }: SystemsHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'integrated', label: 'Integrated Systems' },
    { value: 'sensor', label: 'Sensors' },
    { value: 'effector', label: 'Effectors' },
    { value: 'c2', label: 'C2 Systems' },
  ]

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'operational', label: 'Operational' },
    { value: 'contracted', label: 'Contracted' },
    { value: 'development', label: 'In Development' },
    { value: 'prototype', label: 'Prototype' },
  ]

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onCategoryChange?.(value)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    onStatusChange?.(value)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Crosshair className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">C-UAS Systems Database</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Browse C-UAS tech by category: sensors, effectors, C2, and integrated systems. Filter by status and country.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search systems..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center space-x-4 flex-wrap gap-y-2">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => handleCategoryChange('all')}>
              {categories.find(c => c.value === selectedCategory)?.label}
              <button className="ml-1 text-xs">×</button>
            </Badge>
          )}
          {selectedStatus !== 'all' && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => handleStatusChange('all')}>
              {statuses.find(s => s.value === selectedStatus)?.label}
              <button className="ml-1 text-xs">×</button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="outline" className="cursor-pointer" onClick={() => handleSearchChange('')}>
              &quot;{searchTerm}&quot;
              <button className="ml-1 text-xs">×</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
