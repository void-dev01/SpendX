import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  addContribution,
  getContributions,
} from '../controllers/savings.controller.js';

const router = Router();

router.get('/', requireAuth, getGoals);
router.post('/', requireAuth, createGoal);
router.get('/contributions', requireAuth, getContributions);
router.get('/:id', requireAuth, getGoalById);
router.put('/:id', requireAuth, updateGoal);
router.delete('/:id', requireAuth, deleteGoal);
router.post('/:id/contributions', requireAuth, addContribution);

export default router;
