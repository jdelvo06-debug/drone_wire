import type { MetadataRoute } from 'next'

const robotsModule = require('@/app/robots')
const robots = robotsModule.default

const ORIGINAL_SITE_URL = process.env.SITE_URL

afterEach(() => {
  if (ORIGINAL_SITE_URL !== undefined) {
    process.env.SITE_URL = ORIGINAL_SITE_URL
  } else {
    delete process.env.SITE_URL
  }
})

describe('robots', () => {
  it('allows all user agents to crawl root', () => {
    process.env.SITE_URL = 'https://dronewire.org'
    const result = robots()

    expect(result.rules).toHaveLength(1)
    const rule = result.rules[0]
    expect(rule.userAgent).toBe('*')
    expect(rule.allow).toBe('/')
  })

  it('disallows /admin/ and /api/ paths', () => {
    process.env.SITE_URL = 'https://dronewire.org'
    const result = robots()

    const disallow = result.rules[0].disallow as string[]
    expect(disallow).toContain('/admin/')
    expect(disallow).toContain('/api/')
  })

  it('advertises sitemap.xml with the base URL', () => {
    process.env.SITE_URL = 'https://dronewire.org'
    const result = robots()

    expect(result.sitemap).toBe('https://dronewire.org/sitemap.xml')
  })

  it('normalizes trailing slash in sitemap URL', () => {
    process.env.SITE_URL = 'https://dronewire.org/'
    const result = robots()

    expect(result.sitemap).toBe('https://dronewire.org/sitemap.xml')
  })

  it('falls back to https://dronewire.org when SITE_URL is not set', () => {
    delete process.env.SITE_URL
    const result = robots()

    expect(result.sitemap).toBe('https://dronewire.org/sitemap.xml')
  })
})