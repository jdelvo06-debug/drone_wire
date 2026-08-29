'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, DollarSign, Download, Filter, TrendingUp, FileText, Award, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContractsExplorer } from '@/components/contracts/contracts-explorer'

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

export default function ContractsHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, facets, loading, error } = useContractsExplorer()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedAgency, setSelectedAgency] = useState(searchParams.get('agency') || 'all')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setSelectedAgency(searchParams.get('agency') || 'all')
    setSelectedCategory(searchParams.get('category') || 'all')
    setSelectedStatus(searchParams.get('status') || 'all')
  }, [searchParams])

  const updateUrl = (updates: Record<string, string>, cancelPendingSearch = false) => {
    if (cancelPendingSearch && searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => value && value !== 'all' ? params.set(key, value) : params.delete(key))
    params.delete('page')
    router.replace(`/contracts?${params.toString()}`)
  }

  useEffect(() => {
    searchDebounceRef.current = setTimeout(() => updateUrl({ search: searchTerm }), 350)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const handleExportCSV = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    else params.delete('search')
    window.location.assign(`/api/contracts/export?${params.toString()}`)
  }

  const totalContracts = data?.pagination.total || 0
  const totalValue = data?.aggregates.totalValue || 0
  const averageValue = data?.aggregates.averageValue || 0
  const maxValue = data?.aggregates.maxValue || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Contracts Tracker</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Track defense contracts, funding, and procurement in the counter-UAS and drone warfare space
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
                )}
                <p className="text-sm text-muted-foreground">Total Contract Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{totalContracts.toLocaleString()}</p>
                )}
                <p className="text-sm text-muted-foreground">Total Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(averageValue)}</p>
                )}
                <p className="text-sm text-muted-foreground">Average Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-600" />
              <div>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(maxValue)}</p>
                )}
                <p className="text-sm text-muted-foreground">Largest Contract</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center text-destructive">
          <p>Failed to load contract data: {error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search contracts"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters and Export */}
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:items-center">
          {/* Agency Filter */}
          <div className="flex min-w-0 items-center gap-2">
            <Filter className="hidden w-4 shrink-0 text-muted-foreground sm:block" />
            <Select value={selectedAgency} onValueChange={(value) => { setSelectedAgency(value); updateUrl({ agency: value, search: searchTerm }, true) }}>
              <SelectTrigger className="w-full sm:w-40" aria-label="Filter contracts by agency">
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {facets.agencies.map((agency) => <SelectItem key={agency} value={agency}>{agency}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); updateUrl({ category: value, search: searchTerm }, true) }}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter contracts by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {facets.categories.map((category) => <SelectItem key={category} value={category}>{category.replace(/-/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); updateUrl({ status: value, search: searchTerm }, true) }}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter contracts by status"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {facets.statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
