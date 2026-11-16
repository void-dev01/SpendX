import { Router } from 'express';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  recordContribution,
} from '../controllers/savings.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getSavingsGoals);
router.post('/', requireAuth, createSavingsGoal);
router.patch('/:id', requireAuth, updateSavingsGoal);
router.delete('/:id', requireAuth, deleteSavingsGoal);
router.post('/:id/contributions', requireAuth, recordContribution);

export default router;
