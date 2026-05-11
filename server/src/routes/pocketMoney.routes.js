import { Router } from 'express';
import * as pocketMoneyController from '../controllers/pocketMoney.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { addPocketMoneySchema } from '../validators/pocketMoney.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(addPocketMoneySchema), pocketMoneyController.create);
router.get('/', pocketMoneyController.list);

export default router;
