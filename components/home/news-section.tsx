'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, ExternalLink, Tag as TagIcon, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import Image from 'next/image'
import { getImageWithFallback } from '@/lib/constants/images'

interface Tag {
  id: string
  name: string
  slug: string
  category: string
}

interface Article {
  id: string
  title: string
  excerpt: string | null
  sourceName: string
  sourceUrl: string | null
  publishedAt: string
  imageUrl: string | null
  category: string
  tags: Tag[]
  aiSummary: string | null
}

interface ArticlesResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = useCallback(async (pageNum: number, category: string, append: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '6',
        status: 'published',
      })
      if (category !== 'all') {
        params.set('category', category)
      }

      const response = await fetch(`/api/articles?${params}`)
      if (!response.ok) throw new Error('Failed to fetch articles')

      const data: ArticlesResponse = await response.json()

      if (append) {
        setArticles((prev) => [...prev, ...data.articles])
      } else {
        setArticles(data.articles)
      }
      setHasMore(data.pagination.hasMore)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles')
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setPage(1)
    fetchArticles(1, filter).finally(() => setIsLoading(false))
  }, [filter, fetchArticles])

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = page + 1
    await fetchArticles(nextPage, filter, true)
    setPage(nextPage)
    setIsLoadingMore(false)
  }

  const filteredArticles = articles

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Latest Intelligence</h2>
          <p className="text-muted-foreground mt-1">
            AI-curated news from defense industry sources
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="drone-warfare">Drone Warfare</SelectItem>
              <SelectItem value="counter-uas">Counter-UAS</SelectItem>
              <SelectItem value="contracts">Contracts</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading articles...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => fetchArticles(1, filter)}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found. Check back later for updates.</p>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-6">
        {!isLoading && filteredArticles.map((article) => (
          <Card key={article.id} className="article-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image */}
                <div className="lg:w-64 lg:flex-shrink-0">
                  <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={getImageWithFallback(article.imageUrl)}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 256px"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  {/* Meta */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{article.sourceName}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(article.publishedAt)}
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        article.category.split('|')[0] === 'contracts' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        article.category.split('|')[0] === 'drone-warfare' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        article.category.split('|')[0] === 'policy' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }
                    >
                      {article.category.split('|')[0].replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground leading-tight hover:text-primary transition-colors">
                    <Link href={`/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* AI Summary */}
                  {article.aiSummary && (
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-primary">AI Summary:</span> {article.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center flex-wrap gap-2">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      {article.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 pt-2">
                    <Link href={`/articles/${article.id}`}>
                      <Button variant="default" size="sm">
                        Read Analysis
                      </Button>
                    </Link>
                    {article.sourceUrl && (
                      <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Source
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {!isLoading && hasMore && filteredArticles.length > 0 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg" disabled={isLoadingMore} onClick={handleLoadMore}>
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Articles'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
