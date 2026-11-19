import { Router } from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  checkBudgetThresholds,
} from '../controllers/budget.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getBudgets);
router.post('/', requireAuth, createBudget);
router.post('/check-thresholds', requireAuth, checkBudgetThresholds);
router.patch('/:id', requireAuth, updateBudget);
router.put('/:id', requireAuth, updateBudget);
router.delete('/:id', requireAuth, deleteBudget);

export default router;
