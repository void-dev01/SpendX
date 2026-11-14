import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid({ message: 'Invalid account ID format' }),
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], { message: 'Invalid transaction type' }),
  category: z.string().min(1, { message: 'Category is required' }).max(50),
  description: z.string().min(1, { message: 'Description is required' }).max(255),
  date: z.string().datetime({ message: 'Date must be a valid ISO-8601 string' }),
  merchantName: z.string().max(100).optional(),
  isRecurring: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const queryTransactionsSchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 20)),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
