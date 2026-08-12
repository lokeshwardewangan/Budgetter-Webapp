import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Zap,
  ShieldCheck,
  PieChart,
  ArrowRight,
  MessageSquareCode,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

export const AiAssistantShowcase: React.FC = () => {
  const MotionLink = motion.create(Link);

  return (
    <section
      id="ai_showcase_section"
      className="relative w-full overflow-hidden bg-slate-900 py-12 text-white sm:py-20"
    >
      {/* Decorative Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-60 w-60 rounded-full bg-emerald-500/10 blur-[80px] sm:h-72 sm:w-72 sm:blur-[100px]"
      />

      <div className="landingpage_section_width relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md sm:gap-2 sm:px-4 sm:py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span className="truncate">Introducing Budgetter AI Copilot</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-bree text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.75rem] 2xl:text-4xl"
          >
            Manage Your Money with{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Natural Language Intelligence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed text-slate-400 sm:mt-4 sm:text-base 2xl:text-lg"
          >
            No complex forms required. Simply type what you spent, ask for
            budget advice, or request custom reports—your autonomous AI
            financial copilot handles the rest.
          </motion.p>
        </div>

        {/* Showcase Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-14 sm:gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Interactive Chat Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 shadow-2xl backdrop-blur-xl sm:p-6">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3 sm:pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 sm:h-9 sm:w-9">
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 sm:text-sm">
                      Cognitive Financial Engine
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      <span className="font-mono text-[9px] text-emerald-400 sm:text-[10px]">
                        ENGINE STATE: ACTIVE
                      </span>
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[9px] font-medium text-slate-400 sm:px-2.5 sm:py-1 sm:text-[10px]">
                  LangChain + Gemini / OpenAI
                </span>
              </div>

              {/* Mock Messages Container */}
              <div className="mt-3.5 space-y-3 text-xs sm:mt-4 sm:space-y-4 sm:text-sm">
                {/* User Message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] break-words rounded-2xl rounded-tr-none bg-emerald-600 px-3.5 py-2 text-white shadow-md sm:max-w-[85%] sm:px-4 sm:py-2.5">
                    Log ₹350 for dinner at Dominos under Food category today.
                  </div>
                </div>

                {/* AI Response 1 */}
                <div className="flex justify-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 sm:h-7 sm:w-7">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="max-w-[90%] break-words rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-slate-200 shadow-md sm:max-w-[85%] sm:px-4 sm:py-3">
                    <p className="leading-relaxed">
                      Successfully added expense:{' '}
                      <span className="font-semibold text-emerald-400">
                        Dominos (₹350)
                      </span>{' '}
                      under{' '}
                      <span className="font-semibold text-teal-300">Food</span>.
                    </p>
                    <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2 text-[11px] sm:text-xs">
                      <span className="font-semibold text-emerald-400">
                        Remaining Food Budget:
                      </span>{' '}
                      ₹1,650 out of ₹2,000 limit.
                    </div>
                  </div>
                </div>

                {/* User Message 2 */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] break-words rounded-2xl rounded-tr-none bg-emerald-600 px-3.5 py-2 text-white shadow-md sm:max-w-[85%] sm:px-4 sm:py-2.5">
                    Am I on track with my overall spending this month?
                  </div>
                </div>

                {/* AI Response 2 */}
                <div className="flex justify-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 sm:h-7 sm:w-7">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div className="max-w-[90%] break-words rounded-2xl rounded-tl-none border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-slate-200 shadow-md sm:max-w-[85%] sm:px-4 sm:py-3">
                    <p className="leading-relaxed">
                      You have spent{' '}
                      <span className="font-bold text-white">₹4,250</span> of
                      your{' '}
                      <span className="font-bold text-emerald-400">
                        ₹10,000
                      </span>{' '}
                      overall monthly budget (42.5%).
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 sm:text-xs">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <span className="block h-full w-[42.5%] bg-gradient-to-r from-emerald-500 to-teal-400"></span>
                      </span>
                      <span className="shrink-0 font-medium">
                        Pacing: Excellent
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Prompt Pills */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-800/80 pt-3 sm:mt-5 sm:gap-2 sm:pt-4">
                <span className="text-[10px] font-medium text-slate-400 sm:text-[11px]">
                  Try prompting:
                </span>
                {[
                  '"Show July report"',
                  '"Update lent money ₹500 to Alex"',
                  '"How much spent on Rent?"',
                ].map((prompt, idx) => (
                  <span
                    key={idx}
                    className="cursor-pointer rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[9px] text-slate-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300 sm:px-2.5 sm:py-1 sm:text-[10px]"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-12 space-y-5 sm:space-y-6 lg:col-span-5"
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 sm:h-11 sm:w-11">
                <MessageSquareCode className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  Conversational Ledger Controls
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:mt-1 sm:text-sm">
                  Create, search, update, or refund expenses and lent money
                  using everyday speech. No navigation back-and-forth needed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-400 sm:h-11 sm:w-11">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  Dynamic Budget Pacing
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:mt-1 sm:text-sm">
                  Real-time budget limit analysis across categories with instant
                  warning alerts before you overspend.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 sm:h-11 sm:w-11">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  Instant Report Compilation
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:mt-1 sm:text-sm">
                  Request custom monthly breakdowns, category tallies, or
                  exportable summary metrics with zero effort.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 sm:h-11 sm:w-11">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  Isolated & Private Session
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400 sm:mt-1 sm:text-sm">
                  Strict JWT user scoping ensures your personal ledger data is
                  100% private and protected.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <MotionLink
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                to="/user/assistant"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 sm:inline-flex sm:w-auto"
              >
                <span>Try AI Financial Assistant</span>
                <ArrowRight className="h-4 w-4" />
              </MotionLink>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
