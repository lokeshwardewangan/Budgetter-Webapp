import { z } from 'zod';
import { registry, apiResponse, bearerAuth } from '../../shared/openapi/init.js';
import { monthlyReportQuerySchema } from './report.validator.js';

const monthlyReport = z.object({
  totalExpenses: z.number(),
  totalAddedMoney: z.number(),
  totalLentMoney: z.number(),
  lastTotalExpenses: z.number(),
  categoryWiseExpensesData: z.object({
    GroceriesExpenses: z.number(),
    Housing_UtilitiesExpenses: z.number(),
    MedicalExpenses: z.number(),
    FoodExpenses: z.number(),
    PersonalExpenses: z.number(),
    EducationalExpenses: z.number(),
    TransportationExpenses: z.number(),
    MiscellaneousExpenses: z.number(),
  }),
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
