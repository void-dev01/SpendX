import { Router } from 'express';
import { createTransaction } from '../controllers/transaction.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, createTransaction);

export default router;
