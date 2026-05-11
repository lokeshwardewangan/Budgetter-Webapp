import { z } from 'zod';
import { objectIdSchema, dateString, moneyAmount } from './common.js';

export const addLentMoneySchema = z.object({
  personName: z.string().trim().min(1, 'personName is required'),
  price: moneyAmount,
  date: dateString,
});

export const lentMoneyIdParamSchema = z.object({
  id: objectIdSchema,
});
