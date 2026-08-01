/** @jest-environment node */

/**
 * Fail-first behavioral tests for /api/health/ai route.
 *
 * Covers status codes, no-store header, and payload for healthy/degraded/unhealthy.
 */

jest.mock('openai', () => {
  const mockList = jest.fn();
  function MockOpenAI() {
    return {
      models: { list: mockList },
      chat: { completions: { create: jest.fn() } },
      embeddings: { create: jest.fn() },
    };
  }
  return { __esModule: true, default: MockOpenAI };
});

// We import the route handler after mocks
import { GET } from '@/app/api/health/ai/route';

describe('/api/health/ai', () => {
  let mockModelsList: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const openaiModule = require('openai');
    const instance = new openaiModule.default();
    mockModelsList = instance.models.list;
    mockModelsList.mockReset();
    delete process.env.OLLAMA_MODEL;
    delete process.env.OLLAMA_FALLBACK_MODEL;
  });

  it('returns 200 for healthy (both models available)', async () => {
    mockModelsList.mockResolvedValueOnce({
      data: [{ id: 'deepseek-v4-flash' }, { id: 'glm-5.2' }],
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('healthy');
    expect(body.primaryAvailable).toBe(true);
    expect(body.fallbackAvailable).toBe(true);
    expect(body.primaryModel).toBe('deepseek-v4-flash');
    expect(body.fallbackModel).toBe('glm-5.2');
    // No-store header
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('returns 200 for degraded (primary missing, fallback available)', async () => {
    mockModelsList.mockResolvedValueOnce({
      data: [{ id: 'glm-5.2' }],
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('degraded');
    expect(body.primaryAvailable).toBe(false);
    expect(body.fallbackAvailable).toBe(true);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('returns 200 degraded when primary exists but configured fallback is missing', async () => {
    mockModelsList.mockResolvedValueOnce({
      data: [{ id: 'deepseek-v4-flash' }],
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('degraded');
    expect(body.primaryAvailable).toBe(true);
    expect(body.fallbackAvailable).toBe(false);
    expect(body.fallbackModel).toBe('glm-5.2');
  });

  it.each(['', 'deepseek-v4-flash'])(
    'returns healthy when fallback is deliberately %p',
    async (fallbackModel) => {
      process.env.OLLAMA_FALLBACK_MODEL = fallbackModel;
      mockModelsList.mockResolvedValueOnce({
        data: [{ id: 'deepseek-v4-flash' }],
      });

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.status).toBe('healthy');
      expect(body.fallbackModel).toBe('none');
      expect(body.fallbackAvailable).toBe(false);
    },
  );

  it('returns 503 for unhealthy (neither model available)', async () => {
    mockModelsList.mockResolvedValueOnce({
      data: [{ id: 'some-other-model' }],
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe('unhealthy');
    expect(body.primaryAvailable).toBe(false);
    expect(body.fallbackAvailable).toBe(false);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('returns 503 without exposing model-list exception text', async () => {
    const secretLikeText = 'Connection refused; token=TOP-SECRET-123';
    mockModelsList.mockRejectedValueOnce(new Error(secretLikeText));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe('unhealthy');
    expect(body.message).toBe('AI model availability check failed');
    expect(JSON.stringify(body)).not.toContain(secretLikeText);
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('never exposes credentials in the response', async () => {
    mockModelsList.mockResolvedValueOnce({
      data: [{ id: 'deepseek-v4-flash' }, { id: 'glm-5.2' }],
    });

    const response = await GET();
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('apiKey');
    expect(JSON.stringify(body)).not.toContain('OLLAMA_API_KEY');
  });
});
