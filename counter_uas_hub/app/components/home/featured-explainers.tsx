
'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Shield, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const featuredExplainers = [
  {
    id: 1,
    title: 'Iron Dome System',
    slug: 'iron-dome-air-defense-system',
    description: 'Israel\'s multi-layered air defense system against rockets, artillery, and mortars.',
    category: 'systems',
    difficulty: 'beginner',
    readTime: 8,
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: 2,
    title: 'RF Jamming Technology',
    slug: 'rf-jamming-technology',
    description: 'How radio frequency jammers disrupt drone communications and navigation.',
    category: 'countermeasures',
    difficulty: 'intermediate',
    readTime: 12,
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  {
    id: 3,
    title: 'Drone Swarm Tactics',
    slug: 'drone-swarm-attack-tactics',
    description: 'Understanding coordinated UAV attacks and their military applications.',
    category: 'threats',
    difficulty: 'advanced',
    readTime: 15,
    icon: Target,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
]

export default function FeaturedExplainers() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Featured Explainers</CardTitle>
          </div>
          <Link href="/explainers">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Deep dives into counter-UAS systems and technologies
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {featuredExplainers.map((explainer, index) => (
          <Link key={explainer.id} href={`/explainers/${explainer.slug}`}>
            <div className="group p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-muted/30 transition-all cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${explainer.color} flex-shrink-0`}>
                  <explainer.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {explainer.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {explainer.description}
                  </p>
                  <div className="flex items-center space-x-3 mt-3">
                    <Badge 
                      variant="outline" 
                      className="text-xs py-0.5 px-2 h-5"
                    >
                      {explainer.difficulty}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {explainer.readTime}m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <Link href="/explainers">
          <Button variant="outline" className="w-full mt-4" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Browse All Explainers
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
