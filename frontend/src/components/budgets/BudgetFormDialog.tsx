import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { BudgetRecord } from '@/services/budgetService';
import { EXPENSE_CATEGORIES } from '@/services/transactionService';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/90 dark:border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <h2 id="budget-dialog-title" className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              {initialData ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {initialData ? 'Update category spending ceiling' : 'Set a planned spending limit for a category'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs">
          {/* Budget Name */}
          <div>
            <label htmlFor="budget-name" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Budget Name *
            </label>
            <input
              id="budget-name"
              type="text"
              placeholder="e.g. Food & Dining Monthly"
              {...register('name')}
              className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="budget-category" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                id="budget-category"
                {...register('category')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="budget-period" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Period *
              </label>
              <select
                id="budget-period"
                {...register('period')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          {/* Amount & Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="budget-amount" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Allocated Limit (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  placeholder="8000"
                  {...register('allocatedAmount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
                />
              </div>
              {errors.allocatedAmount && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.allocatedAmount.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Warning Threshold (%)
              </label>
              <select
                {...register('alertThreshold', { valueAsNumber: true })}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
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
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Dining out with family, food delivery limits"
              {...register('notes')}
              className="w-full px-3 py-2 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100/60 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl font-semibold glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary shadow-md hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
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
