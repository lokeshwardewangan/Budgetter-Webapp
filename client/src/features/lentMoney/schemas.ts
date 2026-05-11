import { z } from 'zod';

const dateRegex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

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

export const addLentMoneySchema = z.object({
  personName: z.string().trim().min(1, 'Person name is required'),
  price: moneyAmount,
  date: z.string().regex(dateRegex, 'Date must be in dd-mm-yyyy format'),
});

export type AddLentMoneyForm = z.input<typeof addLentMoneySchema>;
export type AddLentMoneyParsed = z.output<typeof addLentMoneySchema>;
