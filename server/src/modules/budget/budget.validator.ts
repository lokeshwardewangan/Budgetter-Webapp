import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../expense/expense.model.js';
import { objectIdSchema } from '../../shared/lib/validators.js';

const budgetCategoryEnum = z.enum(['Overall', ...EXPENSE_CATEGORIES]);

export const createBudgetSchema = z.object({
  category: budgetCategoryEnum,
  limit: z.number().nonnegative('Limit must be greater than or equal to 0'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
});

export const updateBudgetSchema = z.object({
  limit: z.number().nonnegative('Limit must be greater than or equal to 0'),
});

export const budgetIdParamSchema = z.object({
  budgetId: objectIdSchema,
});

export const budgetQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type BudgetQueryInput = z.infer<typeof budgetQuerySchema>;
