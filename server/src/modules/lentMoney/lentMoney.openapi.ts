import { z } from 'zod';
import { registry, apiResponse, bearerAuth } from '../../shared/openapi/init.js';
import { addLentMoneySchema, lentMoneyIdParamSchema } from './lentMoney.validator.js';

const lentMoneyEntry = z.object({
  _id: z.string(),
  user: z.string(),
  personName: z.string(),
  price: z.number(),
  date: z.string().openapi({ format: 'date-time' }),
  receivedAt: z.string().openapi({ format: 'date-time' }).nullable(),
  createdAt: z.string().openapi({ format: 'date-time' }),
  updatedAt: z.string().openapi({ format: 'date-time' }),
});

const tag = 'Lent Money';

registry.registerPath({
  method: 'post',
  path: '/lent-money',
  tags: [tag],
  summary: 'Record money lent to someone',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: addLentMoneySchema } } } },
  responses: {
    201: {
      description: 'Lent-money entry created',
      content: { 'application/json': { schema: apiResponse(lentMoneyEntry, 201) } },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/lent-money',
  tags: [tag],
  summary: 'List lent-money entries',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Lent-money entries',
      content: { 'application/json': { schema: apiResponse(z.array(lentMoneyEntry)) } },
    },
    401: { description: 'Unauthorized' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/lent-money/{id}/receive',
  tags: [tag],
  summary: 'Mark a lent-money entry as received back',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: lentMoneyIdParamSchema },
  responses: {
    200: {
      description: 'Entry marked as received',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              entry: lentMoneyEntry,
              currentPocketMoney: z.number(),
            }),
          ),
        },
      },
    },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    404: { description: 'Entry not found' },
  },
});
