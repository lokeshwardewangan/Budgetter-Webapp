import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', expenseController.addToday);
router.post('/bulk', expenseController.addBulk);
router.get('/today', expenseController.getToday);
router.get('/by-date', expenseController.getByDate); // ?date=DD-MM-YYYY
router.get('/', expenseController.getAll);
router.patch('/:expenseId/products/:productId', expenseController.update);
router.delete('/:expenseId/products/:productId', expenseController.remove);

export default router;
