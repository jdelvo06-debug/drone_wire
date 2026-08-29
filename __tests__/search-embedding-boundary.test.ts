/** @jest-environment node */

jest.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
    $transaction: jest.fn(),
  },
}))

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn(),
}))

import OpenAI from 'openai'
import { prisma } from '@/lib/db'
import { refreshMissingSearchEmbeddings } from '@/lib/search/refresh-embeddings'

describe('search embedding operation boundary', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.DATABASE_URL = 'postgresql://local@127.0.0.1:5432/test'
  })

  afterAll(() => {
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL
    else process.env.DATABASE_URL = originalDatabaseUrl
  })

  it('refuses direct calls without explicit provider approval before database or provider access', async () => {
    await expect(refreshMissingSearchEmbeddings(10)).rejects.toThrow(/explicit provider approval/i)
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
    expect(OpenAI).not.toHaveBeenCalled()
  })

  it('refuses an approved direct call against a non-local database before provider access', async () => {
    process.env.DATABASE_URL = 'postgresql://user:secret@db.example.com/production'
    await expect(refreshMissingSearchEmbeddings(10, {
      providerApproved: true,
    })).rejects.toThrow(/restricted to a local database/i)
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
    expect(OpenAI).not.toHaveBeenCalled()
  })

  it('ignores a spoofed caller URL and validates the actual Prisma environment connection', async () => {
    process.env.DATABASE_URL = 'postgresql://user:secret@db.example.com/production'
    const spoofedApproval = {
      providerApproved: true,
      databaseUrl: 'postgresql://local@127.0.0.1:5432/test',
    } as const

    await expect(refreshMissingSearchEmbeddings(10, spoofedApproval)).rejects.toThrow(/restricted to a local database/i)
    expect(prisma.$queryRaw).not.toHaveBeenCalled()
    expect(OpenAI).not.toHaveBeenCalled()
  })
})
