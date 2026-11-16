import { Router } from 'express';
import {
  getMonthlyStatement,
  getTaxSummary,
  exportCsv,
} from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/monthly-statement', requireAuth, getMonthlyStatement);
router.get('/tax-summary', requireAuth, getTaxSummary);
router.get('/export-csv', requireAuth, exportCsv);

export default router;
