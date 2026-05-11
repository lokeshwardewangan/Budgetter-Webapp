import { Router } from 'express';
import * as pocketMoneyController from '../controllers/pocketMoney.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', pocketMoneyController.create);
router.get('/', pocketMoneyController.list);

export default router;
