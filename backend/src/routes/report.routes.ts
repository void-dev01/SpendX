import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getTaxSummary, exportCSV } from '../controllers/report.controller.js';

const router = Router();

router.get('/tax-summary', requireAuth, getTaxSummary);
router.get('/export-csv', requireAuth, exportCSV);

export default router;
