
import { Metadata } from 'next'
import ExplainersGrid from '@/components/explainers/explainers-grid'
import ExplainersHeader from '@/components/explainers/explainers-header'

export const metadata: Metadata = {
  title: 'Explainers Library',
  description: 'Comprehensive guides to counter-UAS systems, drone warfare tactics, and defense technologies',
}

export default function ExplainersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <ExplainersHeader />
        <ExplainersGrid />
      </div>
    </div>
  )
}
