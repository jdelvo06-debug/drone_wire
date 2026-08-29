
import { Metadata } from 'next'

export const revalidate = 300 // ISR: revalidate every 5 minutes

import ContractsHeader from '@/components/contracts/contracts-header'
import ContractsTable from '@/components/contracts/contracts-table'
import { Suspense } from 'react'
import { ContractsExplorer } from '@/components/contracts/contracts-explorer'

export const metadata: Metadata = {
  title: 'Contracts Tracker',
  description: 'Track defense contracts, funding, and procurement in the counter-UAS and drone warfare space',
  alternates: { canonical: '/contracts' },
}

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<p className="text-muted-foreground">Loading contracts explorer…</p>}>
          <ContractsExplorer>
            <ContractsHeader />
            <ContractsTable />
          </ContractsExplorer>
        </Suspense>
      </div>
    </div>
  )
}
