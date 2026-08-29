import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { escapeHtml } from '@/lib/security/html'
import { createPreferenceUrl } from '@/lib/security/unsubscribe-token'
import { findSentEmailByMessageId, sendEmail } from '@/lib/services/email'
import { buildWeekKey, selectWeeklyDigest } from '@/lib/newsletter/weekly-digest'

const SITE_URL = process.env.SITE_URL || 'https://dronewire.org'

function easternMidnightUtc(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const utcGuess = new Date(Date.UTC(year, month - 1, day))
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const parts = Object.fromEntries(formatter.formatToParts(utcGuess).map((part) => [part.type, part.value]))
  const representedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
  return new Date(utcGuess.getTime() - (representedAsUtc - utcGuess.getTime()))
}

export function coverageDatesForWeek(weekKey: string) {
  const coverageEnd = easternMidnightUtc(weekKey)
  const coverageStart = new Date(coverageEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
  return { coverageStart, coverageEnd }
}

function renderItems(items: Array<{ title: string; href: string }>) {
  return items.map((item) => `<li style="margin:0 0 12px"><a href="${escapeHtml(new URL(item.href, SITE_URL).toString())}">${escapeHtml(item.title)}</a></li>`).join('')
}

export function renderWeeklyDigest(selection: ReturnType<typeof selectWeeklyDigest>, preferenceUrl?: string) {
  const preferences = preferenceUrl
    ? `<p><a href="${escapeHtml(preferenceUrl)}">Manage email preferences</a></p>`
    : '<p>Preference links are personalized when the issue is delivered.</p>'
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#18181b;line-height:1.5">
    <main style="max-width:640px;margin:auto;padding:24px">
      <h1>DroneWire Weekly Intelligence Digest</h1>
      <p>AI-assisted selection with explicit source and provenance labels. Review original sources before relying on consequential claims.</p>
      <h2>Top reporting</h2><ol>${renderItems(selection.articles)}</ol>
      <h2>Recent contracts</h2><ol>${renderItems(selection.contracts)}</ol>
      <h2>System or explainer</h2><ol>${renderItems(selection.knowledge)}</ol>
      ${preferences}
    </main></body></html>`
}

export async function generateWeeklyDigest(now = new Date()) {
  const weekKey = buildWeekKey(now)
  const existing = await prisma.newsletterIssue.findUnique({ where: { weekKey } })
  if (existing) return existing

  const { coverageStart, coverageEnd } = coverageDatesForWeek(weekKey)
  const [articles, contracts, systems, explainers] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: 'published',
        publishedAt: { gte: coverageStart, lt: coverageEnd },
        isClusterRepresentative: true,
        exclusionReason: null,
        sourceUrl: { not: null },
        confidence: { gte: 0.8 },
        relevanceScore: { gte: 0.5 },
      },
      orderBy: [{ relevanceScore: 'desc' }, { publishedAt: 'desc' }],
      take: 40,
    }),
    prisma.contract.findMany({ where: { awardDate: { gte: coverageStart, lt: coverageEnd } }, orderBy: { awardDate: 'desc' }, take: 2 }),
    prisma.system.findMany({ where: { updatedAt: { gte: coverageStart, lt: coverageEnd }, provenanceLabel: { not: 'unverified' } }, orderBy: { updatedAt: 'desc' }, take: 3 }),
    prisma.explainer.findMany({ where: { updatedAt: { gte: coverageStart, lt: coverageEnd }, provenanceLabel: { not: 'unverified' } }, orderBy: { updatedAt: 'desc' }, take: 3 }),
  ])

  const selection = selectWeeklyDigest({
    articles: articles.map((article) => ({ ...article, href: `/articles/${article.id}` })),
    contracts: contracts.map((contract) => ({ id: contract.id, title: contract.title, href: '/contracts' })),
    knowledge: [
      ...systems.map((system) => ({ id: system.id, title: system.name, href: `/systems/${system.slug}`, entityType: 'system' as const, provenanceLabel: system.provenanceLabel })),
      ...explainers.map((explainer) => ({ id: explainer.id, title: explainer.title, href: `/explainers/${explainer.slug}`, entityType: 'explainer' as const, provenanceLabel: explainer.provenanceLabel })),
    ],
  })
  const renderedPreview = renderWeeklyDigest(selection)

  return prisma.newsletterIssue.upsert({
    where: { weekKey },
    update: {},
    create: {
      weekKey,
      coverageStart,
      coverageEnd,
      selectedContent: JSON.parse(JSON.stringify(selection)),
      renderedPreview,
      status: 'preview',
      eligibleCount: selection.articles.length + selection.contracts.length + selection.knowledge.length,
    },
  })
}

export async function approveWeeklyDigestAfterSyntheticTest(issueId: string) {
  const claimed = await prisma.newsletterIssue.updateMany({
    where: { id: issueId, status: 'preview' },
    data: { status: 'testing', failureSummary: null },
  })
  if (claimed.count === 0) {
    const current = await prisma.newsletterIssue.findUnique({ where: { id: issueId } })
    if (current && ['approved', 'sending', 'completed'].includes(current.status)) return current
    throw new Error('Digest synthetic test is already running or the issue is not testable')
  }

  const issue = await prisma.newsletterIssue.findUniqueOrThrow({ where: { id: issueId } })
  const selection = issue.selectedContent as unknown as ReturnType<typeof selectWeeklyDigest>
  const selectedCount = selection.articles.length + selection.contracts.length + selection.knowledge.length
  const syntheticRecipient = process.env.DIGEST_TEST_RECIPIENT
  if (!syntheticRecipient || selectedCount === 0) {
    await prisma.newsletterIssue.update({
      where: { id: issueId },
      data: { status: 'preview', failureSummary: !syntheticRecipient ? 'Synthetic recipient is not configured' : 'Digest has no eligible content' },
    })
    throw new Error(!syntheticRecipient ? 'DIGEST_TEST_RECIPIENT is required' : 'Digest has no eligible content')
  }

  const test = await sendEmail({
    to: syntheticRecipient,
    subject: `[SYNTHETIC TEST] DroneWire Weekly Digest — ${issue.weekKey}`,
    html: renderWeeklyDigest(selection),
  })
  if (!test.success) {
    await prisma.newsletterIssue.update({ where: { id: issueId }, data: { status: 'preview', failureSummary: 'Synthetic delivery failed' } })
    throw new Error('Synthetic digest delivery failed')
  }

  return prisma.newsletterIssue.update({
    where: { id: issueId },
    data: { status: 'approved', failureSummary: null },
  })
}

export async function sendApprovedWeeklyDigest(issueId: string) {
  const issue = await prisma.newsletterIssue.findUnique({ where: { id: issueId } })
  if (!issue || !['approved', 'sending'].includes(issue.status)) throw new Error('Digest issue is not approved after synthetic render testing')

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { status: 'active', weeklyDigestEnabled: true },
    select: { id: true, email: true, preferenceTokenRevision: true },
  })
  await prisma.newsletterDelivery.createMany({
    data: subscribers.map((subscriber) => ({ issueId, subscriberId: subscriber.id })),
    skipDuplicates: true,
  })

  const staleLeaseBefore = new Date(Date.now() - 30 * 60 * 1000)
  const pending = await prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw(Prisma.sql`
      UPDATE "newsletter_deliveries" AS delivery
      SET "status" = 'cancelled', "errorCode" = 'consent-revoked', "updatedAt" = CURRENT_TIMESTAMP
      FROM "newsletter_subscribers" AS subscriber
      WHERE delivery."subscriberId" = subscriber."id"
        AND delivery."issueId" = ${issueId}
        AND (
          delivery."status" IN ('pending', 'failed', 'ambiguous')
          OR (delivery."status" = 'sending' AND delivery."lastAttemptAt" < ${staleLeaseBefore})
        )
        AND (subscriber."status" <> 'active' OR subscriber."weeklyDigestEnabled" = false)
    `)
    const rows = await transaction.$queryRaw<Array<{ id: string; priorStatus: string }>>(Prisma.sql`
      SELECT delivery."id", delivery."status" AS "priorStatus"
      FROM "newsletter_deliveries" AS delivery
      JOIN "newsletter_subscribers" AS subscriber ON subscriber."id" = delivery."subscriberId"
      WHERE delivery."issueId" = ${issueId}
        AND subscriber."status" = 'active'
        AND subscriber."weeklyDigestEnabled" = true
        AND (
          (delivery."status" = 'pending')
          OR (delivery."status" = 'failed' AND delivery."attemptCount" < 5)
          OR (delivery."status" = 'sending' AND delivery."attemptCount" < 5 AND delivery."lastAttemptAt" < ${staleLeaseBefore})
          OR (delivery."status" = 'ambiguous' AND delivery."attemptCount" < 5)
        )
      ORDER BY delivery."createdAt" ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 25
    `)
    const ids = rows.map((row) => row.id)
    if (ids.length === 0) return []
    await transaction.newsletterDelivery.updateMany({
      where: { id: { in: ids }, status: { in: ['pending', 'failed', 'sending', 'ambiguous'] } },
      data: { status: 'sending', lastAttemptAt: new Date(), attemptCount: { increment: 1 } },
    })
    const deliveries = await transaction.newsletterDelivery.findMany({
      where: { id: { in: ids }, status: 'sending' },
      include: { subscriber: { select: { email: true, preferenceTokenRevision: true } } },
      orderBy: { createdAt: 'asc' },
    })
    const priorStatuses = new Map(rows.map((row) => [row.id, row.priorStatus]))
    return deliveries.map((delivery) => ({ ...delivery, priorStatus: priorStatuses.get(delivery.id) || 'pending' }))
  })
  const selection = issue.selectedContent as unknown as ReturnType<typeof selectWeeklyDigest>

  for (const delivery of pending) {
    const currentConsent = await prisma.newsletterSubscriber.findFirst({
      where: { id: delivery.subscriberId, status: 'active', weeklyDigestEnabled: true },
      select: { id: true },
    })
    if (!currentConsent) {
      await prisma.newsletterDelivery.update({ where: { id: delivery.id }, data: { status: 'cancelled', errorCode: 'consent-revoked' } })
      continue
    }
    const messageId = `<digest-${delivery.id}@dronewire.org>`
    if (delivery.priorStatus === 'sending' || delivery.priorStatus === 'ambiguous') {
      const reconciliation = await findSentEmailByMessageId(messageId)
      if (reconciliation?.found) {
        await prisma.newsletterDelivery.update({
          where: { id: delivery.id },
          data: { status: 'delivered', deliveredAt: new Date(), providerMessageId: reconciliation.providerMessageId || null, errorCode: null },
        })
        continue
      }
      if (!reconciliation) {
        await prisma.newsletterDelivery.update({
          where: { id: delivery.id },
          data: {
            status: delivery.attemptCount >= 5 ? 'manual_review' : 'ambiguous',
            errorCode: 'provider-reconciliation-unavailable',
          },
        })
        continue
      }
    }
    const preferenceUrl = createPreferenceUrl(delivery.subscriberId, delivery.subscriber.preferenceTokenRevision)
    const result = await sendEmail({
      to: delivery.subscriber.email,
      subject: `DroneWire Weekly Digest — ${issue.weekKey}`,
      html: renderWeeklyDigest(selection, preferenceUrl),
      messageId,
    })
    await prisma.newsletterDelivery.update({
      where: { id: delivery.id },
      data: result.success
        ? { status: 'delivered', deliveredAt: new Date(), lastAttemptAt: new Date(), providerMessageId: result.data?.messageId || null, errorCode: null }
        : {
          status: result.ambiguous
            ? delivery.attemptCount >= 5 ? 'manual_review' : 'ambiguous'
            : 'failed',
          lastAttemptAt: new Date(),
          errorCode: result.ambiguous ? 'provider-acceptance-unknown' : 'provider-send-failed',
        },
    })
  }

  const [deliveredCount, failedCount, remainingCount] = await Promise.all([
    prisma.newsletterDelivery.count({ where: { issueId, status: 'delivered' } }),
    prisma.newsletterDelivery.count({ where: { issueId, status: { in: ['failed', 'ambiguous', 'manual_review'] } } }),
    prisma.newsletterDelivery.count({
      where: {
        issueId,
        OR: [
          { status: 'pending' },
          { status: 'sending' },
          { status: 'ambiguous' },
          { status: 'failed', attemptCount: { lt: 5 } },
        ],
      },
    }),
  ])
  await prisma.newsletterIssue.update({
    where: { id: issueId },
    data: {
      status: remainingCount === 0 ? 'completed' : 'sending',
      deliveredCount,
      failedCount,
      sendStartedAt: issue.sendStartedAt || new Date(),
      completedAt: remainingCount === 0 ? new Date() : null,
      failureSummary: failedCount > 0 ? `${failedCount} deliveries require retry` : null,
    },
  })

  return { attempted: pending.length, deliveredCount, failedCount, remainingCount }
}
