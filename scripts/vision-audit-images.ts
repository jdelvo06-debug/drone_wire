/**
 * Vision Audit — System Image Accuracy Check
 *
 * For each system with a non-null imageUrl, uses GPT-4o vision to ask:
 * "Does this image actually show [system name]?"
 *
 * Outputs a report of PASS / FAIL / UNCERTAIN with reasoning.
 * Does NOT modify the database — audit only.
 *
 * Usage: npx tsx --env-file=.env.local scripts/vision-audit-images.ts
 */

import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Rate limit: ~1 req/sec to stay under RPM limits
const DELAY_MS = 1200
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN' | 'ERROR'

interface AuditResult {
  slug: string
  name: string
  imageUrl: string
  verdict: Verdict
  reason: string
}

async function auditImage(
  name: string,
  slug: string,
  imageUrl: string
): Promise<{ verdict: Verdict; reason: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl, detail: 'low' },
            },
            {
              type: 'text',
              text: `This image is supposed to show the military/defense system called "${name}" (slug: ${slug}).

Does the image actually depict this system — the actual hardware, vehicle, weapon, or equipment itself?

Reply with exactly one of:
PASS — image clearly shows the correct system
FAIL — image does not show this system (shows something else, wrong equipment, unrelated)
UNCERTAIN — hard to tell (image is generic, shows soldiers/scene without the specific system visible)

Then one sentence of reasoning. Format: "PASS|FAIL|UNCERTAIN: <reason>"`,
            },
          ],
        },
      ],
    })

    const text = response.choices[0]?.message?.content?.trim() ?? ''
    const match = text.match(/^(PASS|FAIL|UNCERTAIN):\s*(.+)$/i)
    if (match) {
      return { verdict: match[1].toUpperCase() as Verdict, reason: match[2] }
    }
    return { verdict: 'UNCERTAIN', reason: text.substring(0, 120) }
  } catch (err: any) {
    return { verdict: 'ERROR', reason: err?.message ?? 'Unknown error' }
  }
}

async function main() {
  console.log('=== DroneWire Vision Image Audit ===\n')

  const systems = await prisma.system.findMany({
    where: { imageUrl: { not: null } },
    select: { slug: true, name: true, imageUrl: true },
    orderBy: { name: 'asc' },
  })

  console.log(`Systems with images: ${systems.length}\n`)

  const results: AuditResult[] = []
  let pass = 0, fail = 0, uncertain = 0, error = 0

  for (let i = 0; i < systems.length; i++) {
    const s = systems[i]
    process.stdout.write(`[${i + 1}/${systems.length}] ${s.name}... `)

    const { verdict, reason } = await auditImage(s.name, s.slug, s.imageUrl!)
    results.push({ slug: s.slug, name: s.name, imageUrl: s.imageUrl!, verdict, reason })

    if (verdict === 'PASS') { pass++; console.log(`✅ PASS — ${reason}`) }
    else if (verdict === 'FAIL') { fail++; console.log(`❌ FAIL — ${reason}`) }
    else if (verdict === 'UNCERTAIN') { uncertain++; console.log(`⚠️  UNCERTAIN — ${reason}`) }
    else { error++; console.log(`💥 ERROR — ${reason}`) }

    if (i < systems.length - 1) await sleep(DELAY_MS)
  }

  console.log('\n=== Summary ===')
  console.log(`  ✅ PASS:      ${pass}`)
  console.log(`  ❌ FAIL:      ${fail}`)
  console.log(`  ⚠️  UNCERTAIN: ${uncertain}`)
  console.log(`  💥 ERROR:     ${error}`)
  console.log(`  Total:        ${systems.length}`)

  if (fail > 0 || uncertain > 0) {
    console.log('\n--- FAIL / UNCERTAIN LIST (action needed) ---')
    for (const r of results.filter(r => r.verdict === 'FAIL' || r.verdict === 'UNCERTAIN')) {
      console.log(`  [${r.verdict}] ${r.name} (${r.slug})`)
      console.log(`         ${r.reason}`)
      console.log(`         ${r.imageUrl}`)
    }
  }

  // Write full results to JSON for follow-up fixing
  const fs = await import('fs')
  fs.writeFileSync(
    '/tmp/vision-audit-results.json',
    JSON.stringify(results, null, 2)
  )
  console.log('\nFull results saved to: /tmp/vision-audit-results.json')

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('Fatal:', err)
  prisma.$disconnect()
  process.exit(1)
})
