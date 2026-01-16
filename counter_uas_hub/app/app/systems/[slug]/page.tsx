import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Shield, Target, Zap, Crosshair, MapPin, Building2, Flag, Calendar, Users, Radar, Radio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/db'
import ReactMarkdown from 'react-markdown'

export const dynamic = 'force-dynamic'

interface SystemPageProps {
  params: {
    slug: string
  }
}

async function getSystem(slug: string) {
  const system = await prisma.system.findUnique({
    where: { slug },
  })

  if (!system) return null

  // Increment view count (fire and forget)
  prisma.system.update({
    where: { slug },
    data: { views: { increment: 1 } },
  }).catch(() => {})

  return system
}

export async function generateMetadata({ params }: SystemPageProps): Promise<Metadata> {
  const system = await getSystem(params.slug)

  if (!system) {
    return {
      title: 'System Not Found',
    }
  }

  return {
    title: `${system.name} - C-UAS Systems`,
    description: system.description,
    openGraph: {
      title: system.name,
      description: system.description,
      type: 'article',
      images: system.imageUrl ? [system.imageUrl] : undefined,
    },
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'c2':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'sensor':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
    case 'effector':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'integrated':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'contracted':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'development':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'prototype':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'retired':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case 'c2':
      return 'C2 System'
    case 'sensor':
      return 'Sensor'
    case 'effector':
      return 'Effector'
    case 'integrated':
      return 'Integrated System'
    default:
      return category
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'c2':
      return <Radio className="w-8 h-8 text-muted-foreground" />
    case 'sensor':
      return <Radar className="w-8 h-8 text-muted-foreground" />
    case 'effector':
      return <Zap className="w-8 h-8 text-muted-foreground" />
    case 'integrated':
      return <Crosshair className="w-8 h-8 text-muted-foreground" />
    default:
      return <Crosshair className="w-8 h-8 text-muted-foreground" />
  }
}

export default async function SystemPage({ params }: SystemPageProps) {
  const system = await getSystem(params.slug)

  if (!system) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/systems">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Systems
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <Badge className={getCategoryColor(system.category)}>
                  {getCategoryLabel(system.category)}
                </Badge>
                <Badge className={getStatusColor(system.status)}>
                  {system.status}
                </Badge>
                {system.inServiceDate && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    In service: {system.inServiceDate}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {system.name}
              </h1>

              <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {system.manufacturer}
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-2" />
                  {system.country}
                </div>
              </div>

              <p className="text-xl text-muted-foreground">
                {system.description}
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {system.imageUrl ? (
                <Image
                  src={system.imageUrl}
                  alt={system.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  {getCategoryIcon(system.category)}
                </div>
              )}
            </div>

            {/* Quick Overview */}
            {(system.whatItIs || system.howItWorks) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crosshair className="w-5 h-5 mr-2" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {system.whatItIs && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What It Is</h4>
                      <p className="text-muted-foreground">{system.whatItIs}</p>
                    </div>
                  )}
                  {system.whatItIs && system.howItWorks && <Separator />}
                  {system.howItWorks && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
                      <p className="text-muted-foreground">{system.howItWorks}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Primary Capability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Primary Capability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{system.primaryCapability}</p>
              </CardContent>
            </Card>

            {/* Combat Record */}
            {system.combatRecord && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Combat Record / Operational History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{system.combatRecord}</p>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            {system.content && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown>{system.content}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Technical Specifications */}
            {system.specifications && system.specifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {system.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Range Information */}
            {(system.detectionRange || system.effectiveRange) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Range
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {system.detectionRange && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Detection Range</span>
                      <p className="text-sm text-muted-foreground">{system.detectionRange}</p>
                    </div>
                  )}
                  {system.effectiveRange && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Effective Range</span>
                      <p className="text-sm text-muted-foreground">{system.effectiveRange}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Platforms */}
            {system.platforms && system.platforms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compatible Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {system.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deployed By */}
            {system.deployedBy && system.deployedBy.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Deployed By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {system.deployedBy.map((user, index) => (
                      <Badge key={index} variant="secondary">
                        {user}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Features */}
            {system.keyFeatures && system.keyFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {system.keyFeatures.map((feature, index) => (
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
            {system.advantages && system.advantages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-600">
                    <Shield className="w-5 h-5 mr-2" />
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {system.advantages.map((advantage, index) => (
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
            {system.disadvantages && system.disadvantages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-red-600">
                    <Target className="w-5 h-5 mr-2" />
                    Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {system.disadvantages.map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                        <span className="text-sm text-muted-foreground">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Related Systems */}
            {system.relatedSystems && system.relatedSystems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {system.relatedSystems.map((related, index) => (
                      <Badge key={index} variant="outline">
                        {related}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
