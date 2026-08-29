'use client'

import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'

const CATEGORIES = ['counter-uas', 'drone-warfare', 'contracts', 'policy', 'general']

export default function PreferenceForm({ token, initial }: {
  token: string
  initial: { weeklyDigestEnabled: boolean; breakingAlertsEnabled: boolean; categories: string[] }
}) {
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(initial.weeklyDigestEnabled)
  const [breakingAlertsEnabled, setBreakingAlertsEnabled] = useState(initial.breakingAlertsEnabled)
  const [categories, setCategories] = useState(initial.categories)
  const [message, setMessage] = useState<string | null>(null)

  async function save(event: FormEvent, fullUnsubscribe = false) {
    event.preventDefault()
    const response = await fetch('/api/newsletter/preferences', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, weeklyDigestEnabled, breakingAlertsEnabled, categories, fullUnsubscribe }),
    })
    setMessage(response.ok ? (fullUnsubscribe ? 'You are unsubscribed.' : 'Preferences saved.') : 'Unable to save preferences.')
  }

  return (
    <form onSubmit={save} className="mt-8 space-y-6">
      <label className="flex items-start gap-3"><input type="checkbox" checked={weeklyDigestEnabled} onChange={(event) => setWeeklyDigestEnabled(event.target.checked)} className="mt-1" /><span><strong>Weekly digest</strong><br /><span className="text-sm text-muted-foreground">Monday intelligence briefing.</span></span></label>
      <label className="flex items-start gap-3"><input type="checkbox" checked={breakingAlertsEnabled} onChange={(event) => setBreakingAlertsEnabled(event.target.checked)} className="mt-1" /><span><strong>Breaking alerts</strong><br /><span className="text-sm text-muted-foreground">Unchecked by default; enabling records explicit consent.</span></span></label>
      <fieldset><legend className="font-medium">Categories</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{CATEGORIES.map((category) => <label key={category} className="flex items-center gap-2"><input type="checkbox" checked={categories.includes(category)} onChange={(event) => setCategories((current) => event.target.checked ? [...new Set([...current, category])] : current.filter((item) => item !== category))} />{category}</label>)}</div></fieldset>
      <div className="flex flex-wrap gap-3"><Button type="submit">Save preferences</Button><Button type="button" variant="destructive" onClick={(event) => void save(event, true)}>Unsubscribe from all</Button></div>
      {message && <p role="status">{message}</p>}
    </form>
  )
}
