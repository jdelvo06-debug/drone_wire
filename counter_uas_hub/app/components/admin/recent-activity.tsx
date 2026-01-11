'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface RecentArticle {
  id: string
  title: string
  sourceName: string
  status: string
  createdAt: string
}

interface FeedHealth {
  active: number
  inactive: number
  withErrors: number
}

interface RecentActivityProps {
  recentArticles: RecentArticle[]
  feedHealth: FeedHealth
}

export default function RecentActivity({
  recentArticles,
  feedHealth,
}: RecentActivityProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Articles */}
      <Card className="military-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/articles/${article.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{article.sourceName}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(article.createdAt)}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(article.status)}>
                  {article.status}
                </Badge>
              </div>
            ))}
            {recentArticles.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No recent articles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feed Health */}
      <Card className="military-card">
        <CardHeader>
          <CardTitle className="text-lg">Feed Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
              <span className="text-sm font-medium">Active Feeds</span>
              <span className="text-2xl font-bold text-green-500">
                {feedHealth.active}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-500/10">
              <span className="text-sm font-medium">Inactive Feeds</span>
              <span className="text-2xl font-bold text-gray-500">
                {feedHealth.inactive}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
              <span className="text-sm font-medium">Feeds with Errors</span>
              <span className="text-2xl font-bold text-red-500">
                {feedHealth.withErrors}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Link
                href="/api/cron/scrape-news"
                target="_blank"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <span>Trigger News Scrape</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link
                href="/api/cron/process-ai"
                target="_blank"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                <span>Trigger AI Processing</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
