
'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: name.split(' ')[0] || '',
          lastName: name.split(' ').slice(1).join(' ') || '',
          source: 'website',
        }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive our weekly intelligence briefing.",
        })
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Welcome Aboard!
          </h3>
          <p className="text-green-700 dark:text-green-300 text-sm">
            You're now subscribed to our weekly Counter-UAS intelligence briefing.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Intelligence Briefing</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Weekly analysis of counter-UAS developments, contracts, and threats delivered to your inbox.
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-name" className="text-sm font-medium">
              Name (optional)
            </Label>
            <Input
              id="newsletter-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newsletter-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe to Updates
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No spam. Unsubscribe anytime. Read our{' '}
            <a href="/privacy" className="text-primary hover:underline">
              privacy policy
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
