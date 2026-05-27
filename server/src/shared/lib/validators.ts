import { z } from 'zod';
import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '../../modules/expense/expense.model.js';

export const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: 'Invalid ObjectId' });

// Accepts a Date, dd-mm-yyyy string, or ISO date string; emits a Date.
// dd-mm-yyyy is the legacy client format — kept until the SPA migrates.
export const dateInput = z.union([z.date(), z.string()]).transform((v, ctx) => {
  if (v instanceof Date) return v;
  const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/.exec(v);
  if (m) {
    const [, dd, mm, yyyy] = m;
    return new Date(Date.UTC(+yyyy, +mm - 1, +dd));
  }
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d;
  ctx.addIssue({ code: 'custom', message: 'Invalid date (expected dd-mm-yyyy or ISO)' });
  return z.NEVER;
});

export const moneyAmount = z.coerce.number().positive('Must be a positive number');

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  price: z.number().positive('Price must be greater than 0'),
  category: z.enum(EXPENSE_CATEGORIES),
  label: z.any().optional().nullable(),
});
