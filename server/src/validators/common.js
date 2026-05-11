import { z } from 'zod';
import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '../models/expenses.model.js';

// MongoDB ObjectId — accepts a 24-hex-char string.
export const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: 'Invalid ObjectId' });

// App-wide date format: dd-mm-yyyy (e.g. 25-12-2026).
export const dateRegex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
export const dateString = z.string().regex(dateRegex, 'Date must be in dd-mm-yyyy format');

// Accepts either a numeric string or a JS number; emits a positive number.
export const moneyAmount = z.union([z.string(), z.number()]).transform((v, ctx) => {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (Number.isNaN(n) || n <= 0) {
    ctx.addIssue({ code: 'custom', message: 'Must be a positive number' });
    return z.NEVER;
  }
  return n;
});

// One product inside an Expense document.
export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  price: z.number().positive('Price must be greater than 0'),
  category: z.enum(EXPENSE_CATEGORIES),
  label: z.any().optional().nullable(),
});
