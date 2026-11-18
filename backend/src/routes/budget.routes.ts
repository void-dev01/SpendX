import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';

const router = Router();

router.get('/', requireAuth, getBudgets);
router.post('/', requireAuth, createBudget);
router.put('/:id', requireAuth, updateBudget);
router.delete('/:id', requireAuth, deleteBudget);

export default router;
