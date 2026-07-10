import { Router } from 'express';
import * as aiController from './ai.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { aiChatSchema } from './ai.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/chat', validate(aiChatSchema), aiController.chat);

export default router;
