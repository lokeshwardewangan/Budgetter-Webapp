import { Router } from 'express';
import * as lentMoneyController from '../controllers/lentMoney.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { addLentMoneySchema, lentMoneyIdParamSchema } from '../validators/lentMoney.validator.js';

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
