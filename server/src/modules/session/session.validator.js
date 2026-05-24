import { z } from 'zod';
import { objectIdSchema } from '../../shared/lib/validators.js';

export const sessionIdParamSchema = z.object({
  sessionId: objectIdSchema,
});
