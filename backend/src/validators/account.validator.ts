import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  institution: z.string().min(1, 'Financial institution is required'),
  type: z.enum(['BANK', 'SAVINGS', 'CASH', 'CREDIT_CARD', 'OTHER']).default('BANK'),
  balance: z.number().default(0),
  currency: z.string().default('INR'),
  lastFourDigits: z.string().max(4).optional(),
  notes: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const updateAccountSchema = createAccountSchema.partial();

export const transferFundsSchema = z.object({
  fromAccountId: z.string().min(1, 'Source account is required'),
  toAccountId: z.string().min(1, 'Destination account is required'),
  amount: z.number().positive('Transfer amount must be greater than zero'),
  description: z.string().optional(),
  date: z.string().optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type TransferFundsInput = z.infer<typeof transferFundsSchema>;
