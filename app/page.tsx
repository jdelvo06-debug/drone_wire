
import HeroSection from '@/components/home/hero-section'
import NewsSection from '@/components/home/news-section'
import FeaturedExplainers from '@/components/home/featured-explainers'
import StatsSection from '@/components/home/stats-section'
import SemanticSearch from '@/components/search/semantic-search'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'

export const revalidate = 600

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News Feed - Main Content */}
          <div className="lg:col-span-3">
            <NewsSection />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search Intelligence */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Search className="w-5 h-5 mr-2 text-primary" />
                  Search Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <SemanticSearch compact />
              </CardContent>
            </Card>

            {/* Featured Explainers */}
            <FeaturedExplainers />
          </div>
        </div>
      </div>
    </div>
  )
}
