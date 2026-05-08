import { Variants } from 'framer-motion';

// Modern easings — used across the landing page for a consistent feel.
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// variant popup
export const MENU_EFFECT_VARIENT: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: { opacity: 0, scale: 0 },
};
// variant popup texts
export const MENU_ITEM_EFFECT_VARIENT: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
    },
  },
  exit: { opacity: 0, scale: 0 },
};

// Sticky-note feature card: gentle swing-in matching the hook design,
// subtle lift + tilt on hover (replaces the dated rotateY flip).
// Provides both hidden/visible (for parent stagger) and initial/whileInView
// (for standalone usage) so it composes with CARDS_CONTAINER.
export const CARDS_EFFECT_VARIENT: Variants = {
  hidden: { opacity: 0, y: 28, rotate: -2 },
  initial: { opacity: 0, y: 28, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 160, damping: 18, mass: 0.8 },
  },
  whileInView: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 160, damping: 18, mass: 0.8 },
  },
  whileHover: {
    y: -6,
    rotate: 0.8,
    transition: { type: 'spring', stiffness: 320, damping: 20 },
  },
  whileTap: { scale: 0.97, transition: { duration: 0.12 } },
};

// Section heading: clean fade + blur-in (Linear/Vercel feel).
export const UPWARD_WAVE_SCALE_HEADING_ANIMATION: Variants = {
  hidden: { y: 24, opacity: 0, filter: 'blur(8px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.08 },
  },
};

// Subheading / description text below the section heading.
export const FADE_UP_DESCRIPTION: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.18 },
  },
};

// Eyebrow pill (label) — appears first in the cascade, no delay.
export const EYEBROW_REVEAL: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

// Hero/section parent stagger (kept compatible with existing usage).
export const ANIMATE_WORDS_VARIENT: Variants = {
  initial: { opacity: 0, y: 24 },
  whileHover: {
    scale: 1.04,
    transition: { duration: 0.25, ease: EASE_OUT_EXPO },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
      staggerChildren: 0.08,
    },
  },
};

export const CARDS_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const CARD_ITEM: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const GRAPH_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const GRAPH_BOX: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const TESTIMONIALS_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

export const TESTIMONIAL_CARD: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export const FOOTER_ANIMATION: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};
