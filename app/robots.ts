import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
  const raw = process.env.SITE_URL || 'https://dronewire.org'
  return raw.replace(/\/+$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}