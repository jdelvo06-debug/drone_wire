'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  BookOpen,
  Users,
  Mail,
  Rss,
  Tag,
  CheckCircle,
  Clock,
  Brain,
} from 'lucide-react'

interface StatsCardsProps {
  overview: {
    totalArticles: number
    publishedArticles: number
    pendingArticles: number
    totalExplainers: number
    totalSubscribers: number
    totalContacts: number
    totalFeeds: number
    totalTags: number
    aiProcessingRate: number
  }
}

export default function StatsCards({ overview }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Articles',
      value: overview.totalArticles,
      icon: FileText,
      description: `${overview.publishedArticles} published, ${overview.pendingArticles} pending`,
      color: 'text-blue-500',
    },
    {
      title: 'AI Processing Rate',
      value: `${overview.aiProcessingRate}%`,
      icon: Brain,
      description: 'Articles with AI summaries',
      color: 'text-purple-500',
    },
    {
      title: 'Explainers',
      value: overview.totalExplainers,
      icon: BookOpen,
      description: 'Educational guides',
      color: 'text-green-500',
    },
    {
      title: 'Subscribers',
      value: overview.totalSubscribers,
      icon: Users,
      description: 'Newsletter signups',
      color: 'text-yellow-500',
    },
    {
      title: 'Contact Submissions',
      value: overview.totalContacts,
      icon: Mail,
      description: 'Inquiries received',
      color: 'text-orange-500',
    },
    {
      title: 'RSS Feeds',
      value: overview.totalFeeds,
      icon: Rss,
      description: 'Active sources',
      color: 'text-red-500',
    },
    {
      title: 'Tags',
      value: overview.totalTags,
      icon: Tag,
      description: 'Content categories',
      color: 'text-cyan-500',
    },
    {
      title: 'Published',
      value: overview.publishedArticles,
      icon: CheckCircle,
      description: 'Live articles',
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="military-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
