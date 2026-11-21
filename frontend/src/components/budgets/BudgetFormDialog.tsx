import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { BudgetRecord } from '@/services/budgetService';
import { EXPENSE_CATEGORIES } from '@/services/transactionService';
import { CustomSelect } from '@/components/common/CustomSelect';

const budgetFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Budget name is required' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  allocatedAmount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Budget amount must be greater than zero' }),
  period: z.enum(['MONTHLY', 'YEARLY']),
  alertThreshold: z
    .number({ invalid_type_error: 'Threshold must be a number' })
    .min(50)
    .max(100),
  notes: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface BudgetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BudgetRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: BudgetRecord | null;
  isSubmitting?: boolean;
}

export const BudgetFormDialog: React.FC<BudgetFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      category: 'Food & Dining',
      allocatedAmount: undefined as unknown as number,
      period: 'MONTHLY',
      alertThreshold: 80,
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category: initialData.category,
        allocatedAmount: initialData.allocatedAmount,
        period: initialData.period,
        alertThreshold: initialData.alertThreshold || 80,
        notes: initialData.notes || '',
      });
    } else {
      reset({
        name: '',
        category: 'Food & Dining',
        allocatedAmount: undefined as unknown as number,
        period: 'MONTHLY',
        alertThreshold: 80,
        notes: '',
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (values: BudgetFormValues) => {
    await onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-in fade-in duration-200">
      <div
        className="bg-surface w-full max-w-lg rounded-2xl p-4 sm:p-6 border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto space-y-4 sm:space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 id="budget-dialog-title" className="text-lg font-display font-bold text-foreground">
              {initialData ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              {initialData ? 'Update category spending ceiling' : 'Set a planned spending limit for a category'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-text hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          {/* Budget Name */}
          <div>
            <label htmlFor="budget-name" className="block font-medium text-foreground mb-1">
              Budget Name *
            </label>
            <input
              id="budget-name"
              type="text"
              placeholder="e.g. Food & Dining Monthly"
              {...register('name')}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <CustomSelect
                id="budget-category"
                label="Category *"
                value={watch('category')}
                onChange={(val) => setValue('category', val, { shouldValidate: true })}
                options={EXPENSE_CATEGORIES}
                error={errors.category?.message}
              />
            </div>

            <div>
              <CustomSelect
                id="budget-period"
                label="Period *"
                value={watch('period')}
                onChange={(val) => setValue('period', val as 'MONTHLY' | 'YEARLY', { shouldValidate: true })}
                options={[
                  { label: 'Monthly', value: 'MONTHLY' },
                  { label: 'Yearly', value: 'YEARLY' },
                ]}
                error={errors.period?.message}
              />
            </div>
          </div>

          {/* Amount & Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="budget-amount" className="block font-medium text-foreground mb-1">
                Allocated Limit (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  ₹
                </span>
                <input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  placeholder="8000"
                  {...register('allocatedAmount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
                />
              </div>
              {errors.allocatedAmount && (
                <p className="text-[11px] text-destructive mt-1">{errors.allocatedAmount.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Warning Threshold (%)
              </label>
              <select
                {...register('alertThreshold', { valueAsNumber: true })}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
              >
                <option value={70}>70% of limit</option>
                <option value={80}>80% of limit (Recommended)</option>
                <option value={85}>85% of limit</option>
                <option value={90}>90% of limit</option>
                <option value={100}>100% (Strict ceiling)</option>
              </select>
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dining out with family, food delivery limits"
              {...register('notes')}
              className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 transition-colors cursor-pointer text-center min-h-[44px] shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs transition-opacity cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Budget' : 'Create Budget'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
