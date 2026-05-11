import { z } from 'zod';
import { objectIdSchema } from './common.js';

export const sessionIdParamSchema = z.object({
  sessionId: objectIdSchema,
});
