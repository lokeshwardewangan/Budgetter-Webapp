import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  Loader2,
  CheckCircle2,
  Wrench,
  Bot,
  User,
  Info,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, streamChatMessage } from '@/features/ai/api';
import { useMe } from '@/features/user/hooks';

// Map raw backend tool names to readable descriptions
const toolNameMap: Record<string, string> = {
  search_transactions: 'Searching transaction database',
  create_transaction: 'Adding transaction record',
  update_transaction: 'Updating transaction details',
  delete_transaction: 'Removing transaction from records',
  get_spending_analytics: 'Computing spending analytics',
  get_budget_status: 'Checking budget limits and pacing status',
  create_budget: 'Creating category budget limit',
  update_budget: 'Modifying category budget limit',
  generate_report: 'Assembling financial report summary',
  financial_insights: 'Generating financial pattern insights',
};

const SUGGESTIONS = [
  { text: 'How is my budget pacing this month?', category: 'Budgets' },
  { text: 'Did I spend anything today?', category: 'Transactions' },
  { text: 'Set a Food budget limit of ₹5000', category: 'Action' },
  { text: 'Add a Groceries expense of ₹350 for fruits', category: 'Action' },
];

// Helper to render bold text
function renderBoldText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong
          key={i}
          className="font-semibold text-slate-900 dark:text-white"
        >
          {part}
        </strong>
      );
    }
    return part;
  });
}

// Simple custom component to render basic markdown lists and bold text cleanly
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1 text-[13.5px] leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Check for headers
        if (trimmed.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="mb-1 mt-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200"
            >
              {renderBoldText(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="mb-1 mt-3 text-sm font-bold text-[#059669] dark:text-emerald-400"
            >
              {renderBoldText(trimmed.slice(3))}
            </h3>
          );
        }

        // Check for bullet lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <ul key={idx} className="my-0.5 list-disc space-y-0.5 pl-5">
              <li className="text-slate-700 dark:text-slate-200">
                {renderBoldText(trimmed.slice(2))}
              </li>
            </ul>
          );
        }

        // Check for numbered lists
        const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (numMatch) {
          return (
            <ol
              key={idx}
              className="my-0.5 list-decimal space-y-0.5 pl-5"
              start={Number(numMatch[1])}
            >
              <li className="text-slate-700 dark:text-slate-200">
                {renderBoldText(numMatch[2])}
              </li>
            </ol>
          );
        }

        // Default paragraph
        return (
          <p
            key={idx}
            className="min-h-[1.1rem] text-slate-700 dark:text-slate-200"
          >
            {renderBoldText(line)}
          </p>
        );
      })}
    </div>
  );
}

export default function AssistantPage() {
  const { data: currentUser } = useMe();
  const [threadId, setThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Thread ID and load history from LocalStorage
  useEffect(() => {
    let savedThreadId = localStorage.getItem('budgetter_thread_id');
    if (!savedThreadId) {
      savedThreadId = 'thread_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('budgetter_thread_id', savedThreadId);
    }
    setThreadId(savedThreadId);

    const savedHistory = localStorage.getItem('budgetter_chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const formatted = parsed.map(
          (m: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })
        );
        setMessages(formatted);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    }
  }, []);

  // Save history to LocalStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('budgetter_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Wipes local state and generates a fresh thread context
  const handleClearHistory = () => {
    if (
      !window.confirm(
        'Are you sure you want to clear this conversation history?'
      )
    )
      return;
    const newThreadId = 'thread_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('budgetter_thread_id', newThreadId);
    localStorage.removeItem('budgetter_chat_history');
    setThreadId(newThreadId);
    setMessages([]);
    toast.success('Conversation history cleared and reset.');
  };

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    setInputText('');

    // Add user message
    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // Initial placeholder for assistant message
    const assistantMsgId = 'msg_' + Math.random().toString(36).substring(2, 11);
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolCalls: [],
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      await streamChatMessage(trimmed, threadId, {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: m.content + token } : m
            )
          );
        },
        onToolStart: (toolName, input) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantMsgId) return m;
              const tools = m.toolCalls ? [...m.toolCalls] : [];
              tools.push({
                tool: toolName,
                status: 'running',
                input,
              });
              return { ...m, toolCalls: tools };
            })
          );
        },
        onToolEnd: (toolName, output) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantMsgId) return m;
              const tools = m.toolCalls
                ? m.toolCalls.map((t) =>
                    t.tool === toolName && t.status === 'running'
                      ? { ...t, status: 'completed' as const, output }
                      : t
                  )
                : [];
              return { ...m, toolCalls: tools };
            })
          );
        },
        onError: (err) => {
          toast.error(err || 'Stream error occurred.');
          setIsStreaming(false);
        },
        onDone: () => {
          setIsStreaming(false);
          toast.success('Response completed.');
        },
      });
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : 'Failed to submit message.';
      toast.error(errMsg);
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] w-full flex-col overflow-hidden rounded-md border border-border_light bg-bg_primary_light shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      {/* Premium Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-bg_secondary_dark/40">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2 dark:bg-emerald-500/20">
            <Cpu className="h-5 w-5 text-[#059669] dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold leading-snug tracking-tight text-text_primary_light dark:text-text_primary_dark">
                Cognitive Financial Engine
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#059669] dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                ENGINE STATE: ACTIVE
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Semantic ledger query orchestration, dynamic budget pacing
              analysis, and programmatic report compilation.
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-rose-500 hover:bg-rose-50/50 hover:text-rose-700 dark:hover:bg-rose-950/20"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear History
          </Button>
        )}
      </div>

      {/* Message Feed */}
      <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center space-y-6 p-8 text-center">
            <div className="animate-bounce-slow rounded-full bg-emerald-500/10 p-4">
              <Bot className="h-10 w-10 text-[#059669] dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                How can I assist your finances today?
              </h3>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                I can process natural statements like adding a purchase,
                checking pacing metrics, or running report summaries.
              </p>
            </div>

            {/* Premium Suggestion Chips */}
            <div className="grid w-full grid-cols-1 gap-2.5 pt-4 sm:grid-cols-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.text)}
                  className="group flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50/50 p-3.5 text-left text-xs text-slate-700 transition-all hover:scale-[1.01] hover:border-[#059669]/40 hover:bg-[#059669]/5 dark:border-border_dark dark:bg-bg_secondary_dark/50 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-500/5"
                >
                  <span className="pr-2 font-medium">{s.text}</span>
                  <span className="rounded bg-slate-200/50 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-500 transition-colors group-hover:bg-[#059669]/10 group-hover:text-[#059669] dark:bg-slate-800 dark:text-slate-400 dark:group-hover:text-emerald-400">
                    {s.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex max-w-[85%] gap-4 ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar Bubble */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs shadow-sm ${
                      isUser
                        ? 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-emerald-500/20 bg-emerald-500/10 text-[#059669] dark:text-emerald-400'
                    }`}
                  >
                    {isUser ? (
                      currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="User Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4.5 w-4.5" />
                      )
                    ) : (
                      <Bot className="h-4.5 w-4.5" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {/* Chat Bubble content */}
                    <div
                      className={`rounded-2xl border p-3 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'rounded-tr-none border-[#047857] bg-gradient-to-br from-[#059669] to-[#047857] text-white'
                          : 'rounded-tl-none border-slate-200/60 bg-slate-50 dark:border-border_dark dark:bg-bg_secondary_dark'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-[13.5px] font-medium leading-relaxed">
                          {m.content}
                        </p>
                      ) : m.content ? (
                        <FormattedMessage content={m.content} />
                      ) : (
                        <div className="flex items-center gap-2 py-1 text-xs text-slate-400 dark:text-slate-500">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#059669] dark:text-emerald-400" />
                          <span>Thinking...</span>
                        </div>
                      )}
                    </div>

                    {/* Tool execution logs */}
                    {m.toolCalls && m.toolCalls.length > 0 && (
                      <div className="flex flex-col gap-1.5 pl-1.5">
                        {m.toolCalls.map((t, tIdx) => {
                          const desc = toolNameMap[t.tool] || t.tool;
                          const isRunning = t.status === 'running';
                          return (
                            <div
                              key={tIdx}
                              className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                            >
                              {isRunning ? (
                                <Wrench className="h-3 w-3 animate-spin text-[#059669] dark:text-emerald-400" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              )}
                              <span>
                                {isRunning ? 'Running' : 'Success'}: {desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-bg_secondary_dark/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="relative flex items-center"
        >
          <Input
            type="text"
            placeholder={
              isStreaming
                ? 'Agent is executing tools...'
                : 'Ask your copilot... (e.g. "show my budgets")'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isStreaming}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-5 pl-4 pr-12 text-sm shadow-sm focus-visible:ring-[#059669] dark:border-slate-800 dark:bg-slate-900"
          />

          <Button
            type="submit"
            disabled={!inputText.trim() || isStreaming}
            className="absolute right-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#059669] p-0 text-white shadow-sm transition-all hover:bg-[#047857] active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            {isStreaming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </form>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          <Info className="h-3 w-3 text-slate-400" />
          <span>
            Budgets are pacing in real-time. Logs sync automatically with your
            profile database.
          </span>
        </div>
      </div>
    </div>
  );
}
