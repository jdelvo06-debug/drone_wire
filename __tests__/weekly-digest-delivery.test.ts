/** @jest-environment node */

const sendEmail = jest.fn().mockResolvedValue({ success: true, data: { messageId: 'provider-1' } })
const findSentEmailByMessageId = jest.fn().mockResolvedValue({ found: false })
let claimed = false
const mockTransaction = {
  $queryRaw: jest.fn(async () => {
    if (claimed) return []
    claimed = true
    return [{ id: 'delivery-1', priorStatus: 'pending' }]
  }),
  $executeRaw: jest.fn().mockResolvedValue(0),
  newsletterDelivery: {
    updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    findMany: jest.fn().mockResolvedValue([{
      id: 'delivery-1', issueId: 'issue-1', subscriberId: 'subscriber-1', createdAt: new Date(),
      attemptCount: 1,
      subscriber: { email: 'synthetic-recipient@example.test', preferenceTokenRevision: 0 },
    }]),
  },
}

jest.mock('@/lib/services/email', () => ({
  sendEmail: (...args: unknown[]) => sendEmail(...args),
  findSentEmailByMessageId: (...args: unknown[]) => findSentEmailByMessageId(...args),
}))
jest.mock('@/lib/db', () => ({
  prisma: {
    newsletterIssue: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'issue-1', weekKey: '2026-08-24', status: 'sending', sendStartedAt: new Date(),
        selectedContent: { articles: [], contracts: [], knowledge: [] },
      }),
      update: jest.fn().mockResolvedValue({}),
    },
    newsletterSubscriber: {
      findMany: jest.fn().mockResolvedValue([{ id: 'subscriber-1', email: 'synthetic-recipient@example.test', preferenceTokenRevision: 0 }]),
      findFirst: jest.fn().mockResolvedValue({ id: 'subscriber-1' }),
    },
    newsletterDelivery: {
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
      update: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    $transaction: jest.fn((callback: (client: typeof mockTransaction) => unknown) => callback(mockTransaction)),
  },
}))

import { sendApprovedWeeklyDigest } from '@/lib/services/weekly-digest'

describe('weekly digest delivery claims', () => {
  beforeEach(() => {
    claimed = false
    jest.clearAllMocks()
    findSentEmailByMessageId.mockResolvedValue({ found: false })
    process.env.UNSUBSCRIBE_SECRET = 'test-weekly-digest-token-secret'
  })

  it('atomically claims a delivery before sending and does not double-send across overlapping invocations', async () => {
    await Promise.all([
      sendApprovedWeeklyDigest('issue-1'),
      sendApprovedWeeklyDigest('issue-1'),
    ])

    expect(mockTransaction.newsletterDelivery.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: 'sending' }) }))
    const claimCalls = mockTransaction.$queryRaw.mock.calls as unknown as Array<[ { strings?: string[] } ]>
    const claimSql = claimCalls.map(([query]) => query.strings?.join(' ') || '').join(' ')
    expect(claimSql).toContain('"status" = \'sending\'')
    expect(claimSql).toContain('"lastAttemptAt" <')
    expect(mockTransaction.newsletterDelivery.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ status: { in: ['pending', 'failed', 'sending', 'ambiguous'] } }),
    }))
    expect(sendEmail).toHaveBeenCalledTimes(1)
  })

  it('reconciles a stale Gmail delivery by message id instead of resending it', async () => {
    mockTransaction.$queryRaw.mockImplementationOnce(async () => [{ id: 'delivery-1', priorStatus: 'sending' }])
    findSentEmailByMessageId.mockResolvedValueOnce({ found: true, providerMessageId: 'gmail-existing' })

    await sendApprovedWeeklyDigest('issue-1')

    expect(findSentEmailByMessageId).toHaveBeenCalledWith('<digest-delivery-1@dronewire.org>')
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('holds an uncertain Gmail failure for reconciliation instead of blind retry', async () => {
    sendEmail.mockResolvedValueOnce({ success: false, ambiguous: true })

    await sendApprovedWeeklyDigest('issue-1')

    expect(mockTransaction.newsletterDelivery.findMany).toHaveBeenCalled()
    expect((jest.requireMock('@/lib/db').prisma.newsletterDelivery.update as jest.Mock)).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'ambiguous', errorCode: 'provider-acceptance-unknown' }),
    }))
  })

  it('moves a fifth ambiguous send outcome to manual review', async () => {
    mockTransaction.newsletterDelivery.findMany.mockResolvedValueOnce([{
      id: 'delivery-1', issueId: 'issue-1', subscriberId: 'subscriber-1', createdAt: new Date(),
      attemptCount: 5,
      subscriber: { email: 'synthetic-recipient@example.test', preferenceTokenRevision: 0 },
    }])
    sendEmail.mockResolvedValueOnce({ success: false, ambiguous: true })

    await sendApprovedWeeklyDigest('issue-1')

    expect((jest.requireMock('@/lib/db').prisma.newsletterDelivery.update as jest.Mock)).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'manual_review', errorCode: 'provider-acceptance-unknown' }),
    }))
  })
})
