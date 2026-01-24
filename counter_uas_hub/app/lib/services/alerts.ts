import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendEmail } from './email'

export interface AlertArticle {
  id: string
  title: string
  aiSummary: string | null
  whyItMatters: string | null
  keyPoints: string[]
  category: string
  confidence: number | null
  sourceName: string
  sourceUrl: string | null
  imageUrl: string | null
  publishedAt: Date
}

export interface AlertStats {
  articlesFound: number
  subscribersNotified: number
  emailsSent: number
  errors: string[]
}

// Get articles that qualify for alerts (high confidence, not yet alerted)
export async function getAlertableArticles(minConfidence = 0.8): Promise<AlertArticle[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: 'published',
      alertSent: false,
      confidence: { gte: minConfidence },
      aiSummary: { not: null },
    },
    orderBy: { publishedAt: 'desc' },
    take: 10, // Limit alerts per run
  })

  return articles.map(a => ({
    id: a.id,
    title: a.title,
    aiSummary: a.aiSummary,
    whyItMatters: a.whyItMatters,
    keyPoints: a.keyPoints,
    category: a.category,
    confidence: a.confidence,
    sourceName: a.sourceName,
    sourceUrl: a.sourceUrl,
    imageUrl: a.imageUrl,
    publishedAt: a.publishedAt,
  }))
}

// Get subscribers who should receive alerts
export async function getAlertSubscribers(category?: string) {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: {
      status: 'active',
      alertsEnabled: true,
      alertFrequency: 'instant',
    },
  })

  // Filter by category preferences if specified
  if (category) {
    return subscribers.filter(
      s => s.alertCategories.length === 0 || s.alertCategories.includes(category)
    )
  }

  return subscribers
}

// Generate alert email HTML
export function getAlertEmailHtml(article: AlertArticle, firstName?: string): string {
  const name = firstName || 'there'
  const siteUrl = process.env.SITE_URL || 'https://dronewire.com'
  const confidencePercent = Math.round((article.confidence || 0) * 100)

  const keyPointsHtml = article.keyPoints
    .slice(0, 3)
    .map(point => `<li style="margin-bottom: 8px; color: #3f3f46;">${point}</li>`)
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 24px; text-align: center;">
      <p style="color: rgba(255,255,255,0.9); margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Breaking News Alert</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">DroneWire Intelligence</h1>
    </div>

    <!-- Alert Badge -->
    <div style="background-color: #fef2f2; padding: 16px; text-align: center; border-bottom: 1px solid #fecaca;">
      <span style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
        ${confidencePercent}% Confidence Score • ${article.category.toUpperCase()}
      </span>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <p style="color: #71717a; margin: 0 0 8px; font-size: 14px;">Hi ${name},</p>
      <p style="color: #3f3f46; margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
        A high-priority counter-UAS development has been detected that matches your alert preferences.
      </p>

      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px; line-height: 1.4;">
        ${article.title}
      </h2>

      ${article.imageUrl ? `
      <div style="margin-bottom: 20px;">
        <img src="${article.imageUrl}" alt="" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 6px;">
      </div>
      ` : ''}

      <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
        <p style="color: #3f3f46; margin: 0; line-height: 1.6; font-size: 15px;">
          ${article.aiSummary || ''}
        </p>
      </div>

      ${article.whyItMatters ? `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #18181b; margin: 0 0 8px; font-size: 14px; font-weight: 600;">Why It Matters</h3>
        <p style="color: #3f3f46; margin: 0; line-height: 1.6; font-size: 14px;">
          ${article.whyItMatters}
        </p>
      </div>
      ` : ''}

      ${keyPointsHtml ? `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #18181b; margin: 0 0 12px; font-size: 14px; font-weight: 600;">Key Takeaways</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          ${keyPointsHtml}
        </ul>
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="${siteUrl}/articles/${article.id}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Read Full Analysis
        </a>
      </div>

      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e4e4e7;">
        <p style="color: #71717a; margin: 0; font-size: 12px;">
          Source: <a href="${article.sourceUrl || '#'}" style="color: #3b82f6;">${article.sourceName}</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f4f4f5; padding: 24px 32px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0 0 8px;">
        You're receiving this alert because you subscribed to DroneWire breaking news alerts.
      </p>
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        <a href="${siteUrl}/unsubscribe" style="color: #3b82f6; text-decoration: none;">Manage preferences</a> •
        <a href="${siteUrl}/unsubscribe" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
}

// Send alert for a single article
export async function sendArticleAlert(article: AlertArticle): Promise<{ sent: number; errors: string[] }> {
  const subscribers = await getAlertSubscribers(article.category)
  let sent = 0
  const errors: string[] = []

  for (const subscriber of subscribers) {
    // Check if this subscriber's confidence threshold is met
    if ((article.confidence || 0) < subscriber.minConfidence) {
      continue
    }

    try {
      const result = await sendEmail({
        to: subscriber.email,
        subject: `🚨 Breaking: ${article.title.slice(0, 60)}...`,
        html: getAlertEmailHtml(article, subscriber.firstName || undefined),
      })

      if (result.success) {
        sent++
        // Update subscriber stats
        await prisma.newsletterSubscriber.update({
          where: { id: subscriber.id },
          data: {
            lastAlertSent: new Date(),
            alertsReceived: { increment: 1 },
          },
        })
      } else {
        errors.push(`Failed to send to ${subscriber.email}: ${result.error}`)
      }
    } catch (error) {
      errors.push(`Error sending to ${subscriber.email}: ${error}`)
    }

    // Small delay between emails
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Mark article as alerted
  await prisma.article.update({
    where: { id: article.id },
    data: { alertSent: true },
  })

  return { sent, errors }
}

// Main function to process all pending alerts
export async function processAlerts(): Promise<AlertStats> {
  const stats: AlertStats = {
    articlesFound: 0,
    subscribersNotified: 0,
    emailsSent: 0,
    errors: [],
  }

  // Get articles that need alerts
  const articles = await getAlertableArticles()
  stats.articlesFound = articles.length

  if (articles.length === 0) {
    logger.info('No articles found for alerts')
    return stats
  }

  logger.info(`Found ${articles.length} articles for alerts`)

  // Send alerts for each article
  for (const article of articles) {
    logger.info(`Sending alerts for: ${article.title.slice(0, 50)}...`)
    const result = await sendArticleAlert(article)
    stats.emailsSent += result.sent
    stats.errors.push(...result.errors)

    if (result.sent > 0) {
      stats.subscribersNotified += result.sent
    }
  }

  return stats
}
