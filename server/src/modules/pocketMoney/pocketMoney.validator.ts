import { z } from 'zod';
import { dateInput, moneyAmount } from '../../shared/lib/validators.js';

export const addPocketMoneySchema = z.object({
  date: dateInput,
  amount: moneyAmount,
  source: z.string().trim().min(1, 'source is required'),
});

export type AddPocketMoneyInput = z.infer<typeof addPocketMoneySchema>;
