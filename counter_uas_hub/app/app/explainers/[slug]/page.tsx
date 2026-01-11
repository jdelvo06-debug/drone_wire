import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowLeft, Shield, Target, Zap, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/db'
import ReactMarkdown from 'react-markdown'

interface ExplainerPageProps {
  params: {
    slug: string
  }
}

async function getExplainer(slug: string) {
  const explainer = await prisma.explainer.findUnique({
    where: { slug },
  })

  if (!explainer) return null

  // Increment view count (fire and forget)
  prisma.explainer.update({
    where: { slug },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  return explainer
}

export async function generateMetadata({ params }: ExplainerPageProps): Promise<Metadata> {
  const explainer = await getExplainer(params.slug)

  if (!explainer) {
    return {
      title: 'Explainer Not Found',
    }
  }

  return {
    title: explainer.title,
    description: explainer.description,
    openGraph: {
      title: explainer.title,
      description: explainer.description,
      type: 'article',
      images: explainer.imageUrl ? [explainer.imageUrl] : undefined,
    },
  }
}

export default async function ExplainerPage({ params }: ExplainerPageProps) {
  const explainer = await getExplainer(params.slug)

  if (!explainer) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'systems':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'countermeasures':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'threats':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'policy':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/explainers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explainers
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <Badge className={getCategoryColor(explainer.category)}>
                  {explainer.category}
                </Badge>
                <Badge className={getDifficultyColor(explainer.difficulty)}>
                  {explainer.difficulty}
                </Badge>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {explainer.readTime} min read
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {explainer.title}
              </h1>

              <p className="text-xl text-muted-foreground">
                {explainer.description}
              </p>
            </div>

            {/* Hero Image */}
            {explainer.imageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={explainer.imageUrl}
                  alt={explainer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
              </div>
            )}

            {/* Quick Overview */}
            {(explainer.whatItIs || explainer.howItWorks) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {explainer.whatItIs && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Is</h4>
                      <p className="text-muted-foreground">{explainer.whatItIs}</p>
                    </div>
                  )}
                  {explainer.whatItIs && explainer.howItWorks && <Separator />}
                  {explainer.howItWorks && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
                      <p className="text-muted-foreground">{explainer.howItWorks}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown>{explainer.content}</ReactMarkdown>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Features */}
            {explainer.keyFeatures && explainer.keyFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explainer.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Advantages */}
            {explainer.advantages && explainer.advantages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-600">
                    <Shield className="w-5 h-5 mr-2" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explainer.advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Disadvantages */}
            {explainer.disadvantages && explainer.disadvantages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-red-600">
                    <Target className="w-5 h-5 mr-2" />
                    Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explainer.disadvantages.map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Real World Use */}
            {explainer.realWorldUse && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Real World Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{explainer.realWorldUse}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
