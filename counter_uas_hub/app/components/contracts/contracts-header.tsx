
'use client'

import { useState } from 'react'
import { Search, DollarSign, Download, Filter, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

export default function ContractsHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleExportCSV = () => {
    // CSV export functionality
    console.log('Exporting CSV...')
  }

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
                <p className="text-2xl font-bold text-foreground">$24.7B</p>
                <p className="text-sm text-muted-foreground">Total Contract Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">$2.3B</p>
                <p className="text-sm text-muted-foreground">Q1 2024 Awards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">+18%</p>
                <p className="text-sm text-muted-foreground">YoY Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
