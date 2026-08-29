'use client'

import React, { useState } from 'react'
import { ChevronUp, ChevronDown, Calendar, Building2, DollarSign, Info, Loader2, ExternalLink, Clock, MapPin, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { safeHttpUrl } from '@/lib/security/html'
import { formatContractAwardDate } from '@/lib/contracts/date'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContractsExplorer } from '@/components/contracts/contracts-explorer'

interface Contract {
  id: string
  contractNumber: string | null
  title: string
  company: string
  awardDate: string
  value: number
  currency: string
  agency: string
  category: string
  status: string
  duration: number | null
  description: string | null
  sourceUrl: string | null
  location?: string | null
  office?: string | null
}

type SortField = 'awardDate' | 'company' | 'title' | 'value' | 'agency'
type SortDirection = 'asc' | 'desc'

export default function ContractsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, loading: isLoading, error, refresh } = useContractsExplorer()
  const contracts = (data?.contracts || []) as Contract[]
  const requestedSort = searchParams.get('sortBy')
  const sortField: SortField = ['awardDate', 'company', 'title', 'value', 'agency'].includes(requestedSort || '') ? requestedSort as SortField : 'awardDate'
  const sortDirection: SortDirection = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc'
  const currentPage = data?.pagination.page || Math.max(1, Number(searchParams.get('page')) || 1)
  const totalPages = data?.pagination.totalPages || 1
  const totalContracts = data?.pagination.total || 0
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set())

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => params.set(key, value))
    router.replace(`/contracts?${params.toString()}`)
  }

  const toggleExpanded = (contractId: string) => {
    const newExpanded = new Set(expandedContracts)
    if (newExpanded.has(contractId)) {
      newExpanded.delete(contractId)
    } else {
      newExpanded.add(contractId)
    }
    setExpandedContracts(newExpanded)
  }

  const handleSort = (field: SortField) => {
    updateUrl({ sortBy: field, sortOrder: sortField === field && sortDirection === 'desc' ? 'asc' : 'desc', page: '1' })
  }

  const formatCurrency = (value: number) => {
    if (value === 0) return 'TBD'
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' }
      case 'completed':
        return { bg: 'bg-blue-500/15', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' }
      case 'terminated':
        return { bg: 'bg-red-500/15', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' }
      default:
        return { bg: 'bg-gray-500/15', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500' }
    }
  }

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'counter-uas':
        return { bg: 'bg-violet-500/15', text: 'text-violet-700 dark:text-violet-400', border: 'border-violet-500/30' }
      case 'surveillance':
        return { bg: 'bg-sky-500/15', text: 'text-sky-700 dark:text-sky-400', border: 'border-sky-500/30' }
      case 'research':
        return { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30' }
      case 'training':
        return { bg: 'bg-teal-500/15', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-500/30' }
      case 'electronic-warfare':
        return { bg: 'bg-rose-500/15', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/30' }
      case 'sensors':
        return { bg: 'bg-cyan-500/15', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500/30' }
      default:
        return { bg: 'bg-slate-500/15', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-500/30' }
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
      type="button"
    >
      <span className="flex items-center gap-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ?
            <ChevronUp className="w-3.5 h-3.5" /> :
            <ChevronDown className="w-3.5 h-3.5" />
        )}
      </span>
    </Button>
  )

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortField !== field) return 'none'
    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  if (isLoading) {
    return (
      <div className="mt-12 flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading contracts...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-12 text-center py-16">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={refresh}>
          Try Again
        </Button>
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="mt-12 text-center py-16">
        <p className="text-muted-foreground">No contracts found. Check back later for updates.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 min-w-0 max-w-full">
      <Card className="min-w-0 max-w-full overflow-hidden border-border/50">
        <CardContent className="min-w-0 p-0">
          <div className="hidden max-w-full overflow-x-auto md:block">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-b border-border/50 bg-muted/30">
                  <TableHead className="w-36 py-4" aria-sort={getAriaSort('awardDate')}>
                    <SortButton field="awardDate">Award Date</SortButton>
                  </TableHead>
                  <TableHead className="py-4" aria-sort={getAriaSort('title')}>
                    <SortButton field="title">Contract</SortButton>
                  </TableHead>
                  <TableHead className="py-4" aria-sort={getAriaSort('company')}>
                    <SortButton field="company">Contractor</SortButton>
                  </TableHead>
                  <TableHead className="text-right w-36 py-4" aria-sort={getAriaSort('value')}>
                    <SortButton field="value">Value</SortButton>
                  </TableHead>
                  <TableHead className="w-28 py-4">Status</TableHead>
                  <TableHead className="w-16 py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract, index) => {
                  const statusConfig = getStatusConfig(contract.status)
                  const categoryConfig = getCategoryConfig(contract.category)
                  const isExpanded = expandedContracts.has(contract.id)

                  return (
                    <React.Fragment key={contract.id}>
                      <TableRow
                        className={`border-b border-border/30 transition-colors hover:bg-muted/40 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-foreground">{formatContractAwardDate(contract.awardDate)}</span>
                            <span className="text-xs text-muted-foreground">{getRelativeTime(contract.awardDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-1.5 max-w-md">
                            <span className="font-semibold text-foreground leading-tight line-clamp-2">
                              {contract.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${categoryConfig.bg} ${categoryConfig.text} ${categoryConfig.border} text-xs font-medium px-2 py-0.5`}
                              >
                                {contract.category.replace('-', ' ')}
                              </Badge>
                              {contract.contractNumber && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  {contract.contractNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground/70" />
                              <span className="font-medium text-foreground">{contract.company}</span>
                            </div>
                            <span className="text-xs text-muted-foreground pl-6">{contract.agency}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className={`font-bold text-lg ${contract.value > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {formatCurrency(contract.value)}
                            </span>
                            {contract.duration && (
                              <span className="text-xs text-muted-foreground">
                                {contract.duration} mo. term
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                            <span className={`text-xs font-medium capitalize ${statusConfig.text}`}>
                              {contract.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(contract.id)}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${contract.title}`}
                            aria-expanded={isExpanded}
                            aria-controls={`contract-details-${contract.id}`}
                            className={`h-8 w-8 p-0 rounded-full transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <TableRow
                          id={`contract-details-${contract.id}`}
                          className="bg-muted/20 border-b border-border/30"
                        >
                          <TableCell colSpan={6} className="p-0">
                            <div className="px-6 py-5">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Description */}
                                <div className="lg:col-span-2">
                                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                    Contract Details
                                  </h4>
                                  {contract.description ? (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {contract.description}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                      No additional details available.
                                    </p>
                                  )}
                                </div>

                                {/* Quick Info */}
                                <div className="space-y-3">
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Quick Info</h4>

                                  <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">Awarded:</span>
                                      <span className="font-medium text-foreground">{formatContractAwardDate(contract.awardDate)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">Duration:</span>
                                      <span className="font-medium text-foreground">{contract.duration ? `${contract.duration} months` : 'Not reported'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">Value:</span>
                                      <span className="font-medium text-foreground">{formatCurrency(contract.value)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                      <MapPin className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">Location:</span>
                                      <span className="font-medium text-foreground">{contract.location || 'Not reported'}</span>
                                    </div>
                                  </div>

                                  {safeHttpUrl(contract.sourceUrl) && (
                                    <>
                                      <Separator className="my-3" />
                                      <a
                                        href={safeHttpUrl(contract.sourceUrl)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        View source award
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-4 p-4 md:hidden">
            {contracts.map((contract) => {
              const sourceUrl = safeHttpUrl(contract.sourceUrl)
              return (
                <article key={contract.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold leading-snug">{contract.title}</h2>
                    <Badge variant="outline">{contract.category.replace('-', ' ')}</Badge>
                  </div>
                  <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Agency</dt><dd>{contract.agency}</dd>
                    <dt className="text-muted-foreground">Company</dt><dd>{contract.company}</dd>
                    <dt className="text-muted-foreground">Award</dt><dd>{formatContractAwardDate(contract.awardDate)}</dd>
                    <dt className="text-muted-foreground">Value</dt><dd>{formatCurrency(contract.value)}</dd>
                    <dt className="text-muted-foreground">Status</dt><dd>{contract.status || 'Not reported'}</dd>
                    <dt className="text-muted-foreground">Duration</dt><dd>{contract.duration ? `${contract.duration} months` : 'Not reported'}</dd>
                    <dt className="text-muted-foreground">Location</dt><dd>{contract.location || 'Not reported'}</dd>
                  </dl>
                  {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">View source award <ExternalLink className="h-3.5 w-3.5" /></a>}
                </article>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{contracts.length}</span> of{' '}
          <span className="font-medium text-foreground">{totalContracts}</span> contracts
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => updateUrl({ page: String(Math.max(1, currentPage - 1)) })}
            className="h-9"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground min-w-[100px] text-center">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => updateUrl({ page: String(currentPage + 1) })}
            className="h-9"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
