import {
  ANIMATE_WORDS_VARIENT,
  FADE_UP_DESCRIPTION,
  FOOTER_ANIMATION,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';
import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { contactFormSchema } from '@/schemas/userAuth';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { submitContactForm } from '@/services/auth';

const GetInTouchSection: React.FC = () => {
  const { mutateAsync: submitContactFormMutate, isPending } = useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      console.log(data?.message);
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        email: '',
        message: '',
      },
      validationSchema: contactFormSchema,
      onSubmit: (value, action) => {
        // console.log('🚀 ~ value:', value);
        const { name, email, message } = value;
        toast.promise(submitContactFormMutate({ name, email, message }), {
          loading: 'Processing, Sending Message...',
          success: <span>Message Sent Successfully!</span>,
          error: <span>Failed to send message. Please try again.</span>,
        });
        action.resetForm();
      },
    });

  return (
    <motion.div
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="getintouch_section"
      className="landingpage_section_paddings relative w-full bg-gradient-to-b from-[#ccf2f4]/40 to-[#CCEFF5]/40"
    >
      <div className="mx-auto w-full max-w-full px-4 font-karla md:max-w-[38rem]">
        <div className="w-full max-w-full rounded-sm p-4">
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            className="landingpage_section_heading"
          >
            Get in Touch
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            className="landingpage_section_subheading text-gray-600"
          >
            We'd love to hear from you!
          </motion.p>
          <motion.form
            variants={FOOTER_ANIMATION}
            initial="hidden"
            whileInView="visible"
            onSubmit={handleSubmit}
          >
            <div className="relative mb-4">
              <i className="ri-user-line absolute left-3 top-5 -translate-y-1/2 transform text-gray-500"></i>
              <input
                type="text"
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                placeholder="Your Name"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-[#F8F9FB] px-9 py-2.5 font-medium text-slate-900 placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
              {errors.name && touched.name ? (
                <span className="ml-1 text-sm text-red-500">{errors.name}</span>
              ) : null}
            </div>

            <div className="relative mb-4">
              <i className="ri-mail-line absolute left-3 top-5 -translate-y-1/2 transform text-gray-500"></i>
              <input
                type="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                placeholder="Your Email"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-[#F8F9FB] px-9 py-2.5 font-medium text-slate-900 placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
              {errors.email && touched.email ? (
                <span className="ml-1 text-sm text-red-500">
                  {errors.email}
                </span>
              ) : null}
            </div>

            <div className="relative mb-6">
              <i className="ri-message-3-line absolute left-3 top-5 -translate-y-1/2 transform text-gray-500"></i>
              <textarea
                id="message"
                placeholder="Your Message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                name="message"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-[#F8F9FB] px-9 py-2.5 font-medium text-slate-900 placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                rows={4}
              ></textarea>
              {errors.message && touched.message ? (
                <span className="ml-1 text-sm text-red-500">
                  {errors.message}
                </span>
              ) : null}
            </div>
            <div className="btn_con flex w-full items-center justify-end">
              <button
                type="submit"
                className="hero_section_button glow-hover mt-2.5 flex items-center justify-center rounded-full bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 px-10 py-1.5 text-base font-semibold text-white shadow-xl transition-all duration-500 ease-in-out hover:scale-105 hover:bg-gradient-to-br"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending . . .
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export default GetInTouchSection;
