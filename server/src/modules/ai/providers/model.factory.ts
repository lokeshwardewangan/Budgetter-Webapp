import { ChatOpenAI } from '@langchain/openai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

export function getLLM(provider = 'openai'): BaseChatModel {
  const llmProvider = provider.toLowerCase();

  switch (llmProvider) {
    case 'openai':
      return new ChatOpenAI({
        model: 'gpt-4o-mini',
        temperature: 0,
        apiKey: process.env.OPENAI_API_KEY,
      });
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
