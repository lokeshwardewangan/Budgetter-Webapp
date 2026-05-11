import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  addTodaySchema,
  addBulkSchema,
  dateQuerySchema,
  feedQuerySchema,
  productIdParamSchema,
  updateExpenseBodySchema,
  deleteExpenseBodySchema,
} from '../validators/expense.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(addTodaySchema), expenseController.addToday);
router.post('/bulk', validate(addBulkSchema), expenseController.addBulk);
router.get('/today', expenseController.getToday);
router.get('/by-date', validate(dateQuerySchema, 'query'), expenseController.getByDate);
router.get('/feed', validate(feedQuerySchema, 'query'), expenseController.feed);
router.get('/', expenseController.getAll);
// Flat product-only routes: parent expense doc is located server-side by
// (user, actualDate) inside the service. Keeps client call-sites simple
// since the dialogs already know the product _id but not the parent doc _id.
router.patch(
  '/products/:productId',
  validate(productIdParamSchema, 'params'),
  validate(updateExpenseBodySchema),
  expenseController.update,
);
router.delete(
  '/products/:productId',
  validate(productIdParamSchema, 'params'),
  validate(deleteExpenseBodySchema),
  expenseController.remove,
);

export default router;
