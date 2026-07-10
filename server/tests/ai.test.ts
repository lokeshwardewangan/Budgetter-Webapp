import { vi, describe, it, expect } from 'vitest';
import { api, registerAndGetToken, authHeader } from './helpers.js';

// Mock the compiled agent graph module to test controller routing and response formats in isolation
vi.mock('../src/modules/ai/agents/financial.agent.js', () => {
  return {
    createFinancialAgent: vi.fn().mockImplementation(() => {
      return {
        invoke: vi.fn().mockResolvedValue({
          messages: [
            {
              content: 'I have checked your expenses. You spent ₹500 on Food today.',
            },
          ],
        }),
        streamEvents: vi.fn().mockImplementation(async function* () {
          yield {
            event: 'on_chat_model_stream',
            name: 'ChatOpenAI',
            data: { chunk: { content: 'Mocked streamed token response.' } },
          };
        }),
      };
    }),
  };
});

describe('AI Assistant API Endpoints', () => {
  it('should accept message and return agent response', async () => {
    // 1. Authenticate
    const token = await registerAndGetToken({
      email: 'ai-tester@example.com',
      username: 'aitester',
    });
    const headers = authHeader(token);

    // 2. Query chat endpoint (non-streaming)
    const chatRes = await api().post('/api/ai/chat').set(headers).send({
      message: 'How much did I spend today?',
      threadId: 'test-thread-123',
      stream: false,
    });

    expect(chatRes.status).toBe(200);
    expect(chatRes.body.success).toBe(true);
    expect(chatRes.body.data.response).toContain('You spent ₹500 on Food today.');
    expect(chatRes.body.data.threadId).toBe('test-thread-123');
  });

  it('should support streaming responses', async () => {
    const token = await registerAndGetToken({
      email: 'ai-stream-tester@example.com',
      username: 'aistreamtester',
    });
    const headers = authHeader(token);

    // Query chat endpoint (streaming)
    const streamRes = await api().post('/api/ai/chat').set(headers).send({
      message: 'Tell me a joke',
      threadId: 'test-thread-456',
      stream: true,
    });

    expect(streamRes.status).toBe(200);
    expect(streamRes.headers['content-type']).toContain('text/event-stream');
    expect(streamRes.text).toContain('Mocked streamed token response.');
    expect(streamRes.text).toContain('[DONE]');
  });
});
