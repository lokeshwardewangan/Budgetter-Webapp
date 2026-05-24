import { z } from 'zod';

export const monthlyReportQuerySchema = z.object({
  month: z.string().regex(/^(0[1-9]|1[0-2])$/, 'month must be MM (01-12)'),
  year: z.string().regex(/^\d{4}$/, 'year must be YYYY'),
});
