import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Eye, AlertTriangle, Crosshair, Radar, Zap, Plane } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/db'

export const revalidate = 600 // ISR: revalidate every 10 minutes

export const metadata: Metadata = {
  title: 'UAS Threat Database',
  description: 'Adversary drones and UAS systems used in modern warfare. Loitering munitions, reconnaissance UAVs, and weaponized commercial drones.',
}

async function getThreatSystems() {
  const systems = await prisma.system.findMany({
    where: {
      category: {
        startsWith: 'threat-',
      },
    },
    orderBy: [
      { featured: 'desc' },
      { name: 'asc' },
    ],
  })
  return systems
}

function getCategoryColor(category: string) {
  switch (category) {
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
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
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
    case 'threat-loitering':
      return <Crosshair className="w-6 h-6 text-muted-foreground" />
    case 'threat-drone':
      return <Plane className="w-6 h-6 text-muted-foreground" />
    case 'threat-swarm':
      return <Radar className="w-6 h-6 text-muted-foreground" />
    default:
      return <AlertTriangle className="w-6 h-6 text-muted-foreground" />
  }
}

export default async function ThreatsPage() {
  const systems = await getThreatSystems()

  const loiteringMunitions = systems.filter(s => s.category === 'threat-loitering')
  const threatDrones = systems.filter(s => s.category === 'threat-drone')
  const swarmThreats = systems.filter(s => s.category === 'threat-swarm')

  const renderSystemCard = (system: typeof systems[0]) => (
    <Link key={system.id} href={`/systems/${system.slug}`}>
      <Card className="military-card h-full group hover:shadow-lg transition-all duration-300 border-red-200/50 dark:border-red-900/30">
        <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
          {system.imageUrl ? (
            <Image
              src={system.imageUrl}
              alt={system.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-950/20 to-muted/50 dark:from-red-950/40">
              {getCategoryIcon(system.category)}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(system.category)}>
              {getCategoryLabel(system.category)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight mb-1">
            {system.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            {system.manufacturer} &bull; {system.country}
          </p>
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
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">UAS Threat Database</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Adversary drones and UAS systems used in modern warfare. Loitering munitions, reconnaissance UAVs, and weaponized commercial drones.
          </p>
        </div>

        {systems.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No threat systems yet</h3>
            <p className="text-muted-foreground">Threat system data is being compiled.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Loitering Munitions */}
            {loiteringMunitions.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Crosshair className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold text-foreground">Loitering Munitions</h2>
                  <Badge variant="secondary">{loiteringMunitions.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {loiteringMunitions.map(renderSystemCard)}
                </div>
              </div>
            )}

            {/* Threat Drones / UAVs */}
            {threatDrones.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Plane className="w-5 h-5 text-red-500" />
                  <h2 className="text-2xl font-bold text-foreground">Threat UAVs</h2>
                  <Badge variant="secondary">{threatDrones.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {threatDrones.map(renderSystemCard)}
                </div>
              </div>
            )}

            {/* Swarm / FPV Threats */}
            {swarmThreats.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Radar className="w-5 h-5 text-rose-500" />
                  <h2 className="text-2xl font-bold text-foreground">Swarm &amp; FPV Threats</h2>
                  <Badge variant="secondary">{swarmThreats.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {swarmThreats.map(renderSystemCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
