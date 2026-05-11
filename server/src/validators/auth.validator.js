import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const registerSchema = z.object({
  username: z.string().trim().min(5, 'Username must be at least 5 characters').max(30),
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z
  .object({
    username: z.string().trim().optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((d) => d.username || d.email, {
    message: 'username or email is required',
    path: ['email'],
  });

export const googleLoginSchema = z.object({
  token: z.string().min(1, 'Google ID token is required'),
});

export const tokenQuerySchema = z.object({
  token: z.string().min(1, 'token is required'),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const passwordResetSchema = z.object({
  userId: objectIdSchema,
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
