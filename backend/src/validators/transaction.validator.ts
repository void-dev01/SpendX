import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid({ message: 'Invalid account ID format' }),
  amount: z.number().positive({ message: 'Amount must be greater than zero' }),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER'], { message: 'Invalid transaction type' }),
  category: z.string().min(1, { message: 'Category is required' }).max(50),
  description: z.string().min(1, { message: 'Description is required' }).max(255),
  date: z.string().datetime({ message: 'Date must be a valid ISO-8601 string' }),
  merchantName: z.string().max(100).optional(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  referenceNumber: z.string().optional(),
  isRecurring: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

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
