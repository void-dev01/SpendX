import { z } from 'zod';
import { createTransactionSchema } from './transaction.validator.js';

export const validateBatchSchema = z.object({
  source: z.enum(['CSV', 'EXCEL', 'PDF_TEXT', 'SMS_TEXT']),
  fileName: z.string().max(100).optional(),
  items: z.array(createTransactionSchema).min(1, 'Items list cannot be empty'),
});

export const commitBatchSchema = z.object({
  source: z.enum(['CSV', 'EXCEL', 'PDF_TEXT', 'SMS_TEXT']),
  fileName: z.string().max(100).optional(),
  items: z.array(createTransactionSchema).min(1, 'Items list cannot be empty'),
});
