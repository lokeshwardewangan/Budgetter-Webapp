import { z } from 'zod';
import { objectIdSchema, dateInput, productSchema } from '../../shared/lib/validators.js';
import { EXPENSE_CATEGORIES } from './expense.model.js';

export const addTodaySchema = z.object({
  productsArray: z.array(productSchema).min(1, 'productsArray must have at least 1 product'),
});

export const addBulkSchema = z.object({
  pastDaysExpensesArray: z
    .array(
      z.object({
        date: dateInput,
        productsArray: z.array(productSchema).min(1),
      }),
    )
    .min(1, 'pastDaysExpensesArray must have at least 1 day'),
});

export const dateQuerySchema = z.object({
  date: dateInput,
});

export const feedQuerySchema = z.object({
  page: z.coerce.number().int().nonnegative().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  month: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/)
    .optional(),
  year: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  search: z.string().max(80).optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
});

export const productIdParamSchema = z.object({
  productId: objectIdSchema,
});

export const updateExpenseBodySchema = z.object({
  expenseName: z.string().trim().min(1, 'expenseName is required'),
  selectedLabel: z.any().optional().nullable(),
  expensePrice: z.number().positive('expensePrice must be greater than 0'),
  expenseCategory: z.enum(EXPENSE_CATEGORIES),
  expenseDate: dateInput.optional(),
});

export const deleteExpenseBodySchema = z.object({
  isAddPriceToPocketMoney: z.boolean().optional().default(false),
});

export type AddTodayInput = z.infer<typeof addTodaySchema>;
export type AddBulkInput = z.infer<typeof addBulkSchema>;
export type FeedQuery = z.infer<typeof feedQuerySchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseBodySchema>;
export type DeleteExpenseInput = z.infer<typeof deleteExpenseBodySchema>;
