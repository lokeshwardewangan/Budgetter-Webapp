import { Router } from 'express';
import * as adminController from './admin.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { newsletterSchema } from './admin.validator.js';

const router = Router();

// NOTE: these endpoints are intended for admins. There is no admin role on
// User yet, so for now they're protected by JWT only. Add a role-check
// middleware here once the User model gains a `role` field.
router.use(verifyJwtToken);

router.get('/users', adminController.listUsers);
router.post('/newsletter', validate(newsletterSchema), adminController.newsletter);

export default router;
