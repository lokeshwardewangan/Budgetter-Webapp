import {
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  GRAPH_BOX,
  GRAPH_CONTAINER,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { motion } from 'framer-motion';

const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;
const VIEWPORT_GRID = { once: true, amount: 0.15 } as const;

const InsightsPreview = () => {
  return (
    <section
      id="insightspreview_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-white via-sky-50/40 to-slate-50"
    >
      {/* Decorative gradient blobs — refined cool sky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"
      />

      <div className="landingpage_section_paddings landingpage_section_width relative">
        <div className="flex flex-col items-center">
          <motion.span
            variants={EYEBROW_REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_eyebrow"
          >
            📊 Smart Insights
          </motion.span>
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_heading"
          >
            Expense Analytics &{' '}
            <span className="gradient_emerald_accent">Insights</span>
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_subheading"
          >
            Understand your spending behavior with interactive graphs and
            breakdowns. Spot trends, optimize budgets, and stay in control.
          </motion.p>
        </div>

        <motion.div
          variants={GRAPH_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_GRID}
          className="grid gap-6 md:grid-cols-2 lg:gap-8 2xl:gap-10"
        >
          <motion.div
            variants={GRAPH_BOX}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <i className="ri-pie-chart-2-line text-lg"></i>
              </span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 2xl:text-xl">
                Category Breakdown
              </h3>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-slate-600 2xl:text-base">
              Get a clear visual distribution of your expenses across different
              categories. Easily spot which areas consume most of your budget.
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src="https://res.cloudinary.com/budgettercloud/image/upload/f_auto,q_auto,w_1300/v1772306486/Screenshot_3_idi9w6.png"
                alt="Category wise expense chart"
                width={636}
                height={447}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>

          <motion.div
            variants={GRAPH_BOX}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 opacity-80" />
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <i className="ri-line-chart-line text-lg"></i>
              </span>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 2xl:text-xl">
                Spending Trends Over Time
              </h3>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-slate-600 2xl:text-base">
              Monitor your monthly, weekly, or daily expenses. Understand your
              financial flow and identify months with higher spending patterns.
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <img
                src="https://res.cloudinary.com/budgettercloud/image/upload/f_auto,q_auto,w_1300/v1772306476/Screenshot_4_hesrgg.png"
                alt="Expenses over time graph"
                width={636}
                height={394}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InsightsPreview;
