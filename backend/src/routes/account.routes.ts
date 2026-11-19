import { Router } from 'express';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  transferFunds,
} from '../controllers/account.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getAccounts);
router.post('/', requireAuth, createAccount);
router.post('/transfer', requireAuth, transferFunds);
router.get('/:id', requireAuth, getAccountById);
router.patch('/:id', requireAuth, updateAccount);
router.put('/:id', requireAuth, updateAccount);
router.delete('/:id', requireAuth, deleteAccount);

export default router;
