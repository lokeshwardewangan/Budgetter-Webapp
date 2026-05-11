import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { monthlyReportQuerySchema } from '../validators/report.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/monthly', validate(monthlyReportQuerySchema, 'query'), reportController.monthly);

export default router;
