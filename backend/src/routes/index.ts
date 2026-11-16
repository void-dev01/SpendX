import { Router } from 'express';
import healthRoutes from './health.routes.js';
import transactionRoutes from './transaction.routes.js';
import budgetRoutes from './budget.routes.js';
import savingsRoutes from './savings.routes.js';
import analyticsRoutes from './analytics.routes.js';
import importRoutes from './import.routes.js';
import aiRoutes from './ai.routes.js';
import notificationRoutes from './notification.routes.js';
import storageRoutes from './storage.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/savings', savingsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/import', importRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);
router.use('/storage', storageRoutes);

export default router;
