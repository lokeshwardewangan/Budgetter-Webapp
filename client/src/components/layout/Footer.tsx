import { FOOTER_ANIMATION } from '@/utils/framer/properties';
import React from 'react';
import {
  RiInstagramLine,
  RiLinkedinLine,
  RiTwitterXLine,
  RiGithubLine,
} from 'react-icons/ri';
import { motion } from 'framer-motion';
const Footer: React.FC = () => {
  return (
    <motion.footer
      variants={FOOTER_ANIMATION}
      initial="hidden"
      whileInView="visible"
      className="border-t border-slate-200 bg-slate-50 pt-16"
    >
      <div className="landingpage_section_width mx-auto grid grid-cols-1 gap-12 px-6 pb-12 text-slate-600 sm:grid-cols-2 md:grid-cols-4">
        {/* Logo + Brand */}
        <div className="col-span-1">
          <a
            href="/"
            aria-label="Budgetter home"
            className="flex items-center gap-2"
          >
            <img
              src="/assets/logo/logo.png"
              alt=""
              className="h-9"
              width={48}
              height={45}
              loading="lazy"
              decoding="async"
            />
            <span className="bg-gradient-to-r from-[#2e7dff] to-[#00b87c] bg-clip-text text-2xl font-bold text-transparent">
              Budgetter
            </span>
          </a>
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            Take control of your money. Effortlessly track, analyze, and manage
            your daily expenses with smart insights.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
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
              <li key={item} className="transition-colors hover:text-[#2e7dff]">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: 'Home', href: '#hero_section' },
              { name: 'For Student', href: '#usefullforstudent_section' },
              { name: 'Features', href: '#features_section' },
              { name: 'Contact', href: '#getintouch_section' },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-[#2e7dff]"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
            Follow Us
          </h3>
          <div className="flex space-x-5 text-xl text-slate-600">
            <a
              href="https://www.instagram.com/lokeshwarprasad1"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-[#E1306C]"
            >
              <RiInstagramLine aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/lokeshwar-dewangan-7b2163211/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-[#0077B5]"
            >
              <RiLinkedinLine aria-hidden="true" />
            </a>
            <a
              href="https://x.com/@LokeshwarPras17"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="transition-colors hover:text-black"
            >
              <RiTwitterXLine aria-hidden="true" />
            </a>
            <a
              href="https://github.com/lokeshwarprasad"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-[#333]"
            >
              <RiGithubLine aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Budgetter. Built by{' '}
        <a
          className="font-semibold text-slate-700 hover:text-[#2e7dff]"
          target="_blank"
          href="https://lokeshwardewangan.in"
        >
          Lokeshwar Dewangan
        </a>
        .
      </div>
    </motion.footer>
  );
};

export default Footer;
