import { z } from 'zod';

// Reusable primitives ---------------------------------------------------------

const usernameRule = z
  .string()
  .min(4, 'Username must be at least 4 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  );

const emailRule = z.string().email('Invalid email address').toLowerCase();

const passwordRule = z
  .string()
  .min(6, 'Password must be at least 6 characters');

const nameRule = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(40, 'Name must be less than 40 characters');

// Schemas ---------------------------------------------------------------------

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'This field is required')
    .refine(
      (value) =>
        emailRule.safeParse(value).success ||
        usernameRule.safeParse(value).success,
      { message: 'Must be a valid email or username' }
    ),
  password: passwordRule,
});

export const signupSchema = z.object({
  username: usernameRule,
  name: nameRule,
  email: emailRule,
  password: passwordRule,
});

export const forgotPasswordSchema = z.object({
  email: emailRule,
});

export const resetPasswordSchema = z
  .object({
    password: passwordRule,
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  });

// Inferred types --------------------------------------------------------------

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
