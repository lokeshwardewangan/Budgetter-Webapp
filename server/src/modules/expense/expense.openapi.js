import { z } from 'zod';
import { registry, apiResponse, bearerAuth } from '../../shared/openapi/init.js';
import {
  addTodaySchema,
  addBulkSchema,
  dateQuerySchema,
  feedQuerySchema,
  productIdParamSchema,
  updateExpenseBodySchema,
  deleteExpenseBodySchema,
} from './expense.validator.js';

const expense = z.object({
  _id: z.string(),
  user: z.string(),
  date: z.string().openapi({ format: 'date-time' }),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  label: z.string().nullable(),
  createdAt: z.string().openapi({ format: 'date-time' }),
  updatedAt: z.string().openapi({ format: 'date-time' }),
});

const tag = 'Expenses';

registry.registerPath({
  method: 'post',
  path: '/expenses',
  tags: [tag],
  summary: "Add one or more expenses for today",
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: addTodaySchema } } } },
  responses: {
    201: {
      description: 'Expenses recorded',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              expenses: z.array(expense),
              currentPocketMoney: z.number(),
              totalDeducted: z.number(),
            }),
            201,
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/expenses/bulk',
  tags: [tag],
  summary: 'Add expenses for one or more past days',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: addBulkSchema } } } },
  responses: {
    201: {
      description: 'Expenses recorded',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              expenses: z.array(expense),
              currentPocketMoney: z.number(),
              totalDeducted: z.number(),
            }),
            201,
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/expenses/today',
  tags: [tag],
  summary: "List today's expenses",
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "Today's expenses",
      content: { 'application/json': { schema: apiResponse(z.array(expense)) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/expenses/by-date',
  tags: [tag],
  summary: 'List expenses for a specific date',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: dateQuerySchema },
  responses: {
    200: {
      description: 'Expenses for that date',
      content: { 'application/json': { schema: apiResponse(z.array(expense)) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/expenses',
  tags: [tag],
  summary: 'List all expenses for the current user',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'All expenses',
      content: { 'application/json': { schema: apiResponse(z.array(expense)) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/expenses/feed',
  tags: [tag],
  summary: 'Paginated/filterable expense feed',
  security: [{ [bearerAuth.name]: [] }],
  request: { query: feedQuerySchema },
  responses: {
    200: {
      description: 'Feed page',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              items: z.array(expense),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              hasMore: z.boolean(),
            }),
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/expenses/products/{productId}',
  tags: [tag],
  summary: 'Update a single expense product',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: productIdParamSchema,
    body: { content: { 'application/json': { schema: updateExpenseBodySchema } } },
  },
  responses: {
    200: {
      description: 'Expense updated',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              expense,
              currentPocketMoney: z.number(),
            }),
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    404: { description: 'Expense not found' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/expenses/products/{productId}',
  tags: [tag],
  summary: 'Delete a single expense product (optionally refund to pocket money)',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: productIdParamSchema,
    body: { content: { 'application/json': { schema: deleteExpenseBodySchema } } },
  },
  responses: {
    200: {
      description: 'Expense removed',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              currentPocketMoney: z.number().optional(),
              refunded: z.boolean(),
            }),
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    404: { description: 'Expense not found' },
  },
});
