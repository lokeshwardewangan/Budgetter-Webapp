import { cn } from '@/lib/utils';
import {
  ANIMATE_WORDS_VARIENT,
  CARD_ITEM,
  CARDS_CONTAINER,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const items = [
  {
    title: 'Track Daily Spending',
    description:
      'Helps students see where their money goes every day — snacks, travel, or online shopping.',
    link: '#',
  },
  {
    title: 'Understand Expense Habits',
    description:
      'Visually understand which category (like food or transport) is consuming the most money.',
    link: '#',
  },
  {
    title: 'Manage Pocket Money',
    description:
      'Track how much pocket money is received and how it’s spent, ensuring better decisions.',
    link: '#',
  },
  {
    title: 'Lent Money Tracking',
    description:
      'Never forget who borrowed money — keep a clear record of lent amounts and status.',
    link: '#',
  },
  {
    title: 'Plan Monthly Budget',
    description:
      'Helps build financial discipline with simple monthly planning and spending patterns.',
    link: '#',
  },
  {
    title: 'Visual Reports & Insights',
    description:
      'Students get clean charts and insights to analyze their money without manual work.',
    link: '#',
  },
];

export const WhyItIsUseful = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="usefullforstudent_section"
      className="landingpage_section_paddings relative w-full bg-gradient-to-b from-[#ccf2f4]/40 to-[#CCEFF5]/40"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 2xl:max-w-7xl">
        <motion.h2
          variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
          initial="hidden"
          whileInView="visible"
          className="landingpage_section_heading"
        >
          Why Budgetter is Useful for Students
        </motion.h2>
        <motion.div
          variants={CARDS_CONTAINER}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-2 2xl:gap-6"
        >
          {items.map((item, idx) => (
            <motion.div
              key={`${item.title}-${idx}`}
              variants={CARD_ITEM}
              className="group relative block py-2 sm:p-2"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 block h-full w-full rounded-3xl bg-gradient-to-br from-[#2e7dff]/10 to-[#00b87c]/10"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0.1 },
                    }}
                  />
                )}
              </AnimatePresence>
              <Card>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
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
        'relative z-20 h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-md transition-shadow duration-200 group-hover:shadow-lg',
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
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
        'mb-2 text-lg font-semibold tracking-wide text-[#2e7dff]',
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
    <p className={cn('text-sm leading-relaxed text-gray-600', className)}>
      {children}
    </p>
  );
};
