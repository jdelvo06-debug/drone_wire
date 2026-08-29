/** @jest-environment node */

const mockInitBotId = jest.fn()

jest.mock('botid/client/core', () => ({
  initBotId: mockInitBotId,
}))

const originalNodeEnv = process.env.NODE_ENV
const originalVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV

function setNodeEnv(value: string) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  })
}

describe('BotID client instrumentation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setNodeEnv('production')
  })

  afterEach(() => {
    setNodeEnv(originalNodeEnv)
    if (originalVercelEnv === undefined) {
      delete process.env.NEXT_PUBLIC_VERCEL_ENV
    } else {
      process.env.NEXT_PUBLIC_VERCEL_ENV = originalVercelEnv
    }
  })

  it('does not initialize BotID for Vercel Preview', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview'

    jest.isolateModules(() => {
      require('@/instrumentation-client')
    })

    expect(mockInitBotId).not.toHaveBeenCalled()
  })

  it('keeps BotID enabled for Vercel Production', () => {
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production'

    jest.isolateModules(() => {
      require('@/instrumentation-client')
    })

    expect(mockInitBotId).toHaveBeenCalledWith({
      protect: [
        { path: '/api/search', method: 'GET' },
        { path: '/api/contact', method: 'POST' },
        { path: '/api/newsletter/subscribe', method: 'POST' },
        { path: '/api/views', method: 'POST' },
        { path: '/api/admin/auth', method: 'POST' },
      ],
    })
  })
})
