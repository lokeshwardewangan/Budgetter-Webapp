import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import sessionRoutes from './session.routes.js';
import expenseRoutes from './expense.routes.js';
import pocketMoneyRoutes from './pocketMoney.routes.js';
import lentMoneyRoutes from './lentMoney.routes.js';
import reportRoutes from './report.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
router.use('/expenses', expenseRoutes);
router.use('/pocket-money', pocketMoneyRoutes);
router.use('/lent-money', lentMoneyRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;
