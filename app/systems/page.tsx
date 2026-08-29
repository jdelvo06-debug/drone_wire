import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import SystemsHeader from '@/components/systems/systems-header'
import SystemsGrid from '@/components/systems/systems-grid'

export const revalidate = 600 // ISR: revalidate every 10 minutes
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'C-UAS Systems Database',
  description: 'Browse counter-drone systems: sensors, effectors, C2, and integrated solutions. Specs, manufacturers, and deployment status.',
  alternates: { canonical: '/systems' },
}

async function getSystems() {
  const systems = await prisma.system.findMany({
    where: {
      NOT: {
        category: {
          startsWith: 'threat-',
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { name: 'asc' },
    ],
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      status: true,
      country: true,
      manufacturer: true,
      primaryCapability: true,
      imageUrl: true,
      platforms: true,
      views: true,
      featured: true,
      trl: true,
      estimatedPriceRange: true,
      jiatf401Approved: true,
      updatedAt: true,
    },
  })
  return systems
}

export default async function SystemsPage() {
  const systems = await getSystems()
  const lastUpdated = systems.reduce<Date | null>((latest, system) => !latest || system.updatedAt > latest ? system.updatedAt : latest, null)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <SystemsHeader />
        {lastUpdated && <p className="mt-4 text-center text-sm text-muted-foreground">Catalog last updated {lastUpdated.toLocaleDateString('en-US', { dateStyle: 'long' })}</p>}
        <SystemsGrid systems={JSON.parse(JSON.stringify(systems))} />
      </div>
    </div>
  )
}
