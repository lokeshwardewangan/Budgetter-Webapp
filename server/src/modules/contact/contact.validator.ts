import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  message: z.string().trim().min(1, 'Message is required'),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
