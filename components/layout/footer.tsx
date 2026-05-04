
import Link from 'next/link'
import { Shield, Mail, Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">DroneWire</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              AI-curated news and comprehensive explainers focused on drone warfare, 
              counter-UAS technology, and defense innovations. Stay informed about the 
              rapidly evolving unmanned systems landscape.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="https://twitter.com/dronewire" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://github.com/dronewire" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href="mailto:info@dronewire.com">
                <Button variant="ghost" size="icon">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground">
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link href="/explainers" className="text-sm text-muted-foreground hover:text-foreground">
                  Explainers Library
                </Link>
              </li>
              <li>
                <Link href="/contracts" className="text-sm text-muted-foreground hover:text-foreground">
                  Contracts Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2025 DroneWire. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by AI • Built for Defense Professionals
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
