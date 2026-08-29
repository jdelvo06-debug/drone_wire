'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Loader2, MailX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function UnsubscribeForm({ token }: { token?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleUnsubscribe = async () => {
    if (!token) return
    setStatus('loading')
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      setStatus(response.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="p-8 text-center" role="status">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden="true" />
          <h1 className="mb-2 text-2xl font-semibold">You are unsubscribed</h1>
          <p className="mb-6 text-muted-foreground">DroneWire will no longer send newsletter or breaking-news email to this subscription.</p>
          <Button asChild variant="outline"><Link href="/">Return to DroneWire</Link></Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <MailX className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="text-2xl font-semibold leading-none tracking-tight">Unsubscribe from DroneWire</h1>
      </CardHeader>
      <CardContent className="space-y-5 text-center">
        {token ? (
          <>
            <p className="text-muted-foreground">Confirm that you want to stop newsletter and breaking-news email for this subscription.</p>
            {status === 'error' && (
              <p className="text-sm text-destructive" role="alert">This link could not be verified. Contact info@dronewire.org for help.</p>
            )}
            <Button onClick={handleUnsubscribe} disabled={status === 'loading'}>
              {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Confirm unsubscribe
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">
            Use the personalized unsubscribe link in a DroneWire email, or contact{' '}
            <a className="text-primary underline-offset-4 hover:underline" href="mailto:info@dronewire.org">info@dronewire.org</a>.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
