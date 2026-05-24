import { z } from 'zod';
import { objectIdSchema, dateInput, moneyAmount } from '../../shared/lib/validators.js';

export const addLentMoneySchema = z.object({
  personName: z.string().trim().min(1, 'personName is required'),
  price: moneyAmount,
  date: dateInput,
});

export const lentMoneyIdParamSchema = z.object({
  id: objectIdSchema,
});
