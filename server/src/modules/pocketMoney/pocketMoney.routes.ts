import { Router } from 'express';
import * as pocketMoneyController from './pocketMoney.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { addPocketMoneySchema } from './pocketMoney.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(addPocketMoneySchema), pocketMoneyController.create);
router.get('/', pocketMoneyController.list);

export default router;
