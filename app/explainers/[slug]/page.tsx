import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { canOptimizeImage } from '@/lib/constants/images'
import Link from 'next/link'
import { Clock, ArrowLeft, Shield, Target, Zap, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
import ReactMarkdown from 'react-markdown'
import ViewTracker from '@/components/analytics/view-tracker'
import JsonLd from '@/components/seo/json-ld'
import {
  ProvenanceBadge,
  SourceBibliography,
  ClaimProvenance,
  resolveRecordProvenanceLabel,
} from '@/components/content/provenance'

interface ExplainerPageProps {
  params: Promise<{ slug: string }>
}

async function getExplainer(slug: string) {
  const explainer = await prisma.explainer.findUnique({
    where: { slug },
    select: {
      id: true, title: true, slug: true, description: true, content: true, imageUrl: true,
      provenanceLabel: true,
      category: true, difficulty: true, readTime: true, views: true, featured: true,
      whatItIs: true, howItWorks: true, keyFeatures: true, advantages: true,
      disadvantages: true, realWorldUse: true, relatedSystems: true, createdAt: true, updatedAt: true,
    },
  })

  if (!explainer) return null

  const [citationResult, mediaAssets] = await Promise.all([
    prisma.explainerCitation.findMany({
      where: { explainerId: explainer.id }, include: { source: true }, orderBy: { createdAt: 'asc' },
    }).then((citations) => ({ citations, unavailable: false })).catch(() => {
      logger.warn('Explainer citations are temporarily unavailable')
      return { citations: [], unavailable: true }
    }),
    prisma.mediaAsset.findMany({
      where: { explainerId: explainer.id }, include: { source: true }, orderBy: { createdAt: 'asc' },
    }).catch(() => []),
  ])
  return {
    ...explainer,
    citations: citationResult.citations,
    citationsUnavailable: citationResult.unavailable,
    mediaAssets,
  }
}

export async function generateMetadata({ params }: ExplainerPageProps): Promise<Metadata> {
  const { slug } = await params
  const explainer = await getExplainer(slug)

  if (!explainer) {
    return {
      title: 'Explainer Not Found',
    }
  }

  return {
    title: explainer.title,
    description: explainer.description,
    alternates: { canonical: `/explainers/${explainer.slug}` },
    openGraph: {
      title: explainer.title,
      description: explainer.description,
      type: 'article',
      url: `/explainers/${explainer.slug}`,
      images: explainer.imageUrl ? [explainer.imageUrl] : undefined,
    },
  }
}

export default async function ExplainerPage({ params }: ExplainerPageProps) {
  const { slug } = await params
  const explainer = await getExplainer(slug)

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

  const siteUrl = process.env.SITE_URL || 'https://dronewire.org'
  const explainerUrl = `${siteUrl}/explainers/${explainer.slug}`
  const provenanceLabel = resolveRecordProvenanceLabel(explainer.provenanceLabel, explainer.citations, ['content'])
  const sources = Array.from(
    new Map(explainer.citations.map((citation) => [citation.source.id, citation.source])).values(),
  )
  const heroMedia = explainer.mediaAssets.find((asset) => asset.controlledUrl === explainer.imageUrl || asset.remoteUrl === explainer.imageUrl)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            headline: explainer.title,
            description: explainer.description,
            image: explainer.imageUrl || undefined,
            mainEntityOfPage: explainerUrl,
            publisher: { '@type': 'Organization', name: 'DroneWire', url: siteUrl },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Explainers', item: `${siteUrl}/explainers` },
              { '@type': 'ListItem', position: 3, name: explainer.title, item: explainerUrl },
            ],
          },
        ],
      }} />
      <ViewTracker entityType="explainer" entityId={explainer.id} />
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
              <div className="mt-4">
                <ProvenanceBadge label={provenanceLabel} />
              </div>
            </div>

            {/* Hero Image */}
            {explainer.imageUrl && (
              <figure>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={explainer.imageUrl}
                    alt={explainer.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    priority
                    unoptimized={!canOptimizeImage(explainer.imageUrl)}
                  />
                </div>
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  {heroMedia
                    ? `Image: ${heroMedia.attribution} · ${heroMedia.license} · ${heroMedia.verificationState}`
                    : 'Image attribution and license metadata have not yet been published; treat this legacy image as unverified.'}
                </figcaption>
              </figure>
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
              <ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
                {explainer.content}
              </ReactMarkdown>
              <ClaimProvenance claimKey="content" citations={explainer.citations} unavailable={explainer.citationsUnavailable} />
            </div>

            <SourceBibliography sources={sources} unavailable={explainer.citationsUnavailable} />
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
