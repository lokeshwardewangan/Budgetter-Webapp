import { z } from 'zod';

export const aiChatSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty'),
  threadId: z.string().optional(),
  stream: z.boolean().optional().default(false),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
