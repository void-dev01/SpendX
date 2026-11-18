import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/index.js';
import {
  monthlyStatementQuerySchema,
  taxSummaryQuerySchema,
  exportCsvQuerySchema,
} from '../validators/report.validator.js';
import { ReportService } from '../services/report.service.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMonthlyStatement = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = monthlyStatementQuerySchema.parse(req.query);
    const statement = await ReportService.getMonthlyStatement(userId, validated.year, validated.month);

    res.status(200).json({
      success: true,
      data: statement,
    });
  } catch (err) {
    next(err);
  }
};

export const getTaxSummary = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = taxSummaryQuerySchema.parse(req.query);
    const summary = await ReportService.getTaxSummary(userId, validated.taxYear);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

export const exportCsv = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('Unauthorized', 401));

    const validated = exportCsvQuerySchema.parse(req.query);
    const csvContent = await ReportService.exportCsv(userId, validated);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="spendx-transactions.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
