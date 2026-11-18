import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { ReportService } from '../services/report.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getTaxSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const period = (req.query.period as any) || 'this_year';
    const data = await ReportService.getTaxDeductionSummary(userId, period);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const period = (req.query.period as any) || 'this_month';
    const csvContent = await ReportService.exportTransactionsCSV(userId, period);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=spendx_transactions_${period}.csv`);
    res.send(csvContent);
  } catch (err) {
    next(err);
  }
};
