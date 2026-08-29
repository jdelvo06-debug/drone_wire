import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import { prisma } from '../lib/db'

const MODEL = 'glm-5.3-flash'
const SAMPLE_SIZE = 20
const MAJOR_MANUFACTURER_SAMPLES = 6
const KNOWN_FAILURE_SAMPLES = 5
const FETCH_TIMEOUT_MS = 15_000
const MODEL_TIMEOUT_MS = 90_000
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const OUTPUT_DIRECTORY = '/private/tmp'
const SELECTION_SEED = 'dronewire-glm53-vision-pilot-v1'
const USER_AGENT = 'DroneWire-Vision-Pilot/1.0 (+https://dronewire.org)'

// These slugs are the still-populated system-image subset identifiable from the
// documented 15-request media-audit failure/uncertainty backlog. Null-image
// records cannot be sent to a vision model and are intentionally not candidates.
const KNOWN_FAILURE_SLUGS = new Set([
  'ababil-3',
  'ch-4b',
  'crow',
  'drdo-anti-drone-system',
  'eleron-3',
  'kub-bla',
  'lpws',
  'mohajer-6',
  'nightfighter-s',
  'ninja',
  'odin',
  'shahed-238',
])

const MAJOR_MANUFACTURERS = [
  { label: 'DroneShield', pattern: /droneshield/i },
  { label: 'Dedrone', pattern: /dedrone/i },
  { label: 'Anduril', pattern: /anduril/i },
]

type ImageQuality = 'usable' | 'degraded' | 'broken' | 'wrong-subject'
type SampleCohort = 'major-manufacturer' | 'known-failure' | 'source-diversity'

interface SystemRow {
  slug: string
  name: string
  manufacturer: string
  imageUrl: string
}

interface SelectedSystem extends SystemRow {
  cohort: SampleCohort
}

interface VisionVerdict {
  subject: string
  isCiuasSystemImage: boolean
  imageQuality: ImageQuality
  reasoning: string
}

interface HttpProbe {
  status: number | null
  contentType: string | null
  error: string | null
}

interface ImagePayload {
  bytes: Buffer | null
  mimeType: string | null
  byteLength: number | null
  error: string | null
}

function deterministicHash(value: string): string {
  return crypto.createHash('sha256').update(`${SELECTION_SEED}:${value}`).digest('hex')
}

function hashOrder<T extends { slug: string }>(rows: T[], namespace: string): T[] {
  return [...rows].sort((a, b) => {
    const hashComparison = deterministicHash(`${namespace}:${a.slug}`).localeCompare(
      deterministicHash(`${namespace}:${b.slug}`),
    )
    return hashComparison || a.slug.localeCompare(b.slug)
  })
}

function imageHost(imageUrl: string): string {
  if (imageUrl.startsWith('/')) return 'local-public'
  try {
    return new URL(imageUrl).hostname.replace(/^www\./, '')
  } catch {
    return 'invalid-url'
  }
}

function selectSample(rows: SystemRow[]): SelectedSystem[] {
  const inventory = [...rows].sort((a, b) => a.slug.localeCompare(b.slug))
  const selected = new Map<string, SelectedSystem>()

  // Round-robin across the three named manufacturers, then fill from the same
  // cohort by hash. This prevents one vendor from dominating the anchor group.
  for (let round = 0; selected.size < MAJOR_MANUFACTURER_SAMPLES; round++) {
    let added = false
    for (const manufacturer of MAJOR_MANUFACTURERS) {
      const candidates = hashOrder(
        inventory.filter((row) => manufacturer.pattern.test(row.manufacturer)),
        `major:${manufacturer.label}`,
      )
      const candidate = candidates[round]
      if (candidate && !selected.has(candidate.slug)) {
        selected.set(candidate.slug, { ...candidate, cohort: 'major-manufacturer' })
        added = true
        if (selected.size === MAJOR_MANUFACTURER_SAMPLES) break
      }
    }
    if (!added) break
  }

  const majorCount = Array.from(selected.values()).filter((row) => row.cohort === 'major-manufacturer').length
  if (majorCount < MAJOR_MANUFACTURER_SAMPLES) {
    const remainingMajor = hashOrder(
      inventory.filter((row) => MAJOR_MANUFACTURERS.some((entry) => entry.pattern.test(row.manufacturer))),
      'major-fill',
    )
    for (const candidate of remainingMajor) {
      if (selected.has(candidate.slug)) continue
      selected.set(candidate.slug, { ...candidate, cohort: 'major-manufacturer' })
      if (Array.from(selected.values()).filter((row) => row.cohort === 'major-manufacturer').length === MAJOR_MANUFACTURER_SAMPLES) break
    }
  }

  const knownFailures = hashOrder(
    inventory.filter((row) => KNOWN_FAILURE_SLUGS.has(row.slug) && !selected.has(row.slug)),
    'known-failure',
  )
  for (const candidate of knownFailures.slice(0, KNOWN_FAILURE_SAMPLES)) {
    selected.set(candidate.slug, { ...candidate, cohort: 'known-failure' })
  }

  // Prefer previously unseen hosts for the remainder, then hash-fill if there
  // are fewer distinct sources than remaining slots.
  const hostCounts = new Map<string, number>()
  for (const row of selected.values()) {
    const host = imageHost(row.imageUrl)
    hostCounts.set(host, (hostCounts.get(host) || 0) + 1)
  }
  const remaining = hashOrder(inventory.filter((row) => !selected.has(row.slug)), 'source-diversity')
  for (const candidate of remaining) {
    if (selected.size === SAMPLE_SIZE) break
    const host = imageHost(candidate.imageUrl)
    if (hostCounts.has(host)) continue
    selected.set(candidate.slug, { ...candidate, cohort: 'source-diversity' })
    hostCounts.set(host, 1)
  }
  for (const candidate of remaining) {
    if (selected.size === SAMPLE_SIZE) break
    if (selected.has(candidate.slug)) continue
    selected.set(candidate.slug, { ...candidate, cohort: 'source-diversity' })
  }

  if (selected.size !== SAMPLE_SIZE) {
    throw new Error(`Could not select ${SAMPLE_SIZE} unique systems from ${inventory.length} image records`)
  }
  return Array.from(selected.values())
}

function sanitizeText(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\b(?:sk|pk|api|token)[-_][A-Za-z0-9_-]{16,}\b/gi, '[redacted-token]')
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [redacted-token]')
    .slice(0, 1_000)
}

function safeError(error: unknown): string {
  return sanitizeText(error instanceof Error ? error.message : 'unknown error')
}

function resolveOutputPath(value: string | undefined): string {
  if (!value) throw new Error(`--output must name a direct child of ${OUTPUT_DIRECTORY}/`)
  const resolved = path.resolve(value)
  if (path.dirname(resolved) !== OUTPUT_DIRECTORY) {
    throw new Error(`--output must name a direct child of ${OUTPUT_DIRECTORY}/`)
  }
  return resolved
}

function localPublicPath(imageUrl: string): string {
  const publicRoot = path.resolve(process.cwd(), 'public')
  const resolved = path.resolve(publicRoot, `.${imageUrl}`)
  if (!resolved.startsWith(`${publicRoot}${path.sep}`)) throw new Error('local image path escapes public directory')
  return resolved
}

function mimeFromUrl(imageUrl: string): string | null {
  const pathname = imageUrl.startsWith('/') ? imageUrl : new URL(imageUrl).pathname
  const extension = path.extname(pathname).toLowerCase()
  return ({
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  } as Record<string, string>)[extension] || null
}

function normalizedMime(contentType: string | null, imageUrl: string): string | null {
  const declared = contentType?.split(';')[0].trim().toLowerCase() || null
  if (declared?.startsWith('image/')) return declared
  if (declared === 'application/octet-stream' || declared === 'binary/octet-stream') return mimeFromUrl(imageUrl)
  return null
}

async function probeHttp(imageUrl: string): Promise<HttpProbe> {
  if (imageUrl.startsWith('/')) {
    try {
      await fs.access(localPublicPath(imageUrl))
      return { status: 200, contentType: mimeFromUrl(imageUrl), error: null }
    } catch (error) {
      return { status: 404, contentType: null, error: safeError(error) }
    }
  }
  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { Accept: 'image/*,*/*;q=0.1', 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    return {
      status: response.status,
      contentType: response.headers.get('content-type'),
      error: null,
    }
  } catch (error) {
    return { status: null, contentType: null, error: safeError(error) }
  }
}

async function readResponseWithCap(response: Response): Promise<Buffer> {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    throw new Error(`image exceeds ${MAX_IMAGE_BYTES}-byte cap (content-length ${contentLength})`)
  }
  if (!response.body) throw new Error('image response has no body')

  const chunks: Buffer[] = []
  let total = 0
  const reader = response.body.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_IMAGE_BYTES) throw new Error(`image exceeds ${MAX_IMAGE_BYTES}-byte cap while streaming`)
      chunks.push(Buffer.from(value))
    }
  } finally {
    if (total > MAX_IMAGE_BYTES) await reader.cancel().catch(() => undefined)
  }
  return Buffer.concat(chunks, total)
}

async function fetchImage(imageUrl: string): Promise<ImagePayload> {
  if (imageUrl.startsWith('/')) {
    try {
      const filePath = localPublicPath(imageUrl)
      const stat = await fs.stat(filePath)
      if (stat.size > MAX_IMAGE_BYTES) throw new Error(`image exceeds ${MAX_IMAGE_BYTES}-byte cap (${stat.size})`)
      const bytes = await fs.readFile(filePath)
      const mimeType = mimeFromUrl(imageUrl)
      if (!mimeType) throw new Error('local file extension is not a supported image type')
      return { bytes, mimeType, byteLength: bytes.length, error: null }
    } catch (error) {
      return { bytes: null, mimeType: null, byteLength: null, error: safeError(error) }
    }
  }

  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: { Accept: 'image/*,*/*;q=0.1', 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`image GET returned HTTP ${response.status}`)
    const contentType = response.headers.get('content-type')
    const mimeType = normalizedMime(contentType, imageUrl)
    if (!mimeType) throw new Error(`image GET returned unsupported content-type ${contentType || 'missing'}`)
    const bytes = await readResponseWithCap(response)
    if (bytes.length === 0) throw new Error('image GET returned an empty body')
    return { bytes, mimeType, byteLength: bytes.length, error: null }
  } catch (error) {
    return { bytes: null, mimeType: null, byteLength: null, error: safeError(error) }
  }
}

function parseVisionVerdict(content: string): VisionVerdict {
  // Ollama currently may wrap json_object output in a Markdown JSON fence.
  const normalized = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const parsed = JSON.parse(normalized) as Partial<VisionVerdict>
  const qualities: ImageQuality[] = ['usable', 'degraded', 'broken', 'wrong-subject']
  if (
    typeof parsed.subject !== 'string'
    || typeof parsed.isCiuasSystemImage !== 'boolean'
    || !qualities.includes(parsed.imageQuality as ImageQuality)
    || typeof parsed.reasoning !== 'string'
  ) {
    throw new Error('model returned JSON that does not match the required vision verdict schema')
  }
  return {
    subject: sanitizeText(parsed.subject),
    isCiuasSystemImage: parsed.isCiuasSystemImage,
    imageQuality: parsed.imageQuality as ImageQuality,
    reasoning: sanitizeText(parsed.reasoning),
  }
}

async function gradeImage(
  client: OpenAI,
  system: SelectedSystem,
  payload: ImagePayload,
): Promise<{ verdict: VisionVerdict | null; latencyMs: number | null; error: string | null }> {
  if (!payload.bytes || !payload.mimeType) return { verdict: null, latencyMs: null, error: payload.error || 'image unavailable' }
  const started = performance.now()
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Grade this image used for the DroneWire system record "${system.name}" (slug: ${system.slug}). Return JSON only with exactly these fields: {"subject":"what the image actually shows","isCiuasSystemImage":boolean,"imageQuality":"usable"|"degraded"|"broken"|"wrong-subject","reasoning":"one sentence"}. isCiuasSystemImage means the image is a photo or render of a counter-UAS system or related military hardware. Use wrong-subject when the visible subject is unrelated or materially mismatched; degraded when relevant but low-quality/obscured; broken when the supplied visual itself is unreadable or corrupt; otherwise usable.`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:${payload.mimeType};base64,${payload.bytes.toString('base64')}` },
          },
        ],
      }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2_000,
    })
    const content = response.choices[0]?.message?.content || ''
    return {
      verdict: parseVisionVerdict(content),
      latencyMs: Math.round(performance.now() - started),
      error: null,
    }
  } catch (error) {
    return {
      verdict: null,
      latencyMs: Math.round(performance.now() - started),
      error: safeError(error),
    }
  }
}

async function mapLimit<T, R>(items: T[], limit: number, task: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await task(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}

async function main() {
  const output = resolveOutputPath(
    process.argv.find((argument) => argument.startsWith('--output='))?.slice('--output='.length),
  )
  if (!process.env.OLLAMA_API_KEY) throw new Error('OLLAMA_API_KEY is required')

  const systems = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY')
    return tx.system.findMany({
      where: { imageUrl: { not: null } },
      select: { slug: true, name: true, manufacturer: true, imageUrl: true },
      orderBy: { slug: 'asc' },
    })
  }, { timeout: 30_000 })
  const rows: SystemRow[] = systems.map((system) => ({ ...system, imageUrl: system.imageUrl! }))
  const sample = selectSample(rows)

  const client = new OpenAI({
    apiKey: process.env.OLLAMA_API_KEY,
    baseURL: 'https://ollama.com/v1',
    maxRetries: 0,
    timeout: MODEL_TIMEOUT_MS,
  })

  process.stderr.write(`Selected ${sample.length} of ${rows.length} systems for ${MODEL}\n`)
  const results = await mapLimit(sample, 2, async (system, index) => {
    const totalStarted = performance.now()
    const [http, image] = await Promise.all([probeHttp(system.imageUrl), fetchImage(system.imageUrl)])
    const model = await gradeImage(client, system, image)
    const httpBroken = http.status === null || http.status < 200 || http.status >= 400
    const modelBroken = model.verdict ? model.verdict.imageQuality === 'broken' : null
    const agreement = modelBroken === null ? null : httpBroken === modelBroken
    process.stderr.write(`[${index + 1}/${sample.length}] ${system.slug}: ${model.verdict?.imageQuality || `failure (${model.error})`}\n`)
    return {
      slug: system.slug,
      name: sanitizeText(system.name),
      manufacturer: sanitizeText(system.manufacturer),
      cohort: system.cohort,
      imageUrlHost: imageHost(system.imageUrl),
      imageUrl: system.imageUrl,
      httpStatus: http.status,
      httpContentType: http.contentType,
      httpProbeError: http.error,
      fetchedBytes: image.byteLength,
      fetchedMimeType: image.mimeType,
      fetchError: image.error,
      modelVerdict: model.verdict,
      modelError: model.error,
      modelLatencyMs: model.latencyMs,
      totalLatencyMs: Math.round(performance.now() - totalStarted),
      httpBroken,
      modelSaysBroken: modelBroken,
      modelVsHttpAgreement: agreement,
    }
  })

  const verdictCounts: Record<ImageQuality, number> = {
    usable: 0,
    degraded: 0,
    broken: 0,
    'wrong-subject': 0,
  }
  for (const result of results) {
    if (result.modelVerdict) verdictCounts[result.modelVerdict.imageQuality]++
  }
  const comparable = results.filter((result) => result.modelVsHttpAgreement !== null)
  const agreements = comparable.filter((result) => result.modelVsHttpAgreement).length
  const modelLatencies = results
    .map((result) => result.modelLatencyMs)
    .filter((latency): latency is number => latency !== null)
  const report = {
    generatedAt: new Date().toISOString(),
    mode: 'read-only',
    databaseTransaction: 'read-only',
    sanitized: true,
    provider: {
      baseUrl: 'https://ollama.com/v1',
      model: MODEL,
      nativeVisionInput: 'OpenAI-compatible image_url content part using a base64 data URL',
      responseFormat: 'json_object',
      temperature: 0.1,
    },
    sampleDesign: {
      systemInventoryWithImages: rows.length,
      sampleSize: sample.length,
      selectionSeed: SELECTION_SEED,
      method: 'inventory sorted by slug; deterministic SHA-256 ordering within major-manufacturer, known-failure, and source-diversity cohorts; no Math.random',
      cohortCounts: {
        majorManufacturer: sample.filter((row) => row.cohort === 'major-manufacturer').length,
        knownFailure: sample.filter((row) => row.cohort === 'known-failure').length,
        sourceDiversity: sample.filter((row) => row.cohort === 'source-diversity').length,
      },
      uniqueImageHosts: new Set(sample.map((row) => imageHost(row.imageUrl))).size,
    },
    limits: {
      imageFetchTimeoutMs: FETCH_TIMEOUT_MS,
      imageByteCap: MAX_IMAGE_BYTES,
      modelTimeoutMs: MODEL_TIMEOUT_MS,
      concurrency: 2,
    },
    summary: {
      requested: results.length,
      fetched: results.filter((result) => result.fetchedBytes !== null).length,
      modelVerdicts: results.filter((result) => result.modelVerdict !== null).length,
      verdictCounts,
      httpProbeFailures: results.filter((result) => result.httpStatus === null).length,
      nonSuccessHttpStatuses: results.filter((result) => result.httpStatus !== null && (result.httpStatus < 200 || result.httpStatus >= 400)).length,
      imageFetchFailures: results.filter((result) => result.fetchError !== null).length,
      modelFailures: results.filter((result) => result.modelError !== null).length,
      modelVsHttpComparable: comparable.length,
      modelVsHttpAgreements: agreements,
      modelVsHttpAgreementRate: comparable.length ? round(agreements / comparable.length) : null,
      averageModelLatencyMs: modelLatencies.length
        ? Math.round(modelLatencies.reduce((sum, latency) => sum + latency, 0) / modelLatencies.length)
        : null,
      failures: results
        .filter((result) => result.fetchError || result.modelError || result.httpProbeError)
        .map((result) => ({
          slug: result.slug,
          httpStatus: result.httpStatus,
          httpProbeError: result.httpProbeError,
          fetchError: result.fetchError,
          modelError: result.modelError,
        })),
    },
    limitations: [
      'This is a deterministic 20-system pilot, not a complete audit of all system images.',
      'The documented known-failure cohort includes only records that still have an image URL; null-image records cannot be graded by a vision model.',
      'HTTP agreement treats a missing/non-2xx-to-3xx HEAD status as broken and compares that binary signal with imageQuality=broken; it is not a human-reviewed subject-accuracy label.',
      'Some origins treat HEAD and GET differently, so the independently probed HTTP status may disagree with the actual image fetch.',
      'Hotlink-blocked, timed-out, oversized, HTML, and unsupported-image responses are recorded as fetch failures and are not bypassed or screenshotted.',
      'Model outputs are stochastic and subject identity should be human-reviewed before changing any catalog record.',
    ],
    results,
  }

  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
  process.stdout.write(`${JSON.stringify({ output, sampleDesign: report.sampleDesign, summary: report.summary }, null, 2)}\n`)
}

main()
  .catch((error) => {
    process.stderr.write(`Pilot failed: ${safeError(error)}\n`)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
