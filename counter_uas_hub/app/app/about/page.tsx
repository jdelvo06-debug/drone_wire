
import { Metadata } from 'next'
import { Shield, Target, Zap, Users, Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ContactForm from '@/components/about/contact-form'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'DroneWire aggregates news, contracts, and technical info on counter-drone systems. Learn what we do and why.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="p-4 rounded-lg bg-primary/10">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground">About Us</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            DroneWire aggregates news, contract data, and technical explainers on drone warfare and
            counter-UAS systems. We use AI to filter and summarize—so you don't have to read 50 articles a day.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Mission</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="military-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-lg bg-blue-100 dark:bg-blue-900 w-fit">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">AI-Powered Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We scrape RSS feeds and DoD announcements, then use AI to summarize articles and
                  tag them by topic. You get the signal, not the noise.
                </p>
              </CardContent>
            </Card>

            <Card className="military-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-lg bg-green-100 dark:bg-green-900 w-fit">
                  <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Strategic Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Counter-drone tech only. Sensors, effectors, C2 systems, plus the contracts and policy
                  that fund them.
                </p>
              </CardContent>
            </Card>

            <Card className="military-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-lg bg-purple-100 dark:bg-purple-900 w-fit">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Expert Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built for people who need to track this space—defense analysts, program managers,
                  researchers, and journalists.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Comprehensive Coverage</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Real-time News Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      AI-curated news from defense industry sources with expert analysis and context
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Technology Explainers</h4>
                    <p className="text-sm text-muted-foreground">
                      Deep-dive explanations of counter-UAS systems, threats, and countermeasures
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Contract Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive database of defense contracts and procurement activities
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Intelligence Briefings</h4>
                    <p className="text-sm text-muted-foreground">
                      Weekly newsletters with curated insights and trend analysis
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-8">
                  <blockquote className="text-lg italic text-muted-foreground mb-4">
                    "There's too much drone news to track manually. We built this to solve our own problem—now
                    we're sharing it."
                  </blockquote>
                  <cite className="text-sm font-semibold text-foreground">— Editorial Team</cite>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Email Us</h4>
                    <p className="text-muted-foreground">info@counter-uas-hub.com</p>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Available Monday-Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-muted-foreground">Washington, D.C. Metro Area</p>
                    <p className="text-sm text-muted-foreground">United States</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Have a tip or story lead?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  We're always looking for credible sources and breaking news in the counter-UAS space. 
                  Your insights help keep the defense community informed.
                </p>
                <p className="text-sm font-medium text-primary">tips@counter-uas-hub.com</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
