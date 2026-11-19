import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { getMe, updateMe, deleteMe } from '../controllers/auth.controller.js';

const router = Router();

router.use(authRateLimiter);

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateMe);
router.delete('/me', requireAuth, deleteMe);

export default router;
