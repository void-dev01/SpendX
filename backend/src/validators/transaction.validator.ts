import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createTransactionSchema = z.object({
  accountId: z.string().trim().min(1).regex(/^([0-9a-fA-F-]{36}|acc-[a-zA-Z0-9-]+)$/, { message: 'Invalid account ID format' }),
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], { message: 'Invalid transaction type' }),
  category: z.string().min(1, { message: 'Category is required' }).max(50),
  description: z.string().min(1, { message: 'Description is required' }).max(255),
  date: z.string().min(1, { message: 'Date is required' }),
  merchantName: z.string().max(100).optional(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  referenceNumber: z.string().optional(),
  isRecurring: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const queryTransactionsSchema = z.object({
  page: z.union([z.string(), z.number()]).optional().transform((v) => (v ? Number(v) : 1)),
  limit: z.union([z.string(), z.number()]).optional().transform((v) => (v ? Number(v) : 20)),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
  category: z.string().optional(),
  accountId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export const validateCreateTransaction = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    createTransactionSchema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
};
