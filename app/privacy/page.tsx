
import { Metadata } from 'next'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Counter-UAS Knowledge Hub',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Last updated: January 1, 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              At Counter-UAS Knowledge Hub, we are committed to protecting your privacy and ensuring the security of your personal information.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or use our services:
            </p>
            <ul>
              <li>Name and email address for newsletter subscriptions</li>
              <li>Contact information when you reach out to us</li>
              <li>Company information when provided</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Send you our newsletter and updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information</li>
              <li>Unsubscribe from our newsletter at any time</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@counter-uas-hub.com" className="text-primary hover:underline">
                privacy@counter-uas-hub.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
