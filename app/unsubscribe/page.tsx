import type { Metadata } from 'next'
import UnsubscribeForm from '@/components/newsletter/unsubscribe-form'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Manage your DroneWire email subscription.',
  alternates: { canonical: '/unsubscribe' },
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const token = typeof resolvedSearchParams?.token === 'string'
    ? resolvedSearchParams.token
    : undefined

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
      <div className="w-full">
        <UnsubscribeForm token={token} />
      </div>
    </div>
  )
}
