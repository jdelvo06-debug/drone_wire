import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-16 text-center">
      <div>
        <SearchX className="mx-auto mb-5 h-14 w-14 text-muted-foreground" aria-hidden="true" />
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mb-4 text-4xl font-bold">Intelligence page not found</h1>
        <p className="mb-8 text-muted-foreground">The requested DroneWire page may have moved or is no longer available.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/">Return home</Link></Button>
          <Button asChild variant="outline"><Link href="/articles">Browse articles</Link></Button>
        </div>
      </div>
    </div>
  )
}
