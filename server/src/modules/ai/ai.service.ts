import { createFinancialAgent } from './agents/financial.agent.js';
import { HumanMessage } from '@langchain/core/messages';

export async function askAgent(userId: string, threadId: string, message: string) {
  const agent = createFinancialAgent(userId);
  const config = { configurable: { thread_id: threadId } };

  const result = await agent.invoke({ messages: [new HumanMessage(message)] }, config);

  const messages = result.messages;
  const lastMessage = messages[messages.length - 1];

  return {
    response: lastMessage?.content || '',
    messages,
  };
}

export function streamAgentEvents(userId: string, threadId: string, message: string) {
  const agent = createFinancialAgent(userId);
  const config = { configurable: { thread_id: threadId } };

  return agent.streamEvents(
    { messages: [new HumanMessage(message)] },
    { version: 'v2', ...config },
  );
}
