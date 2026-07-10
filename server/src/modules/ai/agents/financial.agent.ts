import { StateGraph, MemorySaver } from '@langchain/langgraph';
import { ToolNode, toolsCondition } from '@langchain/langgraph/prebuilt';
import { SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { AgentState, type AgentStateType } from './state.js';
import { getLLM } from '../providers/model.factory.js';
import { getTransactionTools } from '../tools/transaction.tools.js';
import { getBudgetTools } from '../tools/budget.tools.js';
import { getReportTools } from '../tools/report.tools.js';

export function createFinancialAgent(userId: string) {
  // 1. Initialize LLM
  const model = getLLM();

  // 2. Gather tools dynamic to the logged-in user
  const tools = [
    ...getTransactionTools(userId),
    ...getBudgetTools(userId),
    ...getReportTools(userId),
  ];

  // 3. Bind tools to the model
  const modelWithTools = (model as ChatOpenAI).bindTools(tools);

  // 4. Define the node function to invoke LLM
  const callModel = async (state: AgentStateType) => {
    // Inject dynamic system prompt with current date context in IST
    const nowIST = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    const systemPrompt = `You are "Budgetter AI", a personal finance assistant.
Today's date and time is: ${nowIST} (IST timezone).
All transactions and calculations are performed in Indian Rupees (₹).
You have access to tools to manage and query the user's expenses, pocket money, lent money, budgets, and reports.

Core Instructions:
- Always use the tools to perform database actions or queries. Do not guess or make up answers.
- Format currency with ₹ (e.g., ₹5,000).
- If the user asks relative questions ("how much did I spend yesterday?", "did I add money last week?"), check the current date/time provided above, calculate the specific date range, and call the appropriate search or report tools.
- When creating/updating an expense, make sure to specify one of these valid categories: Groceries, Housing & Utilities, Medical, Food, Personal, Educational, Investment, Transportation, Miscellaneous.
- Keep your explanations clear, positive, and action-oriented.
- When asked about budgets or pacing, use the 'get_budget_status' tool to fetch actual limits vs. spent progress.`;

    const messages = [new SystemMessage(systemPrompt), ...state.messages];
    const response = await modelWithTools.invoke(messages);
    return { messages: [response] };
  };

  // 5. Build StateGraph workflow
  const workflow = new StateGraph(AgentState)
    .addNode('agent', callModel)
    .addNode('tools', new ToolNode(tools))
    .addEdge('__start__', 'agent')
    .addConditionalEdges('agent', toolsCondition)
    .addEdge('tools', 'agent');

  // 6. Compile graph with memory checkpointer
  const checkpointer = new MemorySaver();
  return workflow.compile({ checkpointer });
}
