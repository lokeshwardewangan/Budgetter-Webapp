import {
  ANIMATE_WORDS_VARIENT,
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VIEWPORT_ONCE = { once: true, amount: 0.4 } as const;

export const CallToAction = () => {
  return (
    <motion.section
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="calltoaction_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900"
    >
      {/* Mesh gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-teal-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
      />
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="landingpage_section_paddings relative flex flex-col items-center px-4">
        <motion.span
          variants={EYEBROW_REVEAL}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300 backdrop-blur"
        >
          🚀 Start Saving Today
        </motion.span>

        <motion.h2
          variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="max-w-4xl text-center font-bree text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] 2xl:text-5xl"
        >
          Take Control of Your{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Finances
          </span>{' '}
          Today
        </motion.h2>

        <motion.p
          variants={FADE_UP_DESCRIPTION}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mx-auto mb-10 mt-4 max-w-2xl text-center text-sm font-medium leading-relaxed text-slate-300 sm:text-base 2xl:text-lg"
        >
          Join thousands of students using Budgetter to track expenses, manage
          pocket money, and build smart spending habits effortlessly.
        </motion.p>

        <motion.div
          variants={FADE_UP_DESCRIPTION}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            to="/signup"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-emerald-500/40 sm:text-base"
          >
            <span className="relative z-10">Sign Up Today</span>
            <i className="ri-arrow-right-line relative z-10 transition-transform duration-300 group-hover:translate-x-1"></i>
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0 group-hover:skew-x-12" />
          </Link>

          <Link
            to="/login"
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:border-emerald-400/50 hover:bg-white/10 sm:text-base"
          >
            <span>Sign In</span>
            <i className="ri-login-circle-line transition-transform duration-300 group-hover:translate-x-1"></i>
          </Link>
        </motion.div>

        <motion.p
          variants={FADE_UP_DESCRIPTION}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-8 flex items-center gap-2 text-xs text-slate-400"
        >
          <i className="ri-shield-check-line text-emerald-400"></i>
          No credit card required · Free forever for students
        </motion.p>
      </div>
    </motion.section>
  );
};
