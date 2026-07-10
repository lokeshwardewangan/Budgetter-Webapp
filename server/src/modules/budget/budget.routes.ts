import { Router } from 'express';
import * as budgetController from './budget.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdParamSchema,
  budgetQuerySchema,
} from './budget.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.post('/', validate(createBudgetSchema), budgetController.create);
router.get('/', validate(budgetQuerySchema, 'query'), budgetController.list);
router.get('/status', validate(budgetQuerySchema, 'query'), budgetController.status);
router.patch(
  '/:budgetId',
  validate(budgetIdParamSchema, 'params'),
  validate(updateBudgetSchema),
  budgetController.update,
);
router.delete('/:budgetId', validate(budgetIdParamSchema, 'params'), budgetController.remove);

export default router;
