import { z } from 'zod';

export const createBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  allocatedAmount: z.number().positive('Allocated amount must be positive'),
  period: z.enum(['MONTHLY', 'WEEKLY', 'YEARLY']).default('MONTHLY'),
});

export const updateBudgetSchema = createBudgetSchema.partial();
