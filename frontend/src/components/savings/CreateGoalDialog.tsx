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
import { CustomSelect } from '@/components/common/CustomSelect';

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
    watch,
    setValue,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-dialog-title"
    >
      <div className="w-full max-w-lg bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="goal-dialog-title"
                className="text-lg font-display font-bold text-foreground"
              >
                {isEdit ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h2>
              <p className="text-xs text-secondary-text">
                {isEdit
                  ? 'Update your target parameters and milestones.'
                  : 'Establish a new milestone for automated financial acceleration.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4 text-xs">
          {/* Goal Name */}
          <div>
            <label
              htmlFor="goal-name-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Goal Name *
            </label>
            <input
              id="goal-name-input"
              type="text"
              placeholder="e.g. Emergency Fund, Japan Trip, M3 MacBook"
              {...register('name')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border ${
                errors.name
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-primary/20 focus:border-primary'
              } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 shadow-xs`}
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <CustomSelect
              id="goal-category-select"
              label="Category *"
              value={watch('category')}
              onChange={(val) => setValue('category', val, { shouldValidate: true })}
              options={SAVINGS_CATEGORIES}
              error={errors.category?.message}
            />
          </div>

          {/* Target Amount & Initial Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="goal-target-amount-input"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Target Amount (₹) *
              </label>
              <input
                id="goal-target-amount-input"
                type="number"
                step="any"
                placeholder="50000"
                {...register('targetAmount', { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border ${
                  errors.targetAmount
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 tabular-nums shadow-xs`}
              />
              {errors.targetAmount && (
                <p className="text-[11px] text-destructive mt-1 font-medium">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="goal-current-amount-input"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Already Saved (₹)
              </label>
              <input
                id="goal-current-amount-input"
                type="number"
                step="any"
                placeholder="0"
                {...register('currentAmount', { valueAsNumber: true })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border ${
                  errors.currentAmount
                    ? 'border-destructive focus:ring-destructive'
                    : 'border-border focus:ring-primary/20 focus:border-primary'
                } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 tabular-nums shadow-xs`}
              />
              {errors.currentAmount && (
                <p className="text-[11px] text-destructive mt-1 font-medium">
                  {errors.currentAmount.message}
                </p>
              )}
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="goal-target-date-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Target Date *
            </label>
            <input
              id="goal-target-date-input"
              type="date"
              {...register('targetDate')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border ${
                errors.targetDate
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-primary/20 focus:border-primary'
              } text-foreground focus:outline-none focus:ring-2 shadow-xs`}
            />
            {errors.targetDate && (
              <p className="text-[11px] text-destructive mt-1 font-medium">
                {errors.targetDate.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="goal-notes-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Notes (Optional)
            </label>
            <textarea
              id="goal-notes-input"
              rows={2}
              placeholder="e.g. 6 months living expenses, flights and stay reserved..."
              {...register('notes')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 transition-colors cursor-pointer text-center min-h-[44px] shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-[#111711] shadow-xs transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
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
