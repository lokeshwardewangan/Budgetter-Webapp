import {
  ANIMATE_WORDS_VARIENT,
  FADE_UP_DESCRIPTION,
  TESTIMONIAL_CARD,
  TESTIMONIALS_CONTAINER,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import { motion } from 'framer-motion';
import { FaQuoteRight } from 'react-icons/fa';
import { testimonials } from '@/data/testimonials';

export { testimonials };

export const Testimonials = () => {
  return (
    <motion.div
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="testimonials_section"
      className="landingpage_section_paddings relative w-full bg-gradient-to-b from-[#ccf2f4]/40 to-[#CCEFF5]/40"
    >
      <div className="landingpage_section_width">
        <motion.h2
          variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
          initial="hidden"
          whileInView="visible"
          className="landingpage_section_heading text-zinc-800"
        >
          What Students Are Saying
        </motion.h2>
        <motion.p
          variants={FADE_UP_DESCRIPTION}
          initial="hidden"
          whileInView="visible"
          className="landingpage_section_subheading text-zinc-500"
        >
          Budgetter empowers students to control their money smartly. Hear what
          our users are loving about it.
        </motion.p>

        <motion.div
          variants={TESTIMONIALS_CONTAINER}
          initial="hidden"
          whileInView="visible"
          className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-7"
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
                className="relative flex flex-col items-center rounded-3xl bg-white p-6 pb-10 shadow-xl transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={optimizedImage}
                  alt={`Photo of ${t.name}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  className="-mt-16 mb-2 h-24 w-24 rounded-full border-[4px] border-[#00b87c] object-cover shadow-md"
                />
                <h3 className="text-lg font-semibold text-zinc-800">
                  {t.name}
                </h3>
                <p className="mt-1 text-center text-sm font-medium leading-relaxed text-gray-600">
                  {t.quote}
                </p>
                <div
                  className="absolute bottom-5 right-6 text-2xl text-[#2e7dff] opacity-60"
                  aria-hidden="true"
                >
                  <FaQuoteRight />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};
