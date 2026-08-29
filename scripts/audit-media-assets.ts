import { prisma } from '../lib/db'
import { fetchPinnedExternal } from '../lib/services/content-extractor'
import fs from 'node:fs/promises'
import path from 'node:path'

interface ImageRecord {
  entityType: 'system' | 'explainer'; id: string; title: string; imageUrl: string | null
  media?: { origin: string; attribution: string; license: string; depictedEntity: string; depictedVariant: string | null; storageMode: string; verificationState: string; width: number | null; height: number | null } | null
}

function mediaMetadataState(record: ImageRecord) {
  const media = record.media
  return media && media.origin && media.attribution && media.license && media.depictedEntity && media.storageMode ? 'complete' : 'missing'
}

async function inspect(record: ImageRecord) {
  if (!record.imageUrl) return { ...record, state: 'missing', status: null, mime: null, bytes: null, metadataState: mediaMetadataState(record) }
  try {
    if (record.imageUrl.startsWith('/')) {
      const publicRoot = path.resolve(process.cwd(), 'public')
      const localPath = path.resolve(publicRoot, `.${record.imageUrl}`)
      if (!localPath.startsWith(`${publicRoot}${path.sep}`)) throw new Error('blocked local path')
      const stat = await fs.stat(localPath)
      return { ...record, state: 'reachable-image', status: 200, mime: path.extname(localPath).slice(1), bytes: stat.size, finalUrl: record.imageUrl, metadataState: mediaMetadataState(record), recordedDimensions: record.media?.width && record.media?.height ? `${record.media.width}x${record.media.height}` : null }
    }
    let currentUrl = record.imageUrl
    let response: Response | null = null
    for (let redirects = 0; redirects <= 5; redirects++) {
      response = await fetchPinnedExternal(currentUrl, {
        method: 'HEAD',
        headers: { 'User-Agent': 'DroneWire-Media-Audit/1.0 (+https://dronewire.org)', Accept: 'image/*,*/*;q=0.1' },
        signal: AbortSignal.timeout(10_000),
      })
      if (!response) throw new Error('blocked destination')
      if (response.status < 300 || response.status >= 400) break
      const location = response.headers.get('location')
      if (!location) break
      currentUrl = new URL(location, currentUrl).toString()
    }
    if (!response) throw new Error('no response')
    const mime = response.headers.get('content-type')
    return {
      ...record,
      state: response.ok && mime?.startsWith('image/') ? 'reachable-image' : 'invalid',
      status: response.status,
      mime,
      bytes: Number(response.headers.get('content-length')) || null,
      finalUrl: currentUrl,
      metadataState: mediaMetadataState(record),
      recordedDimensions: record.media?.width && record.media?.height ? `${record.media.width}x${record.media.height}` : null,
    }
  } catch (error) {
    return { ...record, state: 'request-failed', status: null, mime: null, bytes: null, metadataState: mediaMetadataState(record), error: error instanceof Error ? error.message : 'unknown' }
  }
}

async function main() {
  const verbose = process.argv.includes('--verbose')
  const [systems, explainers, mediaTable] = await Promise.all([
    prisma.system.findMany({ select: { id: true, name: true, imageUrl: true } }),
    prisma.explainer.findMany({ select: { id: true, title: true, imageUrl: true } }),
    prisma.$queryRaw<Array<{ available: boolean }>>`SELECT to_regclass('public.media_assets') IS NOT NULL AS "available"`,
  ])
  const mediaAssets = mediaTable[0]?.available
    ? await prisma.mediaAsset.findMany({
        where: { OR: [{ systemId: { not: null } }, { explainerId: { not: null } }] },
        select: { systemId: true, explainerId: true, origin: true, attribution: true, license: true, depictedEntity: true, depictedVariant: true, storageMode: true, verificationState: true, width: true, height: true },
      })
    : []
  const mediaFor = (entityType: ImageRecord['entityType'], id: string) => mediaAssets.find((asset) => entityType === 'system' ? asset.systemId === id : asset.explainerId === id) || null
  const records: ImageRecord[] = [
    ...systems.map((item) => ({ entityType: 'system' as const, id: item.id, title: item.name, imageUrl: item.imageUrl, media: mediaFor('system', item.id) })),
    ...explainers.map((item) => ({ entityType: 'explainer' as const, id: item.id, title: item.title, imageUrl: item.imageUrl, media: mediaFor('explainer', item.id) })),
  ]
  const results = []
  for (let index = 0; index < records.length; index += 10) {
    results.push(...await Promise.all(records.slice(index, index + 10).map(inspect)))
  }
  const byUrl = new Map<string, typeof results>()
  results.forEach((item) => {
    if (!item.imageUrl) return
    byUrl.set(item.imageUrl, [...(byUrl.get(item.imageUrl) || []), item])
  })
  const duplicateUrls = Array.from(byUrl.entries())
    .filter(([, items]) => items.length > 1)
    .map(([url, items]) => ({ url, entities: items.map((item) => `${item.entityType}:${item.id}`) }))
  const states = results.reduce<Record<string, number>>((counts, item) => {
    counts[item.state] = (counts[item.state] || 0) + 1
    return counts
  }, {})
  const failures = results.filter((item) => item.state !== 'reachable-image')
  const missingMetadata = results.filter((item) => item.imageUrl && item.metadataState !== 'complete')
  process.stdout.write(`${JSON.stringify({
    generatedAt: new Date().toISOString(),
    readOnly: true,
    total: results.length,
    states,
    duplicateUrlCount: duplicateUrls.length,
    duplicateUrls,
    metadataTableAvailable: Boolean(mediaTable[0]?.available),
    missingMetadataCount: missingMetadata.length,
    ...(verbose ? { results } : { failures: failures.slice(0, 50), omittedFailureCount: Math.max(0, failures.length - 50) }),
  }, null, 2)}\n`)
}

main().finally(() => prisma.$disconnect())
