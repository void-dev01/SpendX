import { Router } from 'express';
import {
  getRecurring,
  getRecurringById,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  detectPatterns,
} from '../controllers/recurring.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getRecurring);
router.post('/', requireAuth, createRecurring);
router.post('/detect-patterns', requireAuth, detectPatterns);
router.get('/:id', requireAuth, getRecurringById);
router.patch('/:id', requireAuth, updateRecurring);
router.delete('/:id', requireAuth, deleteRecurring);

export default router;
