import { z } from 'zod';

export const newsletterSchema = z.object({
  emails: z
    .array(z.string().email('Invalid email format'))
    .min(1, 'emails must be a non-empty array'),
  subject: z
    .string()
    .trim()
    .min(1, 'subject is required')
    .max(50, 'subject cannot exceed 50 characters'),
  html: z
    .string()
    .min(1, 'html is required')
    .refine(
      (h) => {
        const lower = h.toLowerCase().trim();
        return lower.includes('<!doctype html>') || lower.startsWith('<html');
      },
      { message: 'html must start with <!doctype html> or <html>' },
    ),
});
