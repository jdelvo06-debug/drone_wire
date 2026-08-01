/**
 * Fail-first behavioral tests for AI pipeline resilience.
 *
 * These tests mock the OpenAI-compatible client (Ollama Cloud) and Prisma.
 * No production calls or DB writes are made.
 *
 * Covers:
 *  - Healthy primary path uses exactly one chat call per article
 *  - Primary failure (410) falls back to GLM
 *  - Both providers unavailable: short-circuit, no retry increment, providerUnavailable in stats
 *  - Malformed/incomplete JSON is not published
 *  - Single prompt validates all required fields
 */

jest.mock('openai', () => {
  const mockCreate = jest.fn();
  const mockList = jest.fn();
  function MockOpenAI() {
    return {
      chat: { completions: { create: mockCreate } },
      models: { list: mockList },
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      },
    };
  }
  (MockOpenAI as any).Embedding = function () {};
  return { __esModule: true, default: MockOpenAI };
});

jest.mock('@/lib/db', () => ({
  prisma: {
    article: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    tag: {
      upsert: jest.fn().mockResolvedValue({ id: 'tag-1' }),
    },
    articleTag: {
      upsert: jest.fn().mockResolvedValue({}),
    },
    $executeRaw: jest.fn().mockResolvedValue(1),
  },
}));

jest.mock('@/lib/services/content-extractor', () => ({
  extractContentFromUrl: jest.fn().mockResolvedValue(null),
  estimateReadTime: jest.fn().mockReturnValue(5),
}));

// We need to import after mocks are set up
import {
  processPendingArticles,
  checkAIModelAvailability,
} from '@/lib/services/ai-processor';
import { prisma } from '@/lib/db';

// Get the mock create function from the mocked openai module
const openaiModule = require('openai');
let mockChatCreate: jest.Mock;
let mockModelsList: jest.Mock;
function refreshMocks() {
  const instance = new openaiModule.default();
  mockChatCreate = instance.chat.completions.create;
  mockModelsList = instance.models.list;
}

function makeChatResponse(content: string) {
  return {
    choices: [{ message: { content } }],
  };
}

const VALID_JSON = JSON.stringify({
  aiSummary: 'A concise summary.',
  keyPoints: ['Point 1', 'Point 2', 'Point 3'],
  whyItMatters: 'Strategic significance.',
  tags: ['anduril', 'counter-uas', 'defense'],
  confidence: 0.9,
  category: 'counter-uas',
});

const VALID_RESULT = JSON.parse(VALID_JSON);

function makeArticle(overrides: Record<string, unknown> = {}) {
  return {
    id: 'art-1',
    title: 'Test Article Title',
    excerpt: 'Test excerpt',
    content: 'A'.repeat(600),
    imageUrl: null,
    sourceUrl: 'https://example.com/article',
    category: 'general',
    aiRetryCount: 0,
    status: 'pending_ai',
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  refreshMocks();
  mockChatCreate.mockReset();
  mockModelsList.mockReset();
  (prisma.article.findUnique as jest.Mock).mockReset();
  (prisma.article.findMany as jest.Mock).mockReset();
  (prisma.article.update as jest.Mock).mockReset();
  delete process.env.OLLAMA_MODEL;
  delete process.env.OLLAMA_FALLBACK_MODEL;
});

describe('AI pipeline resilience', () => {
  describe('healthy primary path', () => {
    it('uses exactly one chat.completions.create call per article', async () => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      mockChatCreate.mockResolvedValueOnce(makeChatResponse(VALID_JSON));

      const stats = await processPendingArticles(1);

      expect(stats.processed).toBe(1);
      expect(stats.failed).toBe(0);
      // Exactly ONE chat call — not two
      expect(mockChatCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('primary failure with fallback', () => {
    it('falls back to GLM when primary returns 410', async () => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      // Primary call throws a 410 error
      const error410 = new Error('410 Gone') as any;
      error410.status = 410;
      mockChatCreate.mockRejectedValueOnce(error410);

      // Fallback call succeeds
      mockChatCreate.mockResolvedValueOnce(makeChatResponse(VALID_JSON));

      const stats = await processPendingArticles(1);

      expect(stats.processed).toBe(1);
      expect(stats.failed).toBe(0);
      expect(mockChatCreate).toHaveBeenCalledTimes(2);
      // Second call should use the fallback model
      const secondCallArgs = mockChatCreate.mock.calls[1][0];
      expect(secondCallArgs.model).toBe('glm-5.2');
    });
  });

  describe('both providers unavailable', () => {
    it('short-circuits and does not increment aiRetryCount', async () => {
      const article1 = makeArticle({ id: 'art-1' });
      const article2 = makeArticle({ id: 'art-2', title: 'Second Article' });
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
      (prisma.article.findUnique as jest.Mock).mockImplementation(({ where }: { where: { id: string } }) =>
        where.id === 'art-1' ? article1 : article2
      );

      // Both models throw 410
      const error410 = new Error('410 Gone') as any;
      error410.status = 410;
      mockChatCreate.mockRejectedValue(error410);

      const stats = await processPendingArticles(10);

      // Should NOT increment retry count (no article.update with increment)
      const updateCalls = (prisma.article.update as jest.Mock).mock.calls;
      const retryIncrements = updateCalls.filter(
        (c: any[]) => c[0]?.data?.aiRetryCount?.increment !== undefined
      );
      expect(retryIncrements.length).toBe(0);

      // Only the first article starts: primary, then fallback, then the batch stops.
      expect(mockChatCreate).toHaveBeenCalledTimes(2);
      expect(mockChatCreate.mock.calls.map(([request]) => request.model)).toEqual([
        'deepseek-v4-flash',
        'glm-5.2',
      ]);
      expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 'art-1' },
      });

      // Stats should report provider unavailable
      expect(stats.providerUnavailable).toBe(true);
      expect(stats.providerStatus).toBeDefined();
    });

    it('treats the OpenAI SDK Request timed out. shape as systemic', async () => {
      const article1 = makeArticle({ id: 'art-1' });
      const article2 = makeArticle({ id: 'art-2', title: 'Second Article' });
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
      (prisma.article.findUnique as jest.Mock).mockImplementation(
        ({ where }: { where: { id: string } }) =>
          where.id === 'art-1' ? article1 : article2,
      );

      mockChatCreate
        .mockRejectedValueOnce(new Error('Request timed out.'))
        .mockRejectedValueOnce(new Error('Request timed out.'));

      const stats = await processPendingArticles(10);

      expect(stats.providerUnavailable).toBe(true);
      expect(mockChatCreate).toHaveBeenCalledTimes(2);
      expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 'art-1' },
      });

      const retryIncrements = (prisma.article.update as jest.Mock).mock.calls.filter(
        (c: any[]) => c[0]?.data?.aiRetryCount?.increment !== undefined,
      );
      expect(retryIncrements).toHaveLength(0);
    });

    it.each([
      ['EAI_AGAIN', Object.assign(new Error('temporary DNS failure'), { code: 'EAI_AGAIN' })],
      ['ENETUNREACH', Object.assign(new Error('network unreachable'), { code: 'ENETUNREACH' })],
      ['EHOSTUNREACH', Object.assign(new Error('host unreachable'), { code: 'EHOSTUNREACH' })],
      ['ECONNABORTED', Object.assign(new Error('connection aborted'), { code: 'ECONNABORTED' })],
      ['EPIPE', Object.assign(new Error('broken pipe'), { code: 'EPIPE' })],
      ['socket hang up', new Error('socket hang up')],
    ])('short-circuits a two-article batch for transient network failure %s', async (_label, error) => {
      const article1 = makeArticle({ id: 'art-1' });
      const article2 = makeArticle({ id: 'art-2', title: 'Second Article' });
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
      (prisma.article.findUnique as jest.Mock).mockImplementation(
        ({ where }: { where: { id: string } }) =>
          where.id === 'art-1' ? article1 : article2,
      );
      mockChatCreate.mockRejectedValue(error);

      const stats = await processPendingArticles(10);

      expect(stats.providerUnavailable).toBe(true);
      expect(mockChatCreate).toHaveBeenCalledTimes(2);
      expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.article.findUnique).toHaveBeenCalledWith({
        where: { id: 'art-1' },
      });

      const retryIncrements = (prisma.article.update as jest.Mock).mock.calls.filter(
        (c: any[]) => c[0]?.data?.aiRetryCount?.increment !== undefined,
      );
      expect(retryIncrements).toHaveLength(0);
    });

    it.each([401, 403, 404, 408, 410, 429, 500, 599])(
      'treats upstream HTTP %i as systemic without consuming article retries',
      async (status) => {
        const article1 = makeArticle({ id: 'art-1' });
        const article2 = makeArticle({ id: 'art-2', title: 'Second Article' });
        (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
        (prisma.article.findUnique as jest.Mock).mockImplementation(
          ({ where }: { where: { id: string } }) =>
            where.id === 'art-1' ? article1 : article2,
        );

        const providerError = new Error(`HTTP ${status}`) as Error & { status: number };
        providerError.status = status;
        mockChatCreate.mockRejectedValue(providerError);

        const stats = await processPendingArticles(10);

        expect(stats.providerUnavailable).toBe(true);
        expect(mockChatCreate).toHaveBeenCalledTimes(2);
        expect(prisma.article.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.article.update).not.toHaveBeenCalled();
      },
    );
  });

  describe('ordinary per-article failures', () => {
    it('increments retry count and continues to the next article', async () => {
      const article1 = makeArticle({ id: 'art-1', title: 'Malformed Article' });
      const article2 = makeArticle({ id: 'art-2', title: 'Healthy Article' });
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
      (prisma.article.findUnique as jest.Mock).mockImplementation(({ where }: { where: { id: string } }) =>
        where.id === 'art-1' ? article1 : article2
      );
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      mockChatCreate.mockImplementation(({ messages }: { messages: Array<{ content: string }> }) => {
        const prompt = messages[1]?.content ?? '';
        return Promise.resolve(
          makeChatResponse(prompt.includes('Malformed Article') ? 'not json' : VALID_JSON),
        );
      });

      const stats = await processPendingArticles(10);

      expect(stats.processed).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.providerUnavailable).toBeUndefined();

      const retryIncrements = (prisma.article.update as jest.Mock).mock.calls.filter(
        (c: any[]) => c[0]?.data?.aiRetryCount?.increment !== undefined
      );
      expect(retryIncrements).toEqual([
        [{ where: { id: 'art-1' }, data: { aiRetryCount: { increment: 1 } } }],
      ]);
      expect(prisma.article.findUnique).toHaveBeenCalledTimes(2);
    });

    it.each([
      ['malformed primary and unavailable fallback', 'primary-malformed'],
      ['unavailable primary and malformed fallback', 'fallback-malformed'],
    ])('treats %s as ordinary and continues later articles', async (_label, failureMode) => {
      const article1 = makeArticle({ id: 'art-1', title: 'Mixed Failure Article' });
      const article2 = makeArticle({ id: 'art-2', title: 'Healthy Later Article' });
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article1, article2]);
      (prisma.article.findUnique as jest.Mock).mockImplementation(
        ({ where }: { where: { id: string } }) =>
          where.id === 'art-1' ? article1 : article2,
      );
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      mockChatCreate.mockImplementation(
        ({ model, messages }: { model: string; messages: Array<{ content: string }> }) => {
          const prompt = messages[1]?.content ?? '';
          if (prompt.includes('Healthy Later Article')) {
            return Promise.resolve(makeChatResponse(VALID_JSON));
          }

          const providerFails =
            (failureMode === 'primary-malformed' && model === 'glm-5.2') ||
            (failureMode === 'fallback-malformed' && model === 'deepseek-v4-flash');
          if (providerFails) {
            const error = new Error('upstream unavailable') as Error & { status: number };
            error.status = 503;
            return Promise.reject(error);
          }
          return Promise.resolve(makeChatResponse('not json'));
        },
      );

      const stats = await processPendingArticles(10);

      expect(stats).toMatchObject({ processed: 1, failed: 1 });
      expect(stats.providerUnavailable).toBeUndefined();
      expect(prisma.article.findUnique).toHaveBeenCalledTimes(2);
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 'art-1' },
        data: { aiRetryCount: { increment: 1 } },
      });
    });
  });

  describe('malformed JSON is not published', () => {
    it('does not publish when primary returns invalid JSON and fallback also fails', async () => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);

      // Primary returns malformed JSON
      mockChatCreate.mockResolvedValueOnce(makeChatResponse('{ broken json'));

      // Fallback also returns malformed JSON
      mockChatCreate.mockResolvedValueOnce(makeChatResponse('not json at all'));

      const stats = await processPendingArticles(1);

      expect(stats.processed).toBe(0);
      expect(stats.failed).toBe(1);

      // Should NOT publish (no status: 'published' update)
      const updateCalls = (prisma.article.update as jest.Mock).mock.calls;
      const publishCalls = updateCalls.filter(
        (c: any[]) => c[0]?.data?.status === 'published'
      );
      expect(publishCalls.length).toBe(0);
    });

    it('does not publish when fields are missing from response', async () => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);

      // Returns JSON with missing required fields
      const incomplete = JSON.stringify({
        aiSummary: 'Summary only',
        // missing keyPoints, whyItMatters, tags, confidence, category
      });
      mockChatCreate.mockResolvedValueOnce(makeChatResponse(incomplete));

      const stats = await processPendingArticles(1);

      expect(stats.processed).toBe(0);
      expect(stats.failed).toBe(1);

      const updateCalls = (prisma.article.update as jest.Mock).mock.calls;
      const publishCalls = updateCalls.filter(
        (c: any[]) => c[0]?.data?.status === 'published'
      );
      expect(publishCalls.length).toBe(0);
    });

    it('rejects an otherwise valid result with an unknown top-level field', async () => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      const resultWithUnknownField = JSON.stringify({
        ...VALID_RESULT,
        internalReasoning: 'must not be accepted',
      });
      mockChatCreate.mockResolvedValue(makeChatResponse(resultWithUnknownField));

      const stats = await processPendingArticles(1);

      expect(stats).toMatchObject({ processed: 0, failed: 1 });
      expect(stats.providerUnavailable).toBeUndefined();
      expect(mockChatCreate).toHaveBeenCalledTimes(2);
      expect(prisma.article.update).not.toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'published' }) }),
      );
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 'art-1' },
        data: { aiRetryCount: { increment: 1 } },
      });
    });

    it.each([
      ['too few key points', { keyPoints: ['One', 'Two'] }],
      ['too many key points', { keyPoints: ['1', '2', '3', '4', '5', '6', '7', '8'] }],
      ['blank key point', { keyPoints: ['One', '  ', 'Three'] }],
      ['too few tags', { tags: ['one', 'two'] }],
      ['too many tags', { tags: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] }],
      ['blank tag', { tags: ['one', ' ', 'three'] }],
      ['confidence below zero', { confidence: -0.01 }],
      ['confidence above one', { confidence: 1.01 }],
      ['non-finite confidence', { confidence: Number.POSITIVE_INFINITY }],
      ['unsupported category', { category: 'technology' }],
    ])('rejects schema-invalid output: %s', async (_label, invalidFields) => {
      const article = makeArticle();
      (prisma.article.findMany as jest.Mock).mockResolvedValue([article]);
      (prisma.article.findUnique as jest.Mock).mockResolvedValue(article);
      (prisma.article.update as jest.Mock).mockResolvedValue({});

      const invalidJson = _label === 'non-finite confidence'
        ? VALID_JSON.replace('"confidence":0.9', '"confidence":1e400')
        : JSON.stringify({ ...VALID_RESULT, ...invalidFields });
      mockChatCreate.mockResolvedValue(makeChatResponse(invalidJson));

      const stats = await processPendingArticles(1);

      expect(stats).toMatchObject({ processed: 0, failed: 1 });
      expect(stats.providerUnavailable).toBeUndefined();
      expect(prisma.article.update).not.toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'published' }) }),
      );
      expect(prisma.article.update).toHaveBeenCalledWith({
        where: { id: 'art-1' },
        data: { aiRetryCount: { increment: 1 } },
      });
    });
  });

  describe('checkAIModelAvailability', () => {
    it('reports healthy when primary model is available', async () => {
      mockModelsList.mockResolvedValueOnce({
        data: [
          { id: 'deepseek-v4-flash' },
          { id: 'glm-5.2' },
        ],
      });

      const result = await checkAIModelAvailability();

      expect(result.status).toBe('healthy');
      expect(result.primaryAvailable).toBe(true);
      expect(result.fallbackAvailable).toBe(true);
      expect(result.primaryModel).toBe('deepseek-v4-flash');
      expect(result.fallbackModel).toBe('glm-5.2');
      expect(result.message).toBeDefined();
      // No secrets exposed
      expect(JSON.stringify(result)).not.toContain('apiKey');
      expect(JSON.stringify(result)).not.toContain('OLLAMA_API_KEY');
    });

    it('reports degraded when primary missing but fallback available', async () => {
      mockModelsList.mockResolvedValueOnce({
        data: [{ id: 'glm-5.2' }],
      });

      const result = await checkAIModelAvailability();

      expect(result.status).toBe('degraded');
      expect(result.primaryAvailable).toBe(false);
      expect(result.fallbackAvailable).toBe(true);
    });

    it('reports degraded when primary exists but configured fallback is missing', async () => {
      mockModelsList.mockResolvedValueOnce({
        data: [{ id: 'deepseek-v4-flash' }],
      });

      const result = await checkAIModelAvailability();

      expect(result.status).toBe('degraded');
      expect(result.primaryAvailable).toBe(true);
      expect(result.fallbackAvailable).toBe(false);
      expect(result.fallbackModel).toBe('glm-5.2');
    });

    it.each(['', 'deepseek-v4-flash'])(
      'reports healthy with primary available when fallback is deliberately %p',
      async (fallbackModel) => {
        process.env.OLLAMA_FALLBACK_MODEL = fallbackModel;
        mockModelsList.mockResolvedValueOnce({
          data: [{ id: 'deepseek-v4-flash' }],
        });

        const result = await checkAIModelAvailability();

        expect(result.status).toBe('healthy');
        expect(result.primaryAvailable).toBe(true);
        expect(result.fallbackAvailable).toBe(false);
        expect(result.fallbackModel).toBe('none');
      },
    );

    it('reports unhealthy when neither model is available', async () => {
      mockModelsList.mockResolvedValueOnce({
        data: [{ id: 'some-other-model' }],
      });

      const result = await checkAIModelAvailability();

      expect(result.status).toBe('unhealthy');
      expect(result.primaryAvailable).toBe(false);
      expect(result.fallbackAvailable).toBe(false);
    });

    it('reports a generic message when the model-list API call fails', async () => {
      const secretLikeText = 'Connection refused; token=TOP-SECRET-123';
      mockModelsList.mockRejectedValueOnce(new Error(secretLikeText));

      const result = await checkAIModelAvailability();

      expect(result.status).toBe('unhealthy');
      expect(result.primaryAvailable).toBe(false);
      expect(result.fallbackAvailable).toBe(false);
      expect(result.message).toBe('AI model availability check failed');
      expect(JSON.stringify(result)).not.toContain(secretLikeText);
    });
  });
});
