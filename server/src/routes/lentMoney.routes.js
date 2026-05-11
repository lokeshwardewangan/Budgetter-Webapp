import { Router } from 'express';
import * as lentMoneyController from '../controllers/lentMoney.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', lentMoneyController.create);
router.get('/', lentMoneyController.list);
router.patch('/:id/receive', lentMoneyController.receive);

export default router;
