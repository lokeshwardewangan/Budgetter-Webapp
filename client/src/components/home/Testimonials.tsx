import {
  ANIMATE_WORDS_VARIENT,
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  TESTIMONIAL_CARD,
  TESTIMONIALS_CONTAINER,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { motion } from 'framer-motion';
import { FaQuoteRight } from 'react-icons/fa';
import { testimonials } from '@/data/testimonials';

const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;
const VIEWPORT_GRID = { once: true, amount: 0.15 } as const;

export { testimonials };

export const Testimonials = () => {
  return (
    <motion.section
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="testimonials_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50/40 via-white to-stone-100/50"
    >
      {/* Decorative blobs — refined warm cream/amber, subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl"
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
            💬 Loved by Students
          </motion.span>
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_heading"
          >
            What Students Are{' '}
            <span className="gradient_emerald_accent">Saying</span>
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_subheading"
          >
            Budgetter empowers students to control their money smartly. Hear
            what our users are loving about it.
          </motion.p>
        </div>

        <motion.div
          variants={TESTIMONIALS_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_GRID}
          className="mt-12 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-7"
        >
          {testimonials.map((t) => {
            const optimizedImage = t.image.replace(
              '/upload/',
              '/upload/f_auto,q_auto,w_192,h_192,c_fill,g_face/'
            );
            return (
              <motion.div
                key={t.name}
                variants={TESTIMONIAL_CARD}
                className="group relative flex flex-col items-center rounded-3xl border border-slate-200/70 bg-white/90 p-6 pb-10 shadow-md shadow-slate-200/40 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-1 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={optimizedImage}
                    alt={`Photo of ${t.name}`}
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="mt-14 flex flex-col items-center">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">
                    {t.name}
                  </h3>
                  <div className="mt-1 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="h-3.5 w-3.5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-3 text-center text-sm font-medium leading-relaxed text-slate-600">
                    “{t.quote}”
                  </p>
                </div>
                <div
                  className="absolute bottom-5 right-6 text-2xl text-emerald-500/30 transition-colors duration-300 group-hover:text-emerald-500/60"
                  aria-hidden="true"
                >
                  <FaQuoteRight />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};
