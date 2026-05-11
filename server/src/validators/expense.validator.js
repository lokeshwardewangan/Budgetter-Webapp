import { z } from 'zod';
import { objectIdSchema, dateString, productSchema } from './common.js';
import { EXPENSE_CATEGORIES } from '../models/expenses.model.js';

export const addTodaySchema = z.object({
  productsArray: z.array(productSchema).min(1, 'productsArray must have at least 1 product'),
});

export const addBulkSchema = z.object({
  pastDaysExpensesArray: z
    .array(
      z.object({
        date: dateString,
        productsArray: z.array(productSchema).min(1),
      }),
    )
    .min(1, 'pastDaysExpensesArray must have at least 1 day'),
});

export const dateQuerySchema = z.object({
  date: dateString,
});

// Coerce `page` and `limit` from query strings; the controller clamps `limit`
// to [1, 100] separately.
export const feedQuerySchema = z.object({
  page: z.coerce.number().int().nonnegative().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  month: z.string().regex(/^(0[1-9]|1[0-2])$/).optional(),
  year: z.string().regex(/^\d{4}$/).optional(),
  search: z.string().max(80).optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
});

export const productIdParamSchema = z.object({
  productId: objectIdSchema,
});

export const updateExpenseBodySchema = z.object({
  actualDate: dateString,
  expenseName: z.string().trim().min(1, 'expenseName is required'),
  selectedLabel: z.any().optional().nullable(),
  expensePrice: z.number().positive('expensePrice must be greater than 0'),
  expenseCategory: z.enum(EXPENSE_CATEGORIES),
  expenseDate: dateString,
});

export const deleteExpenseBodySchema = z.object({
  expenseDate: dateString,
  isAddPriceToPocketMoney: z.boolean().optional().default(false),
});
