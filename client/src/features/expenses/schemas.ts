import { z } from 'zod';
import { expensesCategories } from '@/utils/ui/utility';

const dateRegex = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

// `price` accepts string or number, emits a positive number.
const positiveAmount = z
  .union([z.string(), z.number()])
  .transform((v, ctx) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    if (Number.isNaN(n) || n <= 0) {
      ctx.addIssue({ code: 'custom', message: 'Price must be greater than 0' });
      return z.NEVER;
    }
    return n;
  });

const categoryEnum = z.enum(expensesCategories as [string, ...string[]]);

// react-select option (or null) for the optional label field.
const labelOption = z
  .object({ value: z.string(), label: z.string() })
  .nullable()
  .optional();

export const addExpenseFormSchema = z.object({
  inputDate: z.date(),
  expenseName: z.string().trim().min(1, 'Expense name is required'),
  expenseCategory: categoryEnum,
  price: positiveAmount,
  selectedLabel: labelOption,
});

export const editExpenseFormSchema = z.object({
  expenseDate: z.string().regex(dateRegex, 'Date must be in dd-mm-yyyy format'),
  expenseName: z.string().trim().min(1, 'Expense name is required'),
  expenseCategory: categoryEnum,
  expensePrice: positiveAmount,
  selectedLabel: labelOption,
});

export type AddExpenseFormInput = z.input<typeof addExpenseFormSchema>;
export type AddExpenseFormParsed = z.output<typeof addExpenseFormSchema>;
export type EditExpenseFormInput = z.input<typeof editExpenseFormSchema>;
export type EditExpenseFormParsed = z.output<typeof editExpenseFormSchema>;
