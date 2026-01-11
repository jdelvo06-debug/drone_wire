'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown, Calendar, Building, DollarSign, Info, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
}

interface ContractsResponse {
  contracts: Contract[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  aggregates: {
    totalValue: number
    averageValue: number
    maxValue: number
  }
}

type SortField = 'awardDate' | 'company' | 'title' | 'value' | 'agency'
type SortDirection = 'asc' | 'desc'

export default function ContractsTable() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('awardDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalContracts, setTotalContracts] = useState(0)
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set())

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy: sortField,
        sortDir: sortDirection,
      })

      const response = await fetch(`/api/contracts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch contracts')

      const data: ContractsResponse = await response.json()
      setContracts(data.contracts)
      setTotalPages(data.pagination.totalPages)
      setTotalContracts(data.pagination.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contracts')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, sortField, sortDirection])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

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
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1) // Reset to first page on sort change
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'terminated':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'counter-uas':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'surveillance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'research':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'training':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'electronic-warfare':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'sensors':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4" /> :
            <ChevronDown className="w-4 h-4" />
        )}
      </span>
    </Button>
  )

  if (isLoading) {
    return (
      <div className="mt-12 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading contracts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-12 text-center py-12">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={fetchContracts}>
          Try Again
        </Button>
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="mt-12 text-center py-12">
        <p className="text-muted-foreground">No contracts found. Check back later for updates.</p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-32">
                    <SortButton field="awardDate">Date</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="company">Company</SortButton>
                  </TableHead>
                  <TableHead>
                    <SortButton field="title">Contract Title</SortButton>
                  </TableHead>
                  <TableHead className="text-right w-32">
                    <SortButton field="value">Value</SortButton>
                  </TableHead>
                  <TableHead className="w-24">
                    <SortButton field="agency">Agency</SortButton>
                  </TableHead>
                  <TableHead className="w-32">Category</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-20">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <React.Fragment key={contract.id}>
                    <TableRow className="border-b hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{formatDate(contract.awardDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{contract.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground mb-1">{contract.title}</div>
                          {contract.contractNumber && (
                            <div className="text-xs text-muted-foreground">
                              {contract.contractNumber}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold text-foreground">
                            {formatCurrency(contract.value)}
                          </span>
                        </div>
                        {contract.duration && (
                          <div className="text-xs text-muted-foreground text-right mt-1">
                            {contract.duration} months
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{contract.agency}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(contract.category)}>
                          {contract.category.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(contract.id)}
                          className="hover:bg-muted/50"
                          title={expandedContracts.has(contract.id) ? "Hide details" : "Show details"}
                        >
                          {expandedContracts.has(contract.id) ?
                            <ChevronUp className="w-4 h-4" /> :
                            <Info className="w-4 h-4" />
                          }
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedContracts.has(contract.id) && contract.description && (
                      <TableRow key={`${contract.id}-details`} className="border-b bg-muted/20">
                        <TableCell colSpan={8} className="py-4">
                          <div className="pl-6 pr-4">
                            <div className="text-sm text-foreground leading-relaxed">
                              {contract.description}
                            </div>
                            {contract.sourceUrl && (
                              <a
                                href={contract.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                              >
                                View source →
                              </a>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {contracts.length} of {totalContracts} contracts
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
