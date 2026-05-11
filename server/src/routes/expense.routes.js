import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addTodaySchema,
  addBulkSchema,
  dateQuerySchema,
  expenseProductParamSchema,
  updateExpenseBodySchema,
  deleteExpenseBodySchema,
} from '../validators/expense.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(addTodaySchema), expenseController.addToday);
router.post('/bulk', validate(addBulkSchema), expenseController.addBulk);
router.get('/today', expenseController.getToday);
router.get('/by-date', validate(dateQuerySchema, 'query'), expenseController.getByDate);
router.get('/', expenseController.getAll);
router.patch(
  '/:expenseId/products/:productId',
  validate(expenseProductParamSchema, 'params'),
  validate(updateExpenseBodySchema),
  expenseController.update,
);
router.delete(
  '/:expenseId/products/:productId',
  validate(expenseProductParamSchema, 'params'),
  validate(deleteExpenseBodySchema),
  expenseController.remove,
);

export default router;
