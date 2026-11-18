import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { commitBatch, getCaptureHistory } from '../controllers/import.controller.js';

const router = Router();

router.post('/batch', requireAuth, commitBatch);
router.get('/history', requireAuth, getCaptureHistory);

export default router;
