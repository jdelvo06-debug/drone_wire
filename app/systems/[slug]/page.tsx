import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { canOptimizeImage } from '@/lib/constants/images'
import Link from 'next/link'
import { ArrowLeft, Shield, Target, Zap, Crosshair, MapPin, Building2, Flag, Calendar, Users, Radar, Radio, DollarSign, CheckCircle2, XCircle, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import ReactMarkdown from 'react-markdown'
import ViewTracker from '@/components/analytics/view-tracker'
import JsonLd from '@/components/seo/json-ld'
import {
  ProvenanceBadge,
  SourceBibliography,
  ClaimProvenance,
  resolveRecordProvenanceLabel,
} from '@/components/content/provenance'

export const dynamic = 'force-dynamic'

interface SystemPageProps {
  params: Promise<{ slug: string }>
}

async function getSystem(slug: string) {
  const system = await prisma.system.findUnique({
    where: { slug },
    select: {
      id: true, name: true, slug: true, description: true, content: true, imageUrl: true,
      provenanceLabel: true,
      category: true, subcategory: true, manufacturer: true, country: true,
      primaryCapability: true, specifications: true, detectionRange: true, effectiveRange: true,
      platforms: true, status: true, inServiceDate: true, deployedBy: true, whatItIs: true,
      howItWorks: true, keyFeatures: true, advantages: true, disadvantages: true, combatRecord: true,
      trl: true, trlLabel: true, estimatedPriceRange: true, procurementStatus: true,
      ndaaCompliant: true, targetSet: true, defeatMechanism: true, unitWeightKg: true,
      jiatf401Approved: true, relatedSystems: true, views: true, featured: true,
      createdAt: true, updatedAt: true,
    },
  })

  if (!system) return null
  const [citationResult, mediaAssets] = await Promise.all([
    prisma.systemCitation.findMany({
      where: { systemId: system.id }, include: { source: true }, orderBy: { createdAt: 'asc' },
    }).then((citations) => ({ citations, unavailable: false })).catch(() => {
      logger.warn('System citations are temporarily unavailable')
      return { citations: [], unavailable: true }
    }),
    prisma.mediaAsset.findMany({
      where: { systemId: system.id }, include: { source: true }, orderBy: { createdAt: 'asc' },
    }).catch(() => []),
  ])
  return {
    ...system,
    citations: citationResult.citations,
    citationsUnavailable: citationResult.unavailable,
    mediaAssets,
  }
}

export async function generateMetadata({ params }: SystemPageProps): Promise<Metadata> {
  const { slug } = await params
  const system = await getSystem(slug)

  if (!system) {
    return {
      title: 'System Not Found',
    }
  }

  return {
    title: `${system.name} - C-UAS Systems`,
    description: system.description,
    alternates: { canonical: `/systems/${system.slug}` },
    openGraph: {
      title: system.name,
      description: system.description,
      type: 'article',
      url: `/systems/${system.slug}`,
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
    case 'threat-loitering':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'threat-drone':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'threat-swarm':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'operational':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'combat-proven':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
    case 'threat-loitering':
      return 'Loitering Munition'
    case 'threat-drone':
      return 'Threat UAV'
    case 'threat-swarm':
      return 'Swarm / FPV'
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
    case 'threat-loitering':
    case 'threat-drone':
    case 'threat-swarm':
      return <Target className="w-8 h-8 text-muted-foreground" />
    default:
      return <Crosshair className="w-8 h-8 text-muted-foreground" />
  }
}

export default async function SystemPage({ params }: SystemPageProps) {
  const { slug } = await params
  const system = await getSystem(slug)

  if (!system) {
    notFound()
  }

  const siteUrl = process.env.SITE_URL || 'https://dronewire.org'
  const systemUrl = `${siteUrl}/systems/${system.slug}`
  const requiredClaimKeys = [
    system.manufacturer && 'manufacturer', system.status && 'status', system.detectionRange && 'detectionRange',
    system.effectiveRange && 'effectiveRange', system.estimatedPriceRange && 'estimatedPriceRange',
    system.procurementStatus && 'procurementStatus', system.ndaaCompliant !== null && 'ndaaCompliant',
    system.jiatf401Approved !== null && 'jiatf401Approved', system.combatRecord && 'combatRecord',
    system.trl && 'trl', system.unitWeightKg && 'unitWeightKg',
    system.specifications.length > 0 && 'specifications', system.content && 'content',
  ].filter((value): value is string => Boolean(value))
  const provenanceLabel = resolveRecordProvenanceLabel(system.provenanceLabel, system.citations, requiredClaimKeys)
  const sources = Array.from(
    new Map(system.citations.map((citation) => [citation.source.id, citation.source])).values(),
  )
  const heroMedia = system.mediaAssets.find((asset) => asset.controlledUrl === system.imageUrl || asset.remoteUrl === system.imageUrl)

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            headline: system.name,
            description: system.description,
            image: system.imageUrl || undefined,
            mainEntityOfPage: systemUrl,
            publisher: { '@type': 'Organization', name: 'DroneWire', url: siteUrl },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Systems', item: `${siteUrl}/systems` },
              { '@type': 'ListItem', position: 3, name: system.name, item: systemUrl },
            ],
          },
        ],
      }} />
      <ViewTracker entityType="system" entityId={system.id} />
      <div className="container mx-auto px-4 py-12">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={system.category.startsWith('threat-') ? '/threats' : '/systems'}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {system.category.startsWith('threat-') ? 'Back to Threats' : 'Back to Systems'}
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
                <div>
                  <Badge className={getStatusColor(system.status)}>{system.status}</Badge>
                  <ClaimProvenance claimKey="status" citations={system.citations} unavailable={system.citationsUnavailable} />
                </div>
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
                  <ClaimProvenance claimKey="manufacturer" citations={system.citations} unavailable={system.citationsUnavailable} />
                </div>
                <div className="flex items-center">
                  <Flag className="w-4 h-4 mr-2" />
                  {system.country}
                </div>
              </div>

              <p className="text-xl text-muted-foreground">
                {system.description}
              </p>
              <div className="mt-4">
                <ProvenanceBadge label={provenanceLabel} />
              </div>
            </div>

            {/* Hero Image */}
            <figure>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                {system.imageUrl ? (
                  <Image
                    src={system.imageUrl}
                    alt={system.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    priority
                    unoptimized={!canOptimizeImage(system.imageUrl)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    {getCategoryIcon(system.category)}
                  </div>
                )}
              </div>
              {system.imageUrl && (
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  {heroMedia
                    ? `Image: ${heroMedia.attribution} · ${heroMedia.license} · ${heroMedia.verificationState}`
                    : 'Image attribution and license metadata have not yet been published; treat this legacy image as unverified.'}
                </figcaption>
              )}
            </figure>

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
                  <ClaimProvenance claimKey="combatRecord" citations={system.citations} unavailable={system.citationsUnavailable} />
                </CardContent>
              </Card>
            )}

            {/* Procurement Intelligence */}
            {(system.trl || system.estimatedPriceRange || system.procurementStatus || system.ndaaCompliant !== null || system.jiatf401Approved !== null || system.targetSet || system.defeatMechanism || system.unitWeightKg) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Procurement Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* TRL Badge */}
                    {system.trl && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">Technology Readiness</span>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            system.trl >= 9 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            system.trl >= 7 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          }>
                            TRL {system.trl}
                          </Badge>
                          {system.trlLabel && (
                            <span className="text-sm text-muted-foreground">{system.trlLabel}</span>
                          )}
                        </div>
                        <ClaimProvenance claimKey="trl" citations={system.citations} unavailable={system.citationsUnavailable} />
                      </div>
                    )}

                    {/* Price Range */}
                    {system.estimatedPriceRange && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">Est. Price Range</span>
                        <span className="text-sm text-muted-foreground">{system.estimatedPriceRange}</span>
                        <ClaimProvenance claimKey="estimatedPriceRange" citations={system.citations} unavailable={system.citationsUnavailable} />
                      </div>
                    )}

                    {/* NDAA Compliant */}
                    {system.ndaaCompliant !== null && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">NDAA Sec. 889</span>
                        <div className="flex items-center space-x-1">
                          {system.ndaaCompliant === true ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 dark:text-green-400">Compliant</span>
                            </>
                          ) : system.ndaaCompliant === false ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600 dark:text-red-400">Non-Compliant</span>
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-muted-foreground">Unknown</span>
                            </>
                          )}
                        </div>
                        <ClaimProvenance claimKey="ndaaCompliant" citations={system.citations} unavailable={system.citationsUnavailable} />
                      </div>
                    )}

                    {/* JIATF-401 Approved */}
                    {system.jiatf401Approved !== null && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">JIATF-401 Approved</span>
                        <div className="flex items-center space-x-1">
                          {system.jiatf401Approved ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600 dark:text-green-400">Approved</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-muted-foreground">No</span>
                            </>
                          )}
                        </div>
                        <ClaimProvenance claimKey="jiatf401Approved" citations={system.citations} unavailable={system.citationsUnavailable} />
                      </div>
                    )}

                    {/* Target Set */}
                    {system.targetSet && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">Target Set</span>
                        <span className="text-sm text-muted-foreground">{system.targetSet}</span>
                      </div>
                    )}

                    {/* Defeat Mechanism */}
                    {system.defeatMechanism && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">Defeat Mechanism</span>
                        <span className="text-sm text-muted-foreground">{system.defeatMechanism}</span>
                      </div>
                    )}

                    {/* Unit Weight */}
                    {system.unitWeightKg && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-foreground">Unit Weight</span>
                        <span className="text-sm text-muted-foreground">{system.unitWeightKg} kg</span>
                        <ClaimProvenance claimKey="unitWeightKg" citations={system.citations} unavailable={system.citationsUnavailable} />
                      </div>
                    )}
                  </div>

                  {/* Procurement Status - full width */}
                  {system.procurementStatus && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm font-medium text-foreground">Procurement Status</span>
                      <p className="text-sm text-muted-foreground mt-1">{system.procurementStatus}</p>
                      <ClaimProvenance claimKey="procurementStatus" citations={system.citations} unavailable={system.citationsUnavailable} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            {system.content && (
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
                  {system.content}
                </ReactMarkdown>
                <ClaimProvenance claimKey="content" citations={system.citations} unavailable={system.citationsUnavailable} />
              </div>
            )}

            <SourceBibliography sources={sources} unavailable={system.citationsUnavailable} />
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
                        <ClaimProvenance claimKey={`specifications:${index}`} citations={system.citations} unavailable={system.citationsUnavailable} />
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
                      <ClaimProvenance claimKey="detectionRange" citations={system.citations} unavailable={system.citationsUnavailable} />
                    </div>
                  )}
                  {system.effectiveRange && (
                    <div>
                      <span className="text-sm font-medium text-foreground">Effective Range</span>
                      <p className="text-sm text-muted-foreground">{system.effectiveRange}</p>
                      <ClaimProvenance claimKey="effectiveRange" citations={system.citations} unavailable={system.citationsUnavailable} />
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
