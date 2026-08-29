'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('DroneWire page error', error.digest || 'no-digest')
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center px-4 py-16 text-center">
      <div>
        <AlertTriangle className="mx-auto mb-5 h-14 w-14 text-destructive" aria-hidden="true" />
        <h1 className="mb-4 text-3xl font-bold">This page could not be loaded</h1>
        <p className="mb-8 text-muted-foreground">Try the request again. If the problem continues, DroneWire may be temporarily unavailable.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
