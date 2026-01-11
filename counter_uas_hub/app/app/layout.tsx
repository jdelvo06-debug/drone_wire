
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DroneWire',
    template: '%s | DroneWire',
  },
  description: 'AI-curated news and explainers focused on drone warfare and counter-UAS technology',
  keywords: ['counter-UAS', 'drone warfare', 'defense technology', 'unmanned systems', 'military technology', 'DroneWire'],
  authors: [{ name: 'DroneWire' }],
  creator: 'DroneWire',
  publisher: 'DroneWire',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dronewire.com',
    title: 'DroneWire',
    description: 'AI-curated news and explainers focused on drone warfare and counter-UAS technology',
    siteName: 'DroneWire',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DroneWire',
    description: 'AI-curated news and explainers focused on drone warfare and counter-UAS technology',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
