import { Router } from 'express';
import {
  getFinancialSummary,
  getHealthScore,
  getBurnRate,
} from '../controllers/analytics.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/summary', requireAuth, getFinancialSummary);
router.get('/health-score', requireAuth, getHealthScore);
router.get('/burn-rate', requireAuth, getBurnRate);

export default router;
