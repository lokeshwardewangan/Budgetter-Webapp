import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../../expense/expense.model.js';
import * as budgetService from '../../budget/budget.service.js';

export function getBudgetTools(userId: string) {
  const getBudgetStatus = tool(
    async ({ month, year, category }) => {
      try {
        const result = await budgetService.getBudgetStatus(userId, month, year);

        if (category) {
          if (category === 'Overall') {
            return JSON.stringify(result.overall);
          }
          const item = result.categories.find((c) => c.category === category);
          if (!item) {
            return `No budget set for category "${category}" in ${month}/${year}.`;
          }
          return JSON.stringify(item);
        }

        return JSON.stringify(result);
      } catch (err: any) {
        return `Error calculating budget status: ${err.message || err}`;
      }
    },
    {
      name: 'get_budget_status',
      description:
        'Get status of budgets for a specific month and year, including spending, remaining amounts, pacing status, and overrun alerts.',
      schema: z.object({
        month: z.number().int().min(1).max(12).describe('Month (1-12).'),
        year: z.number().int().min(2000).describe('Year (4-digit, e.g., 2026).'),
        category: z
          .enum(['Overall', ...EXPENSE_CATEGORIES])
          .optional()
          .describe('Optional category filter.'),
      }),
    },
  );

  const createBudget = tool(
    async ({ category, limit, month, year }) => {
      try {
        const result = await budgetService.upsertBudget(userId, {
          category,
          limit,
          month,
          year,
        });
        return `Successfully set budget for category "${category}" to ₹${limit} for ${month}/${year}. Record: ${JSON.stringify(result)}`;
      } catch (err: any) {
        return `Error setting budget: ${err.message || err}`;
      }
    },
    {
      name: 'create_budget',
      description:
        'Create or update a budget limit for a category or Overall for a given month and year.',
      schema: z.object({
        category: z
          .enum(['Overall', ...EXPENSE_CATEGORIES])
          .describe('Category name or "Overall".'),
        limit: z.number().nonnegative().describe('Budget limit in INR.'),
        month: z.number().int().min(1).max(12).describe('Month (1-12).'),
        year: z.number().int().min(2000).describe('Year (4-digit, e.g., 2026).'),
      }),
    },
  );

  const updateBudget = tool(
    async ({ category, limit, month, year }) => {
      try {
        const result = await budgetService.upsertBudget(userId, {
          category,
          limit,
          month,
          year,
        });
        return `Successfully updated budget for category "${category}" to ₹${limit} for ${month}/${year}. Record: ${JSON.stringify(result)}`;
      } catch (err: any) {
        return `Error updating budget: ${err.message || err}`;
      }
    },
    {
      name: 'update_budget',
      description:
        'Update the limit of an existing budget. Reuses the create/upsert budget logic under the hood.',
      schema: z.object({
        category: z
          .enum(['Overall', ...EXPENSE_CATEGORIES])
          .describe('Category name or "Overall".'),
        limit: z.number().nonnegative().describe('New budget limit in INR.'),
        month: z.number().int().min(1).max(12).describe('Month (1-12).'),
        year: z.number().int().min(2000).describe('Year (4-digit, e.g., 2026).'),
      }),
    },
  );

  return [getBudgetStatus, createBudget, updateBudget];
}
