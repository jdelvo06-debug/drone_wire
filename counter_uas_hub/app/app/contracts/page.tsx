
import { Metadata } from 'next'
import ContractsHeader from '@/components/contracts/contracts-header'
import ContractsTable from '@/components/contracts/contracts-table'

export const metadata: Metadata = {
  title: 'Contracts Tracker',
  description: 'Track defense contracts, funding, and procurement in the counter-UAS and drone warfare space',
}

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <ContractsHeader />
        <ContractsTable />
      </div>
    </div>
  )
}
