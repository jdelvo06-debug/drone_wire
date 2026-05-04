import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://drone-wire.vercel.app'

  // Fetch latest published articles
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      excerpt: true,
      aiSummary: true,
      sourceUrl: true,
      sourceName: true,
      publishedAt: true,
      category: true,
      imageUrl: true,
    },
  })

  const lastBuildDate = articles[0]?.publishedAt || new Date()

  const rssItems = articles
    .map((article) => {
      const description = article.aiSummary || article.excerpt || ''
      const pubDate = article.publishedAt?.toUTCString() || new Date().toUTCString()

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/articles/${article.id}</link>
      <guid isPermaLink="true">${siteUrl}/articles/${article.id}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <source url="${escapeXml(article.sourceUrl || siteUrl)}">${escapeXml(article.sourceName)}</source>
      ${article.imageUrl ? `<enclosure url="${escapeXml(article.imageUrl)}" type="image/jpeg" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DroneWire - Counter-UAS Intelligence</title>
    <link>${siteUrl}</link>
    <description>AI-curated news and analysis on drone warfare, counter-UAS technology, defense contracts, and military policy.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>DroneWire</title>
      <link>${siteUrl}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} DroneWire. All rights reserved.</copyright>
    <managingEditor>editor@dronewire.com (DroneWire Editorial)</managingEditor>
    <webMaster>admin@dronewire.com (DroneWire Technical)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
