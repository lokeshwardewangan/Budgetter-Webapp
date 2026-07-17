import { backendHostURL } from '@/services/api';
import { getCurrentAccessToken } from '@/utils/cookie/CookiesInfo';

export interface ChatResponse {
  threadId: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: {
    tool: string;
    status: 'running' | 'completed';
    input?: unknown;
    output?: unknown;
  }[];
}

// Non-streaming chat fetcher
export async function sendChatMessage(
  message: string,
  threadId?: string
): Promise<ChatResponse> {
  const token = getCurrentAccessToken();
  const res = await fetch(`${backendHostURL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, threadId, stream: false }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message || 'Failed to communicate with AI Assistant'
    );
  }

  const body = await res.json();
  return body.data;
}

export interface StreamCallbacks {
  onToken?: (token: string) => void;
  onToolStart?: (toolName: string, input: unknown) => void;
  onToolEnd?: (toolName: string, output: unknown) => void;
  onError?: (err: string) => void;
  onDone?: () => void;
}

// SSE chat streaming parser
export async function streamChatMessage(
  message: string,
  threadId: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const token = getCurrentAccessToken();
  const res = await fetch(`${backendHostURL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, threadId, stream: true }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to connect to chat stream');
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Save the last incomplete line back to the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const dataStr = trimmed.slice(6);

        if (dataStr === '[DONE]') {
          callbacks.onDone?.();
          return;
        }

        try {
          const payload = JSON.parse(dataStr);
          if (payload.type === 'token') {
            callbacks.onToken?.(payload.text);
          } else if (payload.type === 'tool_start') {
            callbacks.onToolStart?.(payload.tool, payload.input);
          } else if (payload.type === 'tool_end') {
            callbacks.onToolEnd?.(payload.tool, payload.output);
          } else if (payload.type === 'error') {
            callbacks.onError?.(payload.message);
          }
        } catch (e) {
          console.error('Error parsing SSE line', e, dataStr);
        }
      }
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Stream interrupted';
    callbacks.onError?.(errMsg);
  } finally {
    reader.releaseLock();
  }
}
