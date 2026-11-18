import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDashboardMetrics } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/metrics', requireAuth, getDashboardMetrics);

export default router;
