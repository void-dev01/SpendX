import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { AccountRecord } from '@/services/accountService';

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Account name is required' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  type: z.enum(['BANK', 'SAVINGS', 'CASH', 'CREDIT_CARD', 'OTHER']),
  institution: z
    .string()
    .min(1, { message: 'Bank / Institution name is required' })
    .max(60),
  balance: z
    .number({ invalid_type_error: 'Balance must be a valid number' })
    .min(0, { message: 'Balance cannot be negative' }),
  lastFourDigits: z
    .string()
    .regex(/^\d{4}$/, { message: 'Must be exactly 4 digits' })
    .optional()
    .or(z.literal('')),
  currency: z.string().default('INR'),
  notes: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AccountRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: AccountRecord | null;
  isSubmitting?: boolean;
}

export const AccountFormDialog: React.FC<AccountFormDialogProps> = ({
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
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      type: 'BANK',
      institution: '',
      balance: undefined as unknown as number,
      lastFourDigits: '',
      currency: 'INR',
      notes: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        type: initialData.type,
        institution: initialData.institution,
        balance: initialData.balance,
        lastFourDigits: initialData.lastFourDigits || '',
        currency: initialData.currency || 'INR',
        notes: initialData.notes || '',
      });
    } else {
      reset({
        name: '',
        type: 'BANK',
        institution: '',
        balance: undefined as unknown as number,
        lastFourDigits: '',
        currency: 'INR',
        notes: '',
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const onFormSubmit = async (values: AccountFormValues) => {
    await onSubmit({
      ...values,
      status: 'ACTIVE',
      lastFourDigits: values.lastFourDigits ? values.lastFourDigits : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-white/90 dark:border-white/15 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <h2 id="account-dialog-title" className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              {initialData ? 'Edit Account' : 'Add New Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {initialData ? 'Update verified account details' : 'Connect a bank account, credit card, or cash wallet'}
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
          {/* Account Name */}
          <div>
            <label htmlFor="account-name" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Account Name *
            </label>
            <input
              id="account-name"
              type="text"
              placeholder="e.g. HDFC Salary Checking"
              {...register('name')}
              className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="account-type" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Account Type *
              </label>
              <select
                id="account-type"
                {...register('type')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                <option value="BANK">Bank Account (Checking)</option>
                <option value="SAVINGS">Savings Account</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Cash Wallet</option>
                <option value="OTHER">Other Account</option>
              </select>
              {errors.type && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="account-institution" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Bank / Institution *
              </label>
              <input
                id="account-institution"
                type="text"
                placeholder="e.g. HDFC Bank, SBI, ICICI"
                {...register('institution')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
              />
              {errors.institution && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.institution.message}</p>
              )}
            </div>
          </div>

          {/* Balance & Last Four Digits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="account-balance" className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Current Balance (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  id="account-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('balance', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
                />
              </div>
              {errors.balance && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.balance.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Last 4 Digits (Masked)
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 4092"
                {...register('lastFourDigits')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
              />
              {errors.lastFourDigits && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.lastFourDigits.message}</p>
              )}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Primary salary account, credit limit remarks, etc."
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
                <span>{initialData ? 'Update Account' : 'Save Account'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
