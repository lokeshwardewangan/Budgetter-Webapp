import { Router } from 'express';
import * as lentMoneyController from './lentMoney.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { addLentMoneySchema, lentMoneyIdParamSchema } from './lentMoney.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(addLentMoneySchema), lentMoneyController.create);
router.get('/', lentMoneyController.list);
router.patch(
  '/:id/receive',
  validate(lentMoneyIdParamSchema, 'params'),
  lentMoneyController.receive,
);

export default router;
