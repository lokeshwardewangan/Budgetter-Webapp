import { Router } from 'express';
import * as reportController from './report.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { monthlyReportQuerySchema } from './report.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/monthly', validate(monthlyReportQuerySchema, 'query'), reportController.monthly);

export default router;
