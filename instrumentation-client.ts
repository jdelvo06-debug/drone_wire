import { initBotId } from 'botid/client/core'

// The BotID bootstrap and rewrites are Production-only. Local development has no
// configured challenge endpoint, and Preview must not consume BotID resources.
if (
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
) {
  initBotId({
    protect: [
      { path: '/api/search', method: 'GET' },
      { path: '/api/contact', method: 'POST' },
      { path: '/api/newsletter/subscribe', method: 'POST' },
      { path: '/api/views', method: 'POST' },
      { path: '/api/admin/auth', method: 'POST' },
    ],
  })
}
