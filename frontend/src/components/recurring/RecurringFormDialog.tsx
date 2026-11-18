import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import {
  RecurringRecord,
  RecurringFrequency,
  RecurringCategory,
  RECURRING_CATEGORIES,
} from '@/services/recurringService';
import { AccountRecord } from '@/services/accountService';

const recurringSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  merchant: z.string().min(2, 'Merchant must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  nextDueDate: z.string().min(1, 'Due date is required'),
  linkedAccountId: z.string().optional(),
  notes: z.string().optional(),
});

type RecurringFormData = z.infer<typeof recurringSchema>;

interface RecurringFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RecurringRecord>) => Promise<void>;
  editingPayment?: RecurringRecord | null;
  accounts: AccountRecord[];
}

export const RecurringFormDialog: React.FC<RecurringFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingPayment,
  accounts,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecurringFormData>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      name: '',
      merchant: '',
      category: 'Subscriptions',
      amount: 0,
      frequency: 'MONTHLY',
      nextDueDate: new Date().toISOString().split('T')[0],
      linkedAccountId: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (editingPayment) {
      reset({
        name: editingPayment.name,
        merchant: editingPayment.merchant,
        category: editingPayment.category,
        amount: editingPayment.amount,
        frequency: editingPayment.frequency,
        nextDueDate: editingPayment.nextDueDate.split('T')[0],
        linkedAccountId: editingPayment.linkedAccountId || '',
        notes: editingPayment.notes || '',
      });
    } else {
      reset({
        name: '',
        merchant: '',
        category: 'Subscriptions',
        amount: 0,
        frequency: 'MONTHLY',
        nextDueDate: new Date().toISOString().split('T')[0],
        linkedAccountId: accounts[0]?.id || '',
        notes: '',
      });
    }
  }, [editingPayment, reset, accounts]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: RecurringFormData) => {
    const selectedAcc = accounts.find((a) => a.id === data.linkedAccountId);
    await onSubmit({
      ...data,
      category: data.category as RecurringCategory,
      frequency: data.frequency as RecurringFrequency,
      linkedAccountName: selectedAcc ? selectedAcc.name : undefined,
      nextDueDate: new Date(data.nextDueDate).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/60 dark:border-white/10 relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              {editingPayment ? 'Edit Recurring Schedule' : 'New Recurring Schedule'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automate and track repeating charges, loans, rent, and subscriptions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-5 space-y-4">
          {/* Name & Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rec-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan / Service Name *
              </label>
              <div className="relative">
                <input
                  id="rec-name"
                  type="text"
                  placeholder="e.g. Netflix Premium 4K"
                  {...register('name')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rec-merchant" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Merchant / Payee *
              </label>
              <div className="relative">
                <input
                  id="rec-merchant"
                  type="text"
                  placeholder="e.g. Netflix Ltd"
                  {...register('merchant')}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
                />
              </div>
              {errors.merchant && (
                <p className="text-xs text-rose-500 mt-1">{errors.merchant.message}</p>
              )}
            </div>
          </div>

          {/* Amount & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rec-amount" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <div className="relative">
                <input
                  id="rec-amount"
                  type="number"
                  step="any"
                  placeholder="649"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-rose-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rec-freq" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Billing Cycle *
              </label>
              <select
                id="rec-freq"
                {...register('frequency')}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 cursor-pointer"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          {/* Category & Next Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rec-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                id="rec-category"
                {...register('category')}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 cursor-pointer"
              >
                {RECURRING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rec-due" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Next Due Date *
              </label>
              <input
                id="rec-due"
                type="date"
                {...register('nextDueDate')}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              />
              {errors.nextDueDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.nextDueDate.message}</p>
              )}
            </div>
          </div>

          {/* Linked Payment Account */}
          <div>
            <label htmlFor="rec-account" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Source Account (Auto-Deduct on Payment)
            </label>
            <select
              id="rec-account"
              {...register('linkedAccountId')}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 cursor-pointer"
            >
              <option value="">Unlinked (No automatic deduction)</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type}) - Balance: ₹{acc.balance.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="rec-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Account Number / Reference (Optional)
            </label>
            <textarea
              id="rec-notes"
              rows={2}
              placeholder="e.g. Auto-debit active on ICICI card ending in 4102"
              {...register('notes')}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-center min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-spendx-primary w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>{editingPayment ? 'Save Changes' : 'Create Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
