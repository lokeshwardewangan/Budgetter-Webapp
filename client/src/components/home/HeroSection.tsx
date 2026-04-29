import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ANIMATE_WORDS_VARIENT } from '@/utils/framer/properties';
import React from 'react';
import { testimonials } from '@/data/testimonials';

const HeroSection: React.FC = () => {
  const MotionLink = motion.create(Link);

  // Cloudinary transform: serve a 80x80 (2x of 40px display) auto-format/quality
  const toSmallAvatar = (url: string) =>
    url.replace('/upload/', '/upload/f_auto,q_auto,w_80,h_80,c_fill,g_face/');

  const userImages = testimonials.map((user) => toSmallAvatar(user.image));

  const RatedUsers = [
    ...userImages,
    'https://i.pravatar.cc/80?u=$584',
    'https://i.pravatar.cc/80?u=$1168',
  ];
  return (
    <motion.div
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      className="hero_section_container relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-between px-4 py-10 pb-14 sm:flex-row xl:pb-14 2xl:max-w-7xl 2xl:py-14"
    >
      <div className="hero_section_content z-10 flex w-full max-w-xl flex-col justify-center gap-5 xl:w-1/2 xl:max-w-none">
        <motion.div variants={ANIMATE_WORDS_VARIENT}>
          <span className="mb-3 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ✨ Comprehensive Financial Insights
          </span>
          <h1 className="hero_section_title font-bree text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-5xl">
            Track Every Rupee. <br className="hidden sm:block" />
            Spend Smarter{' '}
            <span className="relative inline-block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text pb-2 text-transparent">
              Every Day.
              {/* Underline decoration */}
              <svg
                className="absolute bottom-0 left-0 h-2.5 w-full text-emerald-500 opacity-60"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={ANIMATE_WORDS_VARIENT}
          className="hero_section_description text-base font-medium text-slate-600 dark:text-slate-300 sm:text-lg lg:max-w-lg"
        >
          Budgetter helps you record daily expenses, analyze spending habits,
          and manage your money with clear dashboaTrack daily expenses, manage
          income, and clearly see where your money goes—so you stay in control
          every day.
        </motion.p>

        <motion.div
          variants={ANIMATE_WORDS_VARIENT}
          className="hero_buttons flex w-full flex-col gap-3 sm:flex-row sm:items-center 2xl:mt-4"
        >
          <MotionLink
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            to="/login"
            className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:shadow-emerald-500/30"
          >
            <span className="relative z-10">Get Started Now</span>
            <svg
              className="relative z-10 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0 group-hover:skew-x-12" />
          </MotionLink>

          <MotionLink
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            to="https://lokeshwardewangan.in/"
            target="_blank"
            className="group flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-2 text-sm font-bold text-slate-700 transition-all hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-500"
          >
            <span>About Developer</span>
          </MotionLink>
        </motion.div>

        <motion.div
          variants={ANIMATE_WORDS_VARIENT}
          className="flex flex-col gap-4 sm:flex-row sm:items-center 2xl:mt-2"
        >
          <div className="flex -space-x-4">
            {RatedUsers.map((url, i) => (
              <div
                key={i}
                className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md transition-all hover:z-10 hover:scale-110 dark:border-slate-800"
              >
                <img
                  src={url}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full bg-slate-100 object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-4 w-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Rated 5 stars by 100+ users
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={ANIMATE_WORDS_VARIENT}
        className="flag_image relative mt-10 flex w-full justify-center xl:mt-0 xl:w-1/2"
      >
        <div className="relative w-full max-w-[450px] 2xl:max-w-[500px]">
          {/* Abstract blob behind image */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl"></div>

          <MotionLink
            whileHover={{ y: -5 }}
            to="/dashboard"
            className="relative block rounded-xl border border-slate-200/50 bg-white/50 p-0 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/50"
          >
            <img
              className="h-auto w-full rounded-lg shadow-sm dark:shadow-none"
              src="/assets/dashboard/hero-min.svg"
              alt="Budgetter Dashboard Preview"
              width={900}
              height={600}
              decoding="async"
            />
            {/* Floating UI Card Decoration */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-4 hidden items-center gap-3 rounded-lg bg-white p-3 shadow-lg dark:bg-slate-800 sm:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-500">
                  Total Savings
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ₹12,450
                </p>
              </div>
            </motion.div>
          </MotionLink>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
