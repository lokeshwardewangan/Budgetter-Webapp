import { Router } from 'express';
import * as adminController from './admin.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { requireAdmin } from '../../shared/middleware/role.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { newsletterSchema } from './admin.validator.js';

const router = Router();

router.use(verifyJwtToken, requireAdmin);

router.get('/users', adminController.listUsers);
router.post('/newsletter', validate(newsletterSchema), adminController.newsletter);

export default router;
