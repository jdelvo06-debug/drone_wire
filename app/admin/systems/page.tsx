'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, ImageOff, Loader2, Save, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface System {
  id: string
  slug: string
  name: string
  category: string
  status: string
  country: string
  imageUrl: string | null
}

const categoryColors: Record<string, string> = {
  integrated: 'bg-purple-500/10 text-purple-500',
  sensor: 'bg-blue-500/10 text-blue-500',
  effector: 'bg-red-500/10 text-red-500',
  c2: 'bg-green-500/10 text-green-500',
}

export default function AdminSystemsPage() {
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)
  const [editUrls, setEditUrls] = useState<Record<string, string>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string | null>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/systems?limit=200')
      .then((r) => r.json())
      .then((data) => {
        const items = data.systems || data
        setSystems(items)
        const urls: Record<string, string> = {}
        for (const s of items) {
          urls[s.slug] = s.imageUrl || ''
        }
        setEditUrls(urls)
        setLoading(false)
      })
  }, [])

  async function handleSave(slug: string) {
    setSaving((p) => ({ ...p, [slug]: true }))
    setSaved((p) => ({ ...p, [slug]: false }))

    const url = editUrls[slug]?.trim() || null
    const res = await fetch(`/api/admin/systems/${slug}/image`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: url }),
    })

    if (res.ok) {
      const updated = await res.json()
      setSystems((prev) =>
        prev.map((s) => (s.slug === slug ? { ...s, imageUrl: updated.imageUrl } : s))
      )
      setPreviewUrls((p) => ({ ...p, [slug]: undefined as unknown as null }))
      setSaved((p) => ({ ...p, [slug]: true }))
      setTimeout(() => setSaved((p) => ({ ...p, [slug]: false })), 2000)
    }
    setSaving((p) => ({ ...p, [slug]: false }))
  }

  function handleClear(slug: string) {
    setEditUrls((p) => ({ ...p, [slug]: '' }))
    setPreviewUrls((p) => ({ ...p, [slug]: null }))
  }

  function handlePreview(slug: string) {
    const url = editUrls[slug]?.trim()
    setPreviewUrls((p) => ({ ...p, [slug]: url || null }))
  }

  const filtered = systems.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.slug.toLowerCase().includes(filter.toLowerCase()) ||
      s.category.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">System Image Manager</h1>
          <p className="text-muted-foreground mt-1">
            {systems.length} systems &middot; {systems.filter((s) => s.imageUrl).length} with images
          </p>
        </div>
        <Input
          placeholder="Filter systems..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((system) => {
          const displayUrl =
            previewUrls[system.slug] !== undefined
              ? previewUrls[system.slug]
              : system.imageUrl
          const isSaving = saving[system.slug]
          const isSaved = saved[system.slug]

          return (
            <Card key={system.slug} className="overflow-hidden">
              <div className="relative h-40 bg-muted flex items-center justify-center">
                {displayUrl ? (
                  <Image
                    src={displayUrl}
                    alt={system.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageOff className="w-10 h-10" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{system.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{system.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className={categoryColors[system.category] || ''}>
                      {system.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={editUrls[system.slug] || ''}
                    onChange={(e) =>
                      setEditUrls((p) => ({ ...p, [system.slug]: e.target.value }))
                    }
                    placeholder="Image URL..."
                    className="text-xs h-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handlePreview(system.slug)}
                  >
                    <Eye className="w-3 h-3 mr-1" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={() => handleClear(system.slug)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs ml-auto"
                    onClick={() => handleSave(system.slug)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : isSaved ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
