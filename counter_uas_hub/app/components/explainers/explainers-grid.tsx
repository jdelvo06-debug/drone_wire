
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, ArrowRight, Shield, Zap, Target, Users, BookOpen, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const explainers = [
  {
    id: 1,
    title: 'Iron Dome Air Defense System',
    slug: 'iron-dome-air-defense-system',
    description: 'Israel\'s comprehensive multi-layered air defense system designed to intercept rockets, artillery shells, and mortars.',
    category: 'systems',
    difficulty: 'beginner',
    readTime: 8,
    views: 2840,
    imageUrl: 'https://www.navalnews.com/wp-content/uploads/2023/08/Iron-Dome-USMC.jpg',
    icon: Shield,
    featured: true,
    keyFeatures: ['Multi-layered Defense', 'AI Targeting', 'High Success Rate'],
    lastUpdated: new Date('2024-01-10'),
  },
  {
    id: 2,
    title: 'Radio Frequency Jamming Technology',
    slug: 'rf-jamming-technology',
    description: 'How RF jammers disrupt drone communications, GPS navigation, and control systems to neutralize UAV threats.',
    category: 'countermeasures',
    difficulty: 'intermediate',
    readTime: 12,
    views: 1980,
    imageUrl: 'https://www.l3harris.com/sites/default/files/styles/1440_x_810/public/2023-03/58142-EW-Overview-Infographic_2880x1620-smaller.png',
    icon: Zap,
    featured: true,
    keyFeatures: ['Signal Disruption', 'Multi-frequency', 'Directional Control'],
    lastUpdated: new Date('2024-01-08'),
  },
  {
    id: 3,
    title: 'Drone Swarm Attack Tactics',
    slug: 'drone-swarm-attack-tactics',
    description: 'Understanding coordinated UAV attacks, swarm intelligence, and their implications for modern warfare.',
    category: 'threats',
    difficulty: 'advanced',
    readTime: 15,
    views: 3120,
    imageUrl: 'https://deweb-519a7.b-cdn.net/post-images/6d174962-0c18-4bc8-abe6-1852765d4ed4.webp',
    icon: Target,
    featured: false,
    keyFeatures: ['Coordinated Attack', 'AI Swarm Logic', 'Overwhelming Defense'],
    lastUpdated: new Date('2024-01-05'),
  },
  {
    id: 4,
    title: 'Laser Weapon Systems (LAWS)',
    slug: 'laser-weapon-systems',
    description: 'High-energy laser systems for counter-UAS applications, including power requirements and effectiveness.',
    category: 'countermeasures',
    difficulty: 'intermediate',
    readTime: 10,
    views: 1650,
    imageUrl: 'https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/photo/directed-energy/DE-Hero-Morphius.png',
    icon: Zap,
    featured: false,
    keyFeatures: ['Directed Energy', 'Precision Targeting', 'Low Cost Per Shot'],
    lastUpdated: new Date('2024-01-03'),
  },
  {
    id: 5,
    title: 'Counter-UAS Policy Framework',
    slug: 'counter-uas-policy-framework',
    description: 'Legal and policy considerations for implementing counter-drone measures in civilian and military contexts.',
    category: 'policy',
    difficulty: 'beginner',
    readTime: 7,
    views: 890,
    imageUrl: 'https://i2.wp.com/opiniojuris.org/wp-content/uploads/scales-justice-wooden-gavel-earth-globe-d-rendering-isolated-white-background-183332238.jpg?fit=800%2C530&w=640',
    icon: Globe,
    featured: false,
    keyFeatures: ['Legal Framework', 'Civilian Protection', 'International Law'],
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 6,
    title: 'Patriot Missile Defense System',
    slug: 'patriot-missile-defense',
    description: 'Advanced surface-to-air missile system capabilities against aircraft, cruise missiles, and ballistic missiles.',
    category: 'systems',
    difficulty: 'intermediate',
    readTime: 11,
    views: 2240,
    imageUrl: 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/WXJDS4WZEVN4DHF3PB7BBLIOF4.jpg',
    icon: Shield,
    featured: true,
    keyFeatures: ['Long Range', 'Multi-Target', 'Mobile Platform'],
    lastUpdated: new Date('2023-12-28'),
  },
]

export default function ExplainersGrid() {
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

  return (
    <div className="mt-12">
      {/* Featured Section */}
      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Featured Explainers</h2>
          <Badge variant="secondary">Editor's Choice</Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {explainers.filter(e => e.featured).slice(0, 2).map((explainer) => (
            <Link key={explainer.id} href={`/explainers/${explainer.slug}`}>
              <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video rounded-t-lg overflow-hidden">
                  <Image
                    src={explainer.imageUrl || '/placeholder-explainer.jpg'}
                    alt={explainer.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
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
                  <div className="flex items-center space-x-2 mb-3">
                    <explainer.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {explainer.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {explainer.description}
                  </p>
                  
                  {/* Key Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {explainer.keyFeatures?.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {explainer.readTime}m read
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {explainer.views?.toLocaleString()} views
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

      {/* All Explainers Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">All Explainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {explainers.map((explainer) => (
            <Link key={explainer.id} href={`/explainers/${explainer.slug}`}>
              <Card className="military-card h-full group hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video rounded-t-lg overflow-hidden">
                  <Image
                    src={explainer.imageUrl || '/placeholder-explainer.jpg'}
                    alt={explainer.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getCategoryColor(explainer.category)}>
                      {explainer.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start space-x-2 mb-3">
                    <explainer.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {explainer.title}
                    </h3>
                  </div>
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
                      {explainer.views?.toLocaleString()} views
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => {
            // In a real app, this would load more explainers from an API
            // For now, we'll just show a toast notification
            console.log('Load more explainers functionality coming soon!')
          }}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Load More Explainers
        </Button>
      </div>
    </div>
  )
}
