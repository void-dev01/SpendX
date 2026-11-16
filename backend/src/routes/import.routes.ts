import { Router } from 'express';
import {
  validateBatch,
  commitBatch,
  getImportHistory,
} from '../controllers/import.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/validate', requireAuth, validateBatch);
router.post('/commit', requireAuth, commitBatch);
router.get('/history', requireAuth, getImportHistory);

export default router;
