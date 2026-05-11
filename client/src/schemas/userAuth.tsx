import * as Yup from 'yup';

// Auth schemas moved to `@/features/auth/schemas` (Zod). This file now only
// holds the landing-page contact form schema, which is left on Yup until
// the landing page itself is refactored.

const nameValidation = Yup.string().min(5).max(20).required('Name is required');

const emailValidation = Yup.string()
  .email('Invalid email format')
  .required('Email is required');

const userMessageValidation = Yup.string()
  .min(20, 'Message must be at least 20 characters')
  .max(500, 'Message must be less than 500 characters')
  .required('Message is required');

export const contactFormSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  message: userMessageValidation,
});
