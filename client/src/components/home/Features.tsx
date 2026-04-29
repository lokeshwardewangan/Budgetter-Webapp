import React from 'react';
import FeatureCard from '../cards/FeatureCard';
import { cardData } from '@/data/featurecard';
import { UPWARD_WAVE_SCALE_HEADING_ANIMATION } from '@/utils/framer/properties';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  return (
    <>
      <div
        id="features_section"
        className="features_container landingpage_section_paddings landingpage_section_width mx-auto flex w-full flex-col items-center justify-center gap-14 2xl:gap-16"
      >
        <motion.h2
          variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
          initial="hidden"
          whileInView="visible"
          className="landingpage_section_heading"
        >
          Features That Matters
        </motion.h2>

        <div className="feature_box_container grid w-full grid-cols-1 gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {/* box -1 */}
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
        </div>
      </div>
    </>
  );
};

export default Features;
