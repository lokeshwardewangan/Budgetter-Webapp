import { Router } from 'express';
import * as sessionController from '../controllers/session.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/', sessionController.list);
router.delete('/', sessionController.removeOthers);
router.delete('/:sessionId', sessionController.remove);

export default router;
