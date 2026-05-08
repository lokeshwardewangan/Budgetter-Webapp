import { FOOTER_ANIMATION } from '@/utils/framer/properties';
import React from 'react';
import {
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiGithubLine,
  RiMailLine,
} from 'react-icons/ri';
import { motion } from 'framer-motion';

const VIEWPORT_FOOTER = { once: true, amount: 0.1 } as const;

const Footer: React.FC = () => {
  return (
    <motion.footer
      variants={FOOTER_ANIMATION}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_FOOTER}
      className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-[#020617] text-slate-300"
    >
      {/* Top accent line — brand gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
      />
      {/* Decorative mesh blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
      />
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />

      <div className="landingpage_section_width relative px-6 pt-20">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <a
              href="/"
              aria-label="Budgetter home"
              className="inline-flex items-center gap-2.5"
            >
              <img
                src="/assets/logo/logo.png"
                alt=""
                className="h-9 w-auto"
                width={48}
                height={45}
                loading="lazy"
                decoding="async"
              />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Budgetter
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Take control of your money. Effortlessly track, analyze, and
              manage your daily expenses with smart insights — built for
              students.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {[
                {
                  href: 'https://www.instagram.com/lokeshwarprasad1',
                  label: 'Instagram',
                  icon: RiInstagramLine,
                  hover: 'hover:text-pink-400 hover:border-pink-400/40',
                },
                {
                  href: 'https://www.linkedin.com/in/lokeshwar-dewangan-7b2163211/',
                  label: 'LinkedIn',
                  icon: RiLinkedinLine,
                  hover: 'hover:text-sky-400 hover:border-sky-400/40',
                },
                {
                  href: 'https://x.com/@LokeshwarPras17',
                  label: 'X (Twitter)',
                  icon: RiTwitterXLine,
                  hover: 'hover:text-white hover:border-white/40',
                },
                {
                  href: 'https://github.com/lokeshwarprasad',
                  label: 'GitHub',
                  icon: RiGithubLine,
                  hover: 'hover:text-emerald-300 hover:border-emerald-300/40',
                },
              ].map(({ href, label, icon: Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/[0.08] ${hover}`}
                >
                  <Icon aria-hidden="true" className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
              Features
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                'Track Expenses',
                'Spending Overview',
                'Lent Money Management',
                'Category Insights',
                'Report Generation',
              ].map((item) => (
                <li
                  key={item}
                  className="text-slate-400 transition-colors hover:text-emerald-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Home', href: '#hero_section' },
                { name: 'Features', href: '#features_section' },
                { name: 'For Students', href: '#usefullforstudent_section' },
                { name: 'Insights', href: '#insightspreview_section' },
                { name: 'Contact', href: '#getintouch_section' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-emerald-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-200">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Get product tips and updates straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center"
            >
              <RiMailLine
                aria-hidden="true"
                className="absolute left-3 text-slate-500"
              />
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-28 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              />
              <button
                type="submit"
                className="absolute right-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-7 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Budgetter. All rights reserved.</p>
          <p>
            Crafted by{' '}
            <a
              className="font-semibold text-slate-300 transition-colors hover:text-emerald-300"
              target="_blank"
              rel="noreferrer"
              href="https://lokeshwardewangan.in"
            >
              Lokeshwar Dewangan
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
