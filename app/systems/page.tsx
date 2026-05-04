import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import SystemsHeader from '@/components/systems/systems-header'
import SystemsGrid from '@/components/systems/systems-grid'

export const revalidate = 600 // ISR: revalidate every 10 minutes

export const metadata: Metadata = {
  title: 'C-UAS Systems Database',
  description: 'Browse counter-drone systems: sensors, effectors, C2, and integrated solutions. Specs, manufacturers, and deployment status.',
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
  })
  return systems
}

export default async function SystemsPage() {
  const systems = await getSystems()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <SystemsHeader />
        <SystemsGrid systems={JSON.parse(JSON.stringify(systems))} />
      </div>
    </div>
  )
}
