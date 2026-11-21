import { z } from 'zod';

export const recurringFrequencyEnum = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']);
export const recurringCategoryEnum = z.enum([
  'Subscriptions',
  'EMIs & Loans',
  'Rent',
  'Bills & Utilities',
  'Insurance',
  'Memberships',
  'Education',
  'Other',
]);
export const recurringStatusEnum = z.enum([
  'UPCOMING',
  'DUE_TODAY',
  'OVERDUE',
  'PAID',
  'PAUSED',
  'CANCELLED',
]);

export const createRecurringSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  merchant: z.string().min(1, 'Merchant is required'),
  category: recurringCategoryEnum.default('Subscriptions'),
  amount: z.number().positive('Amount must be positive'),
  frequency: recurringFrequencyEnum.default('MONTHLY'),
  startDate: z.string().optional().default(() => new Date().toISOString()),
  nextDueDate: z.string().min(1, 'Next due date is required'),
  linkedAccountId: z.string().optional(),
  linkedAccountName: z.string().optional(),
  status: recurringStatusEnum.default('UPCOMING'),
  notes: z.string().optional(),
});

export const updateRecurringSchema = createRecurringSchema.partial().extend({
  lastPaidDate: z.string().optional(),
});

export const detectPatternsSchema = z.object({
  lookbackDays: z.number().min(30).max(365).default(90),
});

export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>;
export type DetectPatternsInput = z.infer<typeof detectPatternsSchema>;
