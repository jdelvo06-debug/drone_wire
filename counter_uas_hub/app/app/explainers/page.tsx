import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, Users, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'
import ExplainersHeader from '@/components/explainers/explainers-header'

export const metadata: Metadata = {
  title: 'Explainers Library',
  description: 'Comprehensive guides to counter-UAS systems, drone warfare tactics, and defense technologies',
}

async function getExplainers() {
  const explainers = await prisma.explainer.findMany({
    orderBy: [
      { featured: 'desc' },
      { views: 'desc' },
    ],
  })
  return explainers
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'systems':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'threats':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'countermeasures':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'policy':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default async function ExplainersPage() {
  const explainers = await getExplainers()
  const featuredExplainers = explainers.filter(e => e.featured).slice(0, 2)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <ExplainersHeader />

        <div className="mt-12">
          {/* Featured Section */}
          {featuredExplainers.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <h2 className="text-2xl font-bold text-foreground">Featured Explainers</h2>
                <Badge variant="secondary">Editor's Choice</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredExplainers.map((explainer) => (
                  <Link key={explainer.id} href={`/explainers/${explainer.slug}`}>
                    <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                        {explainer.imageUrl ? (
                          <Image
                            src={explainer.imageUrl}
                            alt={explainer.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(explainer.category)}>
                            {explainer.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className={getDifficultyColor(explainer.difficulty)}>
                            {explainer.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                          {explainer.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {explainer.description}
                        </p>

                        {/* Key Features */}
                        {explainer.keyFeatures && explainer.keyFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {explainer.keyFeatures.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {explainer.readTime}m read
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {explainer.views.toLocaleString()} views
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Explainers Grid */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">All Explainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {explainers.map((explainer) => (
                <Link key={explainer.id} href={`/explainers/${explainer.slug}`}>
                  <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                      {explainer.imageUrl ? (
                        <Image
                          src={explainer.imageUrl}
                          alt={explainer.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={getCategoryColor(explainer.category)}>
                          {explainer.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-3">
                        {explainer.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {explainer.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <Badge className={getDifficultyColor(explainer.difficulty)}>
                          {explainer.difficulty}
                        </Badge>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {explainer.readTime}m
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {explainer.views.toLocaleString()} views
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
