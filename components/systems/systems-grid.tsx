'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { canOptimizeImage } from '@/lib/constants/images'
import { ArrowRight, Eye, Crosshair, Radar, Zap, Radio, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { System } from '@prisma/client'

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
    case 'c2': return 'C2 System'
    case 'sensor': return 'Sensor'
    case 'effector': return 'Effector'
    case 'integrated': return 'Integrated'
    default: return category
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'c2':
      return <Radio className="w-6 h-6 text-muted-foreground" />
    case 'sensor':
      return <Radar className="w-6 h-6 text-muted-foreground" />
    case 'effector':
      return <Zap className="w-6 h-6 text-muted-foreground" />
    case 'integrated':
      return <Crosshair className="w-6 h-6 text-muted-foreground" />
    default:
      return <Crosshair className="w-6 h-6 text-muted-foreground" />
  }
}

function getTrlBadgeClass(trl: number) {
  if (trl >= 9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (trl >= 7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

interface SystemsGridProps {
  systems: Array<Pick<System,
    | 'id'
    | 'slug'
    | 'name'
    | 'category'
    | 'status'
    | 'country'
    | 'manufacturer'
    | 'primaryCapability'
    | 'imageUrl'
    | 'platforms'
    | 'views'
    | 'featured'
    | 'trl'
    | 'estimatedPriceRange'
    | 'jiatf401Approved'
  >>
}

export default function SystemsGrid({ systems }: SystemsGridProps) {
  const [jcoOnly, setJcoOnly] = useState(false)

  const filtered = jcoOnly ? systems.filter(s => s.jiatf401Approved === true) : systems
  const featuredSystems = filtered.filter(s => s.featured).slice(0, 3)
  const featuredIds = new Set(featuredSystems.map(s => s.id))
  const nonFeaturedSystems = filtered.filter(s => !featuredIds.has(s.id))

  return (
    <div className="mt-12">
      {/* JCO Filter */}
      <div className="flex items-center space-x-3 mb-8">
        <Switch id="jco-filter" checked={jcoOnly} onCheckedChange={setJcoOnly} />
        <Label htmlFor="jco-filter" className="flex items-center space-x-2 cursor-pointer">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">JIATF-401 Approved Only</span>
        </Label>
        {jcoOnly && (
          <Badge variant="secondary" className="text-xs">
            {filtered.length} system{filtered.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Featured Section */}
      {featuredSystems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Systems</h2>
            <Badge variant="secondary">Key Capabilities</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredSystems.map((system) => (
              <Link key={system.id} href={`/systems/${system.slug}`}>
                <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                    {system.imageUrl ? (
                      <Image
                        src={system.imageUrl}
                        alt={system.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        unoptimized={!canOptimizeImage(system.imageUrl)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        {getCategoryIcon(system.category)}
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(system.category)}>
                        {getCategoryLabel(system.category)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      {system.trl && (
                        <Badge className={getTrlBadgeClass(system.trl)}>TRL {system.trl}</Badge>
                      )}
                      <Badge className={getStatusColor(system.status)}>
                        {system.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {system.name}
                      </h3>
                      {system.jiatf401Approved && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="JIATF-401 Approved" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {system.manufacturer} • {system.country}
                    </p>
                    {system.estimatedPriceRange && (
                      <p className="text-xs text-muted-foreground/70 mb-3">{system.estimatedPriceRange}</p>
                    )}
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {system.primaryCapability}
                    </p>

                    {system.platforms && system.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {system.platforms.slice(0, 3).map((platform, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {system.views.toLocaleString()} views
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

      {/* All Systems Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">All Systems</h2>
        {nonFeaturedSystems.length === 0 ? (
          <div className="text-center py-12">
            <Crosshair className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {jcoOnly ? 'No JCO-approved systems found' : 'No additional systems'}
            </h3>
            <p className="text-muted-foreground">
              {jcoOnly ? 'Try disabling the JCO filter to see all systems.' : 'All systems are shown in the featured section above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nonFeaturedSystems.map((system) => (
              <Link key={system.id} href={`/systems/${system.slug}`}>
                <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                    {system.imageUrl ? (
                      <Image
                        src={system.imageUrl}
                        alt={system.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={!canOptimizeImage(system.imageUrl)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        {getCategoryIcon(system.category)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex items-center gap-1">
                      <Badge className={getCategoryColor(system.category)}>
                        {getCategoryLabel(system.category)}
                      </Badge>
                      {system.trl && (
                        <Badge className={getTrlBadgeClass(system.trl)}>TRL {system.trl}</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                        {system.name}
                      </h3>
                      {system.jiatf401Approved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" aria-label="JIATF-401 Approved" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {system.manufacturer} • {system.country}
                    </p>
                    {system.estimatedPriceRange && (
                      <p className="text-xs text-muted-foreground/70 mb-2">{system.estimatedPriceRange}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {system.primaryCapability}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <Badge className={getStatusColor(system.status)} variant="secondary">
                        {system.status}
                      </Badge>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {system.views.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
