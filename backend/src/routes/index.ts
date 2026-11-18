import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import accountRoutes from './account.routes.js';
import transactionRoutes from './transaction.routes.js';
import budgetRoutes from './budget.routes.js';
import savingsRoutes from './savings.routes.js';
import recurringRoutes from './recurring.routes.js';
import analyticsRoutes from './analytics.routes.js';
import reportRoutes from './report.routes.js';
import importRoutes from './import.routes.js';
import aiRoutes from './ai.routes.js';
import notificationRoutes from './notification.routes.js';
import storageRoutes from './storage.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/savings', savingsRoutes);
router.use('/recurring', recurringRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/import', importRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/storage', storageRoutes);

export default router;
