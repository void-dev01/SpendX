import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  transferFunds,
} from '../controllers/account.controller.js';

const router = Router();

router.get('/', requireAuth, getAccounts);
router.post('/', requireAuth, createAccount);
router.post('/transfer', requireAuth, transferFunds);
router.get('/:id', requireAuth, getAccountById);
router.put('/:id', requireAuth, updateAccount);
router.delete('/:id', requireAuth, deleteAccount);

export default router;
