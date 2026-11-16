import { z } from 'zod';

export const monthlyStatementQuerySchema = z.object({
  year: z.string().optional(),
  month: z.string().optional(),
});

export const taxSummaryQuerySchema = z.object({
  taxYear: z.string().optional().default('2025-2026'),
});

export const exportCsvQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  accountId: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER', 'ALL']).optional(),
});

export type MonthlyStatementQuery = z.infer<typeof monthlyStatementQuerySchema>;
export type TaxSummaryQuery = z.infer<typeof taxSummaryQuerySchema>;
export type ExportCsvQuery = z.infer<typeof exportCsvQuerySchema>;
