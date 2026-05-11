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

export const expenseProductParamSchema = z.object({
  expenseId: objectIdSchema,
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
