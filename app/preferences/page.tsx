import type { Metadata } from 'next'
import { verifyUnsubscribeToken } from '@/lib/security/unsubscribe-token'
import { prisma } from '@/lib/db'
import PreferenceForm from '@/components/newsletter/preference-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Email Preferences',
  robots: { index: false, follow: false },
}

export default async function PreferencesPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams
  const verified = verifyUnsubscribeToken(token, 'preferences')
  const subscriber = verified
    ? await prisma.newsletterSubscriber.findUnique({
        where: { id: verified.subscriberId },
        select: { weeklyDigestEnabled: true, breakingAlertsEnabled: true, alertCategories: true, status: true, preferenceTokenRevision: true },
      })
    : null
  const usableSubscriber = subscriber?.status === 'active' && subscriber.preferenceTokenRevision === verified?.tokenRevision
    ? subscriber
    : null

  return (
    <main className="container mx-auto min-h-[70vh] max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Email preferences</h1>
      {!usableSubscriber ? (
        <p className="mt-4 text-destructive">This preference link is invalid or no longer available.</p>
      ) : (
        <PreferenceForm token={token} initial={{
          weeklyDigestEnabled: usableSubscriber.weeklyDigestEnabled,
          breakingAlertsEnabled: usableSubscriber.breakingAlertsEnabled,
          categories: usableSubscriber.alertCategories,
        }} />
      )}
    </main>
  )
}
