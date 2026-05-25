import { Router } from 'express';
import * as sessionController from './session.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { sessionIdParamSchema } from './session.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/', sessionController.list);
router.delete('/', sessionController.removeOthers);
router.delete('/:sessionId', validate(sessionIdParamSchema, 'params'), sessionController.remove);

export default router;
