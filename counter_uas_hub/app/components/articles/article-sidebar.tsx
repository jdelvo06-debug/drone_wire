
'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, TrendingUp, Users, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import NewsletterSignup from '@/components/home/newsletter-signup'

interface Article {
  id: string
  title: string
  category: string
  tags: string[]
}

interface RelatedArticle {
  id: string
  title: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt?: Date | null
  category: string
}

interface RelatedExplainer {
  slug: string
  title: string
  difficulty: string
  readTime: number
  category: string
}

interface TrendingTopic {
  name: string
  count: number
}

interface ArticleSidebarProps {
  article: Article
  relatedArticles?: RelatedArticle[]
  relatedExplainers?: RelatedExplainer[]
  trendingTopics?: TrendingTopic[]
}

export default function ArticleSidebar({ article, relatedArticles = [], relatedExplainers = [], trendingTopics = [] }: ArticleSidebarProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="space-y-6">
      {/* Share */}
      <Card>
        <CardContent className="p-4">
          <Button onClick={handleShare} className="w-full" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share This Article
          </Button>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Related Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/articles/${relatedArticle.id}`}>
                <div className="group p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer">
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {relatedArticle.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {relatedArticle.category.replace('-', ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
            <Link href="/articles">
              <Button variant="ghost" size="sm" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                More Articles
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Related Explainers */}
      {relatedExplainers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" />
              Related Explainers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {relatedExplainers.map((explainer) => (
              <Link key={explainer.slug} href={`/explainers/${explainer.slug}`}>
                <div className="group p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer">
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {explainer.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        explainer.difficulty === 'beginner'
                          ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-300'
                          : explainer.difficulty === 'intermediate'
                          ? 'border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300'
                          : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-300'
                      }`}
                    >
                      {explainer.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {explainer.readTime}m read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/explainers">
              <Button variant="ghost" size="sm" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Explainers
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={topic.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {topic.name}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {topic.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
