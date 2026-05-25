import { z } from 'zod';
import { registry, apiResponse, bearerAuth } from '../../shared/openapi/init.js';
import { addPocketMoneySchema } from './pocketMoney.validator.js';

const pocketMoneyEntry = z.object({
  _id: z.string(),
  user: z.string(),
  date: z.string().openapi({ format: 'date-time' }),
  amount: z.number(),
  source: z.string(),
  createdAt: z.string().openapi({ format: 'date-time' }),
  updatedAt: z.string().openapi({ format: 'date-time' }),
});

const tag = 'Pocket Money';

registry.registerPath({
  method: 'post',
  path: '/pocket-money',
  tags: [tag],
  summary: 'Add a pocket-money entry',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: addPocketMoneySchema } } } },
  responses: {
    201: {
      description: 'Entry created',
      content: {
        'application/json': {
          schema: apiResponse(
            z.object({
              entry: pocketMoneyEntry,
              currentPocketMoney: z.number(),
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
  path: '/pocket-money',
  tags: [tag],
  summary: 'List pocket-money entries',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Pocket-money entries',
      content: { 'application/json': { schema: apiResponse(z.array(pocketMoneyEntry)) } },
    },
    401: { description: 'Unauthorized' },
  },
});
