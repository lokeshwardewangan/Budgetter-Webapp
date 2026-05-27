import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import sessionRoutes from './modules/session/session.routes.js';
import expenseRoutes from './modules/expense/expense.routes.js';
import pocketMoneyRoutes from './modules/pocketMoney/pocketMoney.routes.js';
import lentMoneyRoutes from './modules/lentMoney/lentMoney.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

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
