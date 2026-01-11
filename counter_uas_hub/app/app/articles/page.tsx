
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ExternalLink, Calendar, Tag as TagIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Latest articles and analysis on counter-UAS technology and drone warfare',
}

const articles = [
  {
    id: '7',
    title: 'Ukraine Mobile C-UAS Units: Revolutionary Battlefield Deployment Tactics',
    excerpt: 'Ukrainian forces have pioneered rapid-deployment mobile counter-UAS systems that combine electronic warfare, kinetic intercept, and real-time intelligence to counter Russian drone swarms across multiple front lines.',
    sourceName: 'DroneWire Intelligence',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-20'),
    imageUrl: 'https://cdn.abacus.ai/images/c7bb2b92-c09b-4815-bab4-a7a0a8790812.png',
    category: 'counter-uas',
    tags: ['Ukraine', 'Mobile C-UAS', 'Electronic Warfare', 'Battlefield Tactics', 'Rapid Deployment'],
    readTime: 8,
    views: 42100,
  },
  {
    id: '8',
    title: 'Israeli Iron Dome Evolution: Countering Gaza Drone Swarm Attacks',
    excerpt: 'Israel has upgraded Iron Dome systems with specialized anti-drone capabilities after facing coordinated swarm attacks from Gaza, demonstrating new intercept techniques and radar integration methods.',
    sourceName: 'DroneWire Defense Analysis',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-18'),
    imageUrl: 'https://cdn.abacus.ai/images/560a4976-0b52-4c18-be3f-5d4220d376db.png',
    category: 'counter-uas',
    tags: ['Israel', 'Iron Dome', 'Gaza', 'Drone Swarms', 'Air Defense', 'Intercept Technology'],
    readTime: 7,
    views: 38500,
  },
  {
    id: '9',
    title: 'Electronic Warfare Lessons: C-UAS Signal Intelligence from Ukraine Conflict',
    excerpt: 'Analysis of electronic warfare techniques used by Ukrainian forces reveals sophisticated signal intelligence gathering and jamming strategies that have proven effective against Russian drone operations.',
    sourceName: 'DroneWire Technology',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-16'),
    imageUrl: 'https://cdn.abacus.ai/images/a312ddef-611a-4d21-86aa-c37d41693e79.png',
    category: 'counter-uas',
    tags: ['Electronic Warfare', 'SIGINT', 'Ukraine', 'Jamming Techniques', 'Signal Analysis'],
    readTime: 9,
    views: 35200,
  },
  {
    id: '10',
    title: 'Middle East C-UAS Operations: Desert Deployment Strategies from Yemen Conflict',
    excerpt: 'Coalition forces in Yemen have developed specialized counter-UAS tactics for desert environments, including mobile radar systems and coordinated electronic attack strategies against Houthi drone threats.',
    sourceName: 'DroneWire Regional Analysis',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-15'),
    imageUrl: 'https://cdn.abacus.ai/images/0d932b9b-a1c5-4c57-ac90-e4c6902641ce.png',
    category: 'counter-uas',
    tags: ['Yemen', 'Middle East', 'Desert Operations', 'Houthis', 'Coalition Forces', 'Mobile Radar'],
    readTime: 8,
    views: 29800,
  },
  {
    id: '11',
    title: 'Real-Time C-UAS Command Centers: Operational Intelligence from Global Conflicts',
    excerpt: 'Modern tactical operations centers are integrating AI-powered threat assessment with human operators to coordinate multi-layered counter-UAS responses across active conflict zones.',
    sourceName: 'DroneWire Command Analysis',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-14'),
    imageUrl: 'https://cdn.abacus.ai/images/31452771-41c8-4169-98b9-b16913def9c6.png',
    category: 'counter-uas',
    tags: ['Command Centers', 'AI Integration', 'Threat Assessment', 'Multi-layered Defense', 'Operations'],
    readTime: 7,
    views: 33400,
  },
  {
    id: '12',
    title: 'Advanced Radar Systems: Next-Gen Detection Against Stealth Drone Threats',
    excerpt: 'Military forces worldwide are deploying advanced radar systems capable of detecting small, low-signature drones using multi-frequency scanning and AI-enhanced target recognition.',
    sourceName: 'DroneWire Radar Technology',
    sourceUrl: 'https://dronewire.ai',
    publishedAt: new Date('2025-09-12'),
    imageUrl: 'https://cdn.abacus.ai/images/1502ff3e-1895-4262-934b-b1b4d333e862.png',
    category: 'counter-uas',
    tags: ['Advanced Radar', 'Stealth Detection', 'Multi-frequency', 'AI Recognition', 'Low Signature'],
    readTime: 6,
    views: 27600,
  },
  {
    id: '1',
    title: 'Russian Drones Violate Polish Airspace in Historic NATO Response',
    excerpt: 'Russian drones entered Polish airspace during a large-scale assault on Ukraine on September 9-10, 2025, marking the first time NATO forces fired shots in response to Russian actions since the 2022 invasion.',
    sourceName: 'Reuters',
    sourceUrl: 'https://reuters.com',
    publishedAt: new Date('2025-09-10'),
    imageUrl: 'https://cdn.abacus.ai/images/83fb88ac-d2a1-4c66-86b1-b06bb36667dd.png',
    category: 'drone-warfare',
    tags: ['NATO', 'Poland', 'Russia', 'Ukraine', 'Airspace Violation'],
    readTime: 6,
    views: 24800,
  },
  {
    id: '2',
    title: 'DroneShield Expands US R&D Operations for Counter-UAS Technology',
    excerpt: 'DroneShield announced a significant expansion of its U.S.-based research and development operations, aiming to double its workforce and enhance AI and machine learning capabilities for improved drone detection.',
    sourceName: 'DroneLife',
    sourceUrl: 'https://dronelife.com',
    publishedAt: new Date('2025-09-22'),
    imageUrl: 'https://cdn.abacus.ai/images/8b0aafb8-b0dc-4ca5-857a-1d9c4709f7e5.png',
    category: 'counter-uas',
    tags: ['DroneShield', 'R&D', 'AI', 'Machine Learning', 'Detection'],
    readTime: 5,
    views: 18300,
  },
  {
    id: '3',
    title: 'US Navy Awards Major Drone Contracts to Five Defense Giants',
    excerpt: 'The U.S. Navy contracted Anduril, Northrop Grumman, Boeing, General Atomics, and Lockheed Martin for the development of Collaborative Combat Aircraft (CCA) - autonomous carrier-based drones.',
    sourceName: 'Navy Times',
    sourceUrl: 'https://navytimes.com',
    publishedAt: new Date('2025-09-05'),
    imageUrl: 'https://cdn.abacus.ai/images/4810a4f0-14e7-4aca-a710-280e41983620.png',
    category: 'contracts',
    tags: ['US Navy', 'CCA', 'Autonomous Drones', 'Defense Contracts'],
    readTime: 7,
    views: 19700,
  },
  {
    id: '4',
    title: 'Sentrycs Wins Army Innovation Award for Breakthrough C-UAS Technology',
    excerpt: 'Sentrycs was awarded the 2025 Army Technology Innovation Award for its Cyber over RF (CoRF) system that uses protocol-level analysis to provide detailed intelligence on drone threats.',
    sourceName: 'Sentrycs',
    sourceUrl: 'https://sentrycs.com',
    publishedAt: new Date('2025-09-17'),
    imageUrl: 'https://cdn.abacus.ai/images/624e21a3-c585-406a-97a2-24f033c25c0c.png',
    category: 'counter-uas',
    tags: ['Sentrycs', 'Army Award', 'CoRF System', 'Drone Intelligence'],
    readTime: 4,
    views: 12600,
  },
  {
    id: '5',
    title: 'Ukraine Destroys Russian Aircraft in Historic Crimea Drone Strike',
    excerpt: 'Ukrainian military intelligence used drones to destroy two Russian Be-12 amphibious aircraft and an Mi-8 helicopter in occupied Crimea, marking the first successful strike on the Be-12 model.',
    sourceName: 'UPI',
    sourceUrl: 'https://upi.com',
    publishedAt: new Date('2025-09-22'),
    imageUrl: 'https://cdn.abacus.ai/images/5893d105-2418-4513-9187-e6d940e77692.png',
    category: 'drone-warfare',
    tags: ['Ukraine', 'Crimea', 'Deep Strike', 'Military Intelligence'],
    readTime: 5,
    views: 31200,
  },
  {
    id: '6',
    title: 'US Commerce Department Prepares Chinese Drone Import Restrictions',
    excerpt: 'The U.S. Commerce Department is expected to issue new rules restricting imports of Chinese-made drones, particularly targeting companies like DJI, as part of ongoing national security efforts.',
    sourceName: 'UAV Coach',
    sourceUrl: 'https://uavcoach.com',
    publishedAt: new Date('2025-09-25'),
    imageUrl: 'https://cdn.abacus.ai/images/89310662-3e95-46f7-a6d0-12d2ecbd4a9d.png',
    category: 'policy',
    tags: ['Commerce Department', 'Chinese Drones', 'DJI', 'Import Restrictions'],
    readTime: 6,
    views: 16900,
  },
]

export default function ArticlesPage() {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'drone-warfare':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'policy':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Articles</h1>
          <p className="text-xl text-muted-foreground">
            Latest articles and analysis on counter-UAS technology and drone warfare
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-8">
          {articles.map((article) => (
            <Card key={article.id} className="military-card group">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="lg:w-64 lg:flex-shrink-0">
                    <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={article.imageUrl || '/placeholder-article.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 256px"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    {/* Meta */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{article.sourceName}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground leading-tight hover:text-primary transition-colors">
                      <Link href={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground leading-relaxed">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center flex-wrap gap-2">
                      <TagIcon className="w-4 h-4 text-muted-foreground" />
                      {article.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <Link href={`/articles/${article.id}`}>
                          <Button variant="default" size="sm">
                            Read Full Analysis
                          </Button>
                        </Link>
                        <Link href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Source
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime}m read
                        </div>
                        <span>{article.views?.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
