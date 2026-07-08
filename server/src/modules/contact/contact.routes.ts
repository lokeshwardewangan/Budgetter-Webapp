import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { createContactSchema } from './contact.validator.js';

const router = Router();

router.post('/', validate(createContactSchema), contactController.create);

export default router;
