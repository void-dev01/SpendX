import { Router } from 'express';
import healthRoutes from './health.routes.js';
import transactionRoutes from './transaction.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/transactions', transactionRoutes);
router.use('/ai', aiRoutes);

export default router;
