'use client'

import { useState, useEffect } from 'react'
import { Search, DollarSign, Download, Filter, TrendingUp, FileText, Award, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AgencyBarChart, TrendLineChart } from './contracts-charts'

interface Aggregates {
  totalValue: number
  averageValue: number
  maxValue: number
}

interface AgencyData {
  agency: string
  count: number
  totalValue: number
}

interface MonthData {
  month: string
  totalValue: number
}

interface ContractsData {
  pagination: {
    total: number
  }
  aggregates: Aggregates
  byAgency: AgencyData[]
  byMonth: MonthData[]
}

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [data, setData] = useState<ContractsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch('/api/contracts?limit=1')
        if (!response.ok) {
          throw new Error('Failed to fetch contracts data')
        }
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleExportCSV = () => {
    // CSV export functionality
    console.log('Exporting CSV...')
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

      {/* Charts Section */}
      {!loading && !error && data && (data.byAgency.length > 0 || data.byMonth.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.byAgency.length > 0 && <AgencyBarChart data={data.byAgency} />}
          {data.byMonth.length > 0 && <TrendLineChart data={data.byMonth} />}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-destructive">
          <p>Failed to load contract data: {error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Filters and Export */}
        <div className="flex items-center space-x-4">
          {/* Agency Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedAgency} onValueChange={setSelectedAgency}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                <SelectItem value="dod">Department of Defense</SelectItem>
                <SelectItem value="dhs">Department of Homeland Security</SelectItem>
                <SelectItem value="navy">US Navy</SelectItem>
                <SelectItem value="army">US Army</SelectItem>
                <SelectItem value="air-force">US Air Force</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="counter-uas">Counter-UAS</SelectItem>
              <SelectItem value="surveillance">Surveillance</SelectItem>
              <SelectItem value="research">Research & Development</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="maintenance">Maintenance & Support</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
