import { z } from 'zod';

const dateRegex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

// `amount` accepts both string (from a number input) and number; emits a
// positive number. Mirrors the server's `moneyAmount` Zod primitive.
const moneyAmount = z
  .union([z.string(), z.number()])
  .transform((v, ctx) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (Number.isNaN(n) || n <= 0) {
      ctx.addIssue({ code: 'custom', message: 'Must be a positive number' });
      return z.NEVER;
    }
    return n;
  });

export const addPocketMoneySchema = z.object({
  date: z.string().regex(dateRegex, 'Date must be in dd-mm-yyyy format'),
  amount: moneyAmount,
  source: z.string().trim().min(1, 'Source is required'),
});

export type AddPocketMoneyForm = z.input<typeof addPocketMoneySchema>;
export type AddPocketMoneyParsed = z.output<typeof addPocketMoneySchema>;
