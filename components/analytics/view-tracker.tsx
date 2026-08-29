'use client'

import { useEffect, useRef } from 'react'

export default function ViewTracker({
  entityType,
  entityId,
}: {
  entityType: 'article' | 'system' | 'explainer'
  entityId: string
}) {
  const sent = useRef(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || sent.current) return
    sent.current = true
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, entityId }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never block content rendering.
    })
  }, [entityId, entityType])

  return null
}
