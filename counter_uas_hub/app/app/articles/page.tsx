import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getImageWithFallback } from '@/lib/constants/images'

export const dynamic = 'force-dynamic'
import { Clock, ExternalLink, Calendar, Tag as TagIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import ArticleFilters from '@/components/articles/article-filters'

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Latest articles and analysis on counter-UAS technology and drone warfare',
}

interface ArticlesPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
    sortBy?: string
  }
}

async function getArticles(searchParams: ArticlesPageProps['searchParams']) {
  const page = Math.max(1, parseInt(searchParams.page || '1'))
  const limit = 10
  const skip = (page - 1) * limit
  const category = searchParams.category
  const search = searchParams.search
  const sortBy = searchParams.sortBy || 'publishedAt'

  const where: Record<string, unknown> = {
    status: 'published',
  }

  if (category && category !== 'all') {
    where.category = category
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { aiSummary: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy: Record<string, string> = {}
  if (['publishedAt', 'views', 'confidence'].includes(sortBy)) {
    orderBy[sortBy] = 'desc'
  } else {
    orderBy.publishedAt = 'desc'
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ])

  return {
    articles: articles.map((article) => ({
      ...article,
      tags: article.tags.map((at) => at.tag.name),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { articles, pagination } = await getArticles(searchParams)

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'drone-warfare':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'policy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Articles</h1>
          <p className="text-xl text-muted-foreground">
            Latest articles and analysis on counter-UAS technology and drone warfare
          </p>
        </div>

        {/* Filters */}
        <ArticleFilters
          currentCategory={searchParams.category}
          currentSearch={searchParams.search}
          currentSort={searchParams.sortBy}
        />

        {/* Results count */}
        <div className="text-sm text-muted-foreground mb-6">
          Showing {articles.length} of {pagination.total} articles
          {searchParams.search && ` for "${searchParams.search}"`}
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
            <Link href="/articles">
              <Button variant="outline" className="mt-4">Clear filters</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <Card key={article.id} className="military-card group">
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
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </div>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category.replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-foreground leading-tight hover:text-primary transition-colors">
                        <Link href={`/articles/${article.id}`}>
                          {article.title}
                        </Link>
                      </h3>

                      {/* Excerpt / AI Summary */}
                      <p className="text-muted-foreground leading-relaxed line-clamp-2">
                        {article.aiSummary || article.excerpt || 'No description available.'}
                      </p>

                      {/* Tags */}
                      {article.tags.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2">
                          <TagIcon className="w-4 h-4 text-muted-foreground" />
                          {article.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 5 && (
                            <span className="text-xs text-muted-foreground">
                              +{article.tags.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4">
                          <Link href={`/articles/${article.id}`}>
                            <Button variant="default" size="sm">
                              Read Full Analysis
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
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {article.readTime && (
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.readTime}m read
                            </div>
                          )}
                          <span>{article.views?.toLocaleString() || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {pagination.page > 1 && (
              <Link
                href={`/articles?page=${pagination.page - 1}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
              >
                <Button variant="outline">Previous</Button>
              </Link>
            )}
            <div className="flex items-center px-4 text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            {pagination.page < pagination.totalPages && (
              <Link
                href={`/articles?page=${pagination.page + 1}${searchParams.category ? `&category=${searchParams.category}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
              >
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
