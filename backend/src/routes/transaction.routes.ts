import { Router } from 'express';
import { createTransaction } from '../controllers/transaction.controller.js';

const router = Router();

// In production, requireAuth middleware verifies token
router.post('/', createTransaction);

export default router;
