import { z } from 'zod';

export const createSavingsGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().nonnegative('Current amount cannot be negative').default(0),
  targetDate: z.string().datetime('Target date must be a valid ISO datetime'),
  category: z.string().default('Emergency Fund'),
});

export const updateSavingsGoalSchema = createSavingsGoalSchema.partial();

export const recordContributionSchema = z.object({
  amount: z.number().positive('Contribution amount must be greater than zero'),
  notes: z.string().max(255).optional(),
});
