import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getRecurringPayments,
  getById,
  create,
  update,
  updateStatus,
  remove,
} from '../controllers/recurring.controller.js';

const router = Router();

router.get('/', requireAuth, getRecurringPayments);
router.post('/', requireAuth, create);
router.get('/:id', requireAuth, getById);
router.put('/:id', requireAuth, update);
router.patch('/:id/status', requireAuth, updateStatus);
router.delete('/:id', requireAuth, remove);

export default router;
