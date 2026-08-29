import type { Metadata } from 'next'
import { Suspense } from 'react'
import FederatedSearchPage from '@/components/search/federated-search-page'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search DroneWire articles, systems, explainers, and contracts.',
  alternates: { canonical: '/search' },
}

export default function SearchPage() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <h1 className="text-4xl font-bold">Search DroneWire</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Search across reporting, catalog systems, technical explainers, and contract awards.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading search…</p>}>
        <FederatedSearchPage />
      </Suspense>
    </main>
  )
}
