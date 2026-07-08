import { z } from 'zod';
import { registry, apiResponse, bearerAuth } from '../../shared/openapi/init.js';
import { monthlyReportQuerySchema } from './report.validator.js';

import { EXPENSE_CATEGORIES } from '../expense/expense.model.js';
import { getCategoryKey } from './report.service.js';

const categoryWiseSchemaShape = Object.fromEntries(
  EXPENSE_CATEGORIES.map((cat) => [getCategoryKey(cat), z.number()]),
);

const monthlyReport = z.object({
  totalExpenses: z.number(),
  totalAddedMoney: z.number(),
  totalLentMoney: z.number(),
  lastTotalExpenses: z.number(),
  prevMonthExpenses: z.number(),
  categoryWiseExpensesData: z.object(categoryWiseSchemaShape),
  totalDays: z.number(),
  elapsedDays: z.number(),
  remainingDays: z.number(),
  weekendExpenses: z.number(),
  weekdayExpenses: z.number(),
  highestSpendDay: z
    .object({
      day: z.number(),
      amount: z.number(),
    })
    .nullable(),
});

const tag = 'Reports';

registry.registerPath({
  method: 'get',
  path: '/reports/monthly',
  tags: [tag],
  summary: 'Monthly expense + income + lent-money report for the current user',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: monthlyReportQuerySchema },
  responses: {
    200: {
      description: 'Monthly report',
      content: { 'application/json': { schema: apiResponse(monthlyReport) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});
