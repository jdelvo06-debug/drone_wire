/** @jest-environment node */

jest.mock('@/lib/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('@/lib/services/ai-processor', () => ({
  processPendingArticles: jest.fn(),
}))

jest.mock('@/lib/security/request-guard', () => ({
  cleanupExpiredRequestLimits: jest.fn(),
}))

import { NextRequest } from 'next/server'
import { processPendingArticles } from '@/lib/services/ai-processor'
import { cleanupExpiredRequestLimits } from '@/lib/security/request-guard'
import { GET } from '@/app/api/cron/process-ai/route'

const processMock = processPendingArticles as jest.Mock
const cleanupMock = cleanupExpiredRequestLimits as jest.Mock

function cronRequest(query = '') {
  return new NextRequest(`https://dronewire.org/api/cron/process-ai${query}`, {
    headers: { authorization: 'Bearer test-cron-secret' },
  })
}

describe('process-ai cron batch budget', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CRON_SECRET = 'test-cron-secret'
    processMock.mockResolvedValue({ processed: 0, failed: 0, errors: [] })
    cleanupMock.mockResolvedValue(0)
  })

  afterEach(() => {
    delete process.env.CRON_SECRET
  })

  it('uses a five-article default batch', async () => {
    const response = await GET(cronRequest())

    expect(response.status).toBe(200)
    expect(processMock).toHaveBeenCalledWith(5)
  })

  it('allows an explicit manual limit but caps it at fifty', async () => {
    await GET(cronRequest('?limit=75'))

    expect(processMock).toHaveBeenCalledWith(50)
  })
})
