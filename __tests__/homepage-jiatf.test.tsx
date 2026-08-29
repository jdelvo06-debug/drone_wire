import fs from 'node:fs'
import path from 'node:path'

const homePage = fs.readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8')
const articleSidebar = fs.readFileSync(path.join(process.cwd(), 'components/articles/article-sidebar.tsx'), 'utf8')
const header = fs.readFileSync(path.join(process.cwd(), 'components/layout/header.tsx'), 'utf8')
const footer = fs.readFileSync(path.join(process.cwd(), 'components/layout/footer.tsx'), 'utf8')
const explainerSeed = fs.readFileSync(path.join(process.cwd(), 'scripts/seed-explainers.ts'), 'utf8')

describe('homepage JIATF content', () => {
  it('uses revalidation so corrected featured records do not remain frozen at build time', () => {
    expect(homePage).toMatch(/export const revalidate\s*=\s*\d+/)
  })

  it('keeps the canonical JIATF title and description in the seed source and removes the superseded title', () => {
    expect(explainerSeed).toContain('JIATF 401: The Defense Department’s Counter-UAS Task Force')
    expect(explainerSeed).toContain('JIATF 401 is the Defense Department task force established in August 2025 to align authorities and resources and accelerate delivery of joint counter-small-UAS capabilities.')
    expect(explainerSeed).not.toContain("JIATF-401: The Pentagon's New Counter-Drone Authority")
  })

  it('does not expose newsletter signup CTAs on public surfaces', () => {
    for (const source of [homePage, articleSidebar, header, footer]) {
      expect(source).not.toMatch(/NewsletterSignup|newsletter-signup|\/api\/newsletter\/subscribe/i)
    }
  })
})
