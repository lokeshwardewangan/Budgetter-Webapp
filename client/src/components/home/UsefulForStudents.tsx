import { cn } from '@/lib/utils';
import {
  ANIMATE_WORDS_VARIENT,
  CARD_ITEM,
  CARDS_CONTAINER,
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;
const VIEWPORT_GRID = { once: true, amount: 0.1 } as const;

const items = [
  {
    title: 'Track Daily Spending',
    description:
      'Helps students see where their money goes every day — snacks, travel, or online shopping.',
    icon: 'ri-coins-line',
    link: '#',
  },
  {
    title: 'Understand Expense Habits',
    description:
      'Visually understand which category (like food or transport) is consuming the most money.',
    icon: 'ri-bar-chart-2-line',
    link: '#',
  },
  {
    title: 'Manage Pocket Money',
    description:
      'Track how much pocket money is received and how it’s spent, ensuring better decisions.',
    icon: 'ri-wallet-3-line',
    link: '#',
  },
  {
    title: 'Lent Money Tracking',
    description:
      'Never forget who borrowed money — keep a clear record of lent amounts and status.',
    icon: 'ri-hand-coin-line',
    link: '#',
  },
  {
    title: 'Plan Monthly Budget',
    description:
      'Helps build financial discipline with simple monthly planning and spending patterns.',
    icon: 'ri-calendar-todo-line',
    link: '#',
  },
  {
    title: 'Visual Reports & Insights',
    description:
      'Students get clean charts and insights to analyze their money without manual work.',
    icon: 'ri-line-chart-line',
    link: '#',
  },
];

export const WhyItIsUseful = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.section
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="usefullforstudent_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40"
    >
      {/* Decorative blobs — refined cool slate + brand emerald */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl"
      />
      {/* Subtle dotted grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
      />

      <div className="landingpage_section_paddings relative">
        <div className="mx-auto flex max-w-5xl flex-col items-center 2xl:max-w-7xl">
          <motion.span
            variants={EYEBROW_REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_eyebrow"
          >
            🎓 Built for Students
          </motion.span>
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_heading"
          >
            Why Budgetter is{' '}
            <span className="gradient_emerald_accent">Useful</span> for Students
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_subheading"
          >
            Designed around how students actually spend — pocket money, snacks,
            shared bills, and lent change. Get clarity on every rupee without
            the spreadsheet headache.
          </motion.p>

          <motion.div
            variants={CARDS_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_GRID}
            className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {items.map((item, idx) => (
              <motion.div
                key={`${item.title}-${idx}`}
                variants={CARD_ITEM}
                className="group relative block"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 block h-full w-full rounded-2xl bg-gradient-to-br from-emerald-100/70 to-cyan-100/70"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.2 } }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.1 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <Card>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <i className={`${item.icon} text-xl`}></i>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-lg group-hover:shadow-emerald-500/10',
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3
      className={cn(
        'mb-2 text-lg font-bold tracking-tight text-slate-900',
        className
      )}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn('text-sm leading-relaxed text-slate-600', className)}>
      {children}
    </p>
  );
};
