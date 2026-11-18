import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';
import { validateCreateTransaction } from '../validators/transaction.validator.js';

const router = Router();

router.get('/', requireAuth, getTransactions);
router.post('/', requireAuth, validateCreateTransaction, createTransaction);
router.get('/:id', requireAuth, getTransactionById);
router.put('/:id', requireAuth, updateTransaction);
router.delete('/:id', requireAuth, deleteTransaction);

export default router;
