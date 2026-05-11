import { z } from 'zod';
import { dateString, moneyAmount } from './common.js';

export const addPocketMoneySchema = z.object({
  date: dateString,
  amount: moneyAmount,
  source: z.string().trim().min(1, 'source is required'),
});
