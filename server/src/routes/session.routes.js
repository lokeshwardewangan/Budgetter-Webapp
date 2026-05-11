import { Router } from 'express';
import * as sessionController from '../controllers/session.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { sessionIdParamSchema } from '../validators/session.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/', sessionController.list);
router.delete('/', sessionController.removeOthers);
router.delete('/:sessionId', validate(sessionIdParamSchema, 'params'), sessionController.remove);

export default router;
