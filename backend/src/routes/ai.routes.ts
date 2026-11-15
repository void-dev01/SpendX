import { Router } from 'express';
import { getInsights, askCoach, getAIStatus } from '../controllers/ai.controller.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(aiRateLimiter);
router.get('/status', getAIStatus);
router.get('/insights', getInsights);
router.post('/coach', askCoach);

export default router;
