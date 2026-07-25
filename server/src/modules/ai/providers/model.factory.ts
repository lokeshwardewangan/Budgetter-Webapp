import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { env } from '../../../shared/config/env.js';

export function getLLM(provider?: string): BaseChatModel {
  const llmProvider = (provider || env.AI_PROVIDER || 'openai').toLowerCase();

  switch (llmProvider) {
    case 'openai':
      return new ChatOpenAI({
        model: 'gpt-4o-mini',
        temperature: 0,
        apiKey: env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
      });
    case 'gemini':
    case 'google':
      return new ChatGoogleGenerativeAI({
        model: env.GEMINI_MODEL || 'gemini-1.5-flash',
        temperature: 0,
        apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
      });
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
