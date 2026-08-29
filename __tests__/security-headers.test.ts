/** @jest-environment node */

import fs from 'fs'
import path from 'path'

describe('Next.js security headers', () => {
  it('applies the baseline browser security policy to all routes', async () => {
    const config = require('@/next.config.js')
    const headers = await config.headers()
    const global = headers.find((entry: { source: string }) => entry.source === '/:path*')
    const byName = new Map(global.headers.map((header: { key: string; value: string }) => (
      [header.key.toLowerCase(), header.value]
    )))

    expect(byName.get('content-security-policy')).toContain("frame-ancestors 'none'")
    if (process.env.NODE_ENV === 'production') {
      expect(byName.get('content-security-policy')).not.toContain("'unsafe-eval'")
    } else {
      expect(byName.get('content-security-policy')).toContain("'unsafe-eval'")
    }
    expect(byName.get('x-content-type-options')).toBe('nosniff')
    expect(byName.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
    expect(byName.get('permissions-policy')).toBeDefined()
  })

  it('initializes BotID client instrumentation only in production builds', () => {
    const instrumentation = fs.readFileSync(path.join(process.cwd(), 'instrumentation-client.ts'), 'utf8')

    expect(instrumentation).toContain("process.env.NODE_ENV === 'production'")
    expect(instrumentation).toContain("process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'")
    expect(instrumentation.indexOf("process.env.NODE_ENV === 'production'"))
      .toBeLessThan(instrumentation.indexOf('initBotId({'))
  })
})
