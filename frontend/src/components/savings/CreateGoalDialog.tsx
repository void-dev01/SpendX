import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Target } from 'lucide-react';
import {
  SavingsGoalRecord,
  GoalCategory,
  SAVINGS_CATEGORIES,
} from '@/services/savingsService';

const goalFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Goal name is required' })
    .max(60, { message: 'Name cannot exceed 60 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  targetAmount: z
    .number({ invalid_type_error: 'Target amount must be a number' })
    .positive({ message: 'Target amount must be greater than zero' }),
  currentAmount: z
    .number({ invalid_type_error: 'Current amount must be a number' })
    .min(0, { message: 'Current amount cannot be negative' })
    .default(0),
  targetDate: z.string().min(1, { message: 'Target date is required' }),
  notes: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface CreateGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<SavingsGoalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  initialData?: SavingsGoalRecord | null;
  isSubmitting?: boolean;
}

export const CreateGoalDialog: React.FC<CreateGoalDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const isEdit = Boolean(initialData);

  // Default target date: 6 months in future
  const defaultTargetDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: '',
      category: 'Emergency Fund',
      targetAmount: undefined as unknown as number,
      currentAmount: 0,
      targetDate: defaultTargetDate,
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category: initialData.category,
        targetAmount: initialData.targetAmount,
        currentAmount: initialData.currentAmount,
        targetDate: initialData.targetDate.split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      reset({
        name: '',
        category: 'Emergency Fund',
        targetAmount: undefined as unknown as number,
        currentAmount: 0,
        targetDate: defaultTargetDate,
        notes: '',
      });
    }
  }, [initialData, isOpen, reset, defaultTargetDate]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: GoalFormValues) => {
    const isCompleted = data.currentAmount >= data.targetAmount;
    await onSubmit({
      name: data.name.trim(),
      category: data.category as GoalCategory,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      targetDate: new Date(data.targetDate).toISOString(),
      status: isCompleted ? 'COMPLETED' : 'ACTIVE',
      notes: data.notes?.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-dialog-title"
    >
      <div className="w-full max-w-lg glass-panel p-4 sm:p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-2xl relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="goal-dialog-title"
                className="text-lg font-bold text-slate-800 dark:text-slate-100"
              >
                {isEdit ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEdit
                  ? 'Update your target parameters and milestones.'
                  : 'Establish a new milestone for automated financial acceleration.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
          {/* Goal Name */}
          <div>
            <label
              htmlFor="goal-name-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Goal Name *
            </label>
            <input
              id="goal-name-input"
              type="text"
              placeholder="e.g. Emergency Fund, Japan Trip, M3 MacBook"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-white/80 dark:border-white/10 focus:ring-spendx-blue-primary'
              } text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="goal-category-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Category *
            </label>
            <select
              id="goal-category-select"
              {...register('category')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary font-medium"
            >
              {SAVINGS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Target Amount & Initial Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="goal-target-amount-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Target Amount (₹) *
              </label>
              <input
                id="goal-target-amount-input"
                type="number"
                step="any"
                placeholder="50000"
                {...register('targetAmount', { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border ${
                  errors.targetAmount
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-white/80 dark:border-white/10 focus:ring-spendx-blue-primary'
                } text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 tabular-nums`}
              />
              {errors.targetAmount && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="goal-current-amount-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Already Saved (₹)
              </label>
              <input
                id="goal-current-amount-input"
                type="number"
                step="any"
                placeholder="0"
                {...register('currentAmount', { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border ${
                  errors.currentAmount
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-white/80 dark:border-white/10 focus:ring-spendx-blue-primary'
                } text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 tabular-nums`}
              />
              {errors.currentAmount && (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">
                  {errors.currentAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="goal-target-date-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Target Date *
            </label>
            <input
              id="goal-target-date-input"
              type="date"
              {...register('targetDate')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border ${
                errors.targetDate
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-white/80 dark:border-white/10 focus:ring-spendx-blue-primary'
              } text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2`}
            />
            {errors.targetDate && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">
                {errors.targetDate.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="goal-notes-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Notes (Optional)
            </label>
            <textarea
              id="goal-notes-input"
              rows={2}
              placeholder="e.g. 6 months living expenses, flights and stay reserved..."
              {...register('notes')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100/60 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer text-center min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-md hover:shadow hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEdit ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
