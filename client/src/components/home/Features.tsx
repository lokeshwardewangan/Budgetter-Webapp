import React from 'react';
import FeatureCard from '../cards/FeatureCard';
import { cardData } from '@/data/featurecard';
import {
  CARDS_CONTAINER,
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { motion } from 'framer-motion';

const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;
const VIEWPORT_GRID = { once: true, amount: 0.1 } as const;

const Features: React.FC = () => {
  return (
    <section
      id="features_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#f0fdfa] via-white to-[#ecfeff]"
    >
      {/* Decorative gradient blobs — mint/lime mood */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-cyan-200/25 blur-3xl"
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
            ✨ Core Features
          </motion.span>
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_heading"
          >
            Everything You Need to{' '}
            <span className="gradient_emerald_accent">Stay on Track</span>
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_subheading"
          >
            From quick expense logging to insightful summaries, every feature is
            crafted to make student-style budgeting effortless and clear.
          </motion.p>
        </div>

        <motion.div
          variants={CARDS_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_GRID}
          className="feature_box_container mt-4 grid w-full grid-cols-1 gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cardData.map(({ title, description, icon, bg }, index) => (
            <React.Fragment key={index}>
              <FeatureCard
                title={title}
                description={description}
                icon={icon}
                bg={bg}
              />
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
