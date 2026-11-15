import { Router } from 'express';
import { getInsights, askCoach, getAIStatus } from '../controllers/ai.controller.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(aiRateLimiter);
router.get('/status', getAIStatus);
router.get('/insights', requireAuth, getInsights);
router.post('/coach', requireAuth, askCoach);

export default router;
