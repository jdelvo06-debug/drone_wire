
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ExternalLink, User, TrendingUp, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ReactMarkdown from 'react-markdown'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  sourceName: string
  sourceUrl: string
  publishedAt: Date
  imageUrl?: string
  category: string
  tags: string[]
  aiSummary?: string
  whyItMatters?: string
  keyPoints?: string[]
  author: string
  readTime: number
  views: number
  confidence?: number
}

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback to copying URL to clipboard
      await navigator.clipboard.writeText(window.location.href)
      // Could show a toast here
    }
    
    setIsSharing(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'drone-warfare':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'counter-uas':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <article className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Badge className={getCategoryColor(article.category)}>
            {article.category.replace('-', ' ')}
          </Badge>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {article.readTime} min read
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {article.views?.toLocaleString()} views
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {article.author}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Source
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleShare} disabled={isSharing}>
            <Share2 className="w-4 h-4 mr-2" />
            {isSharing ? 'Sharing...' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 75vw"
            priority
          />
        </div>
      )}

      {/* AI Summary */}
      {article.aiSummary && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">{article.aiSummary}</p>
                {article.confidence && (
                  <div className="flex items-center mt-3 text-xs text-muted-foreground">
                    <span>Confidence: {Math.round(article.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Points */}
      {article.keyPoints && article.keyPoints.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Key Takeaways</h3>
            <ul className="space-y-2">
              {article.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Why It Matters */}
      {article.whyItMatters && (
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Why It Matters</h3>
            <p className="text-muted-foreground leading-relaxed">{article.whyItMatters}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      <Separator />
      <div>
        <h3 className="font-semibold text-foreground mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Source Attribution */}
      <Card className="bg-muted/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Original Source</h4>
              <p className="text-sm text-muted-foreground mt-1">{article.sourceName}</p>
            </div>
            <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Original
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
