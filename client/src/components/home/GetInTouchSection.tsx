import {
  ANIMATE_WORDS_VARIENT,
  EYEBROW_REVEAL,
  FADE_UP_DESCRIPTION,
  FOOTER_ANIMATION,
  UPWARD_WAVE_SCALE_HEADING_ANIMATION,
} from '@/utils/framer/properties';

const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const;
const VIEWPORT_FORM = { once: true, amount: 0.15 } as const;
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
    <motion.section
      variants={ANIMATE_WORDS_VARIENT}
      initial="initial"
      animate="animate"
      id="getintouch_section"
      className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/50"
    >
      {/* Decorative blobs — refined brand teal/emerald */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-teal-200/25 blur-3xl"
      />

      <div className="landingpage_section_paddings relative">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 font-karla">
          <motion.span
            variants={EYEBROW_REVEAL}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_eyebrow"
          >
            ✉️ Let's Talk
          </motion.span>
          <motion.h2
            variants={UPWARD_WAVE_SCALE_HEADING_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_heading"
          >
            Get in <span className="gradient_emerald_accent">Touch</span>
          </motion.h2>
          <motion.p
            variants={FADE_UP_DESCRIPTION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="landingpage_section_subheading"
          >
            Have a question, idea, or feedback? We'd love to hear from you —
            drop a message and we'll get back soon.
          </motion.p>

          <motion.form
            variants={FOOTER_ANIMATION}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_FORM}
            onSubmit={handleSubmit}
            className="w-full rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-md shadow-slate-200/40 backdrop-blur sm:p-8"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Name
              </label>
              <div className="relative">
                <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="name"
                  placeholder="Your full name"
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-9 py-2.5 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
              {errors.name && touched.name ? (
                <span className="mt-1 block text-xs font-medium text-red-500">
                  {errors.name}
                </span>
              ) : null}
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 px-9 py-2.5 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
              {errors.email && touched.email ? (
                <span className="mt-1 block text-xs font-medium text-red-500">
                  {errors.email}
                </span>
              ) : null}
            </div>

            <div className="mb-6">
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Message
              </label>
              <div className="relative">
                <i className="ri-message-3-line absolute left-3 top-3.5 text-slate-400"></i>
                <textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="message"
                  rows={4}
                  className="block w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 px-9 py-2.5 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                ></textarea>
              </div>
              {errors.message && touched.message ? (
                <span className="mt-1 block text-xs font-medium text-red-500">
                  {errors.message}
                </span>
              ) : null}
            </div>

            <div className="flex w-full items-center justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send Message</span>
                    <i className="ri-send-plane-line relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"></i>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
};

export default GetInTouchSection;
