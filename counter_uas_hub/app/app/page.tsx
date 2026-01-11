
import HeroSection from '@/components/home/hero-section'
import NewsSection from '@/components/home/news-section'
import FeaturedExplainers from '@/components/home/featured-explainers'
import NewsletterSignup from '@/components/home/newsletter-signup'
import StatsSection from '@/components/home/stats-section'

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
            {/* Newsletter Signup */}
            <NewsletterSignup />
            
            {/* Featured Explainers */}
            <FeaturedExplainers />
          </div>
        </div>
      </div>
    </div>
  )
}
