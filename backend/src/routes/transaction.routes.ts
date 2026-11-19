import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  batchImportTransactions,
} from '../controllers/transaction.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getTransactions);
router.post('/', requireAuth, createTransaction);
router.post('/batch', requireAuth, batchImportTransactions);
router.get('/:id', requireAuth, getTransactionById);
router.patch('/:id', requireAuth, updateTransaction);
router.put('/:id', requireAuth, updateTransaction);
router.delete('/:id', requireAuth, deleteTransaction);

export default router;
