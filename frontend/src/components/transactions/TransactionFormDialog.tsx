import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import {
  TransactionRecord,
  TransactionType,
  DEFAULT_USER_ACCOUNTS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/services/transactionService';

const transactionFormSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER']),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Amount must be greater than zero' }),
  description: z
    .string()
    .min(1, { message: 'Transaction name is required' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  category: z.string().min(1, { message: 'Category is required' }),
  accountId: z.string().min(1, { message: 'Account selection is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  paymentMethod: z.enum([
    'UPI',
    'Credit Card',
    'Debit Card',
    'Net Banking',
    'Cash',
    'Bank Transfer',
  ]),
  merchantName: z.string().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface TransactionFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: TransactionRecord | null;
  isSubmitting?: boolean;
}

export const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  // Format current datetime for input
  const getFormattedNow = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: undefined as unknown as number,
      description: '',
      category: 'Food & Dining',
      accountId: DEFAULT_USER_ACCOUNTS[0]?.id || '',
      date: getFormattedNow(),
      paymentMethod: 'UPI',
      merchantName: '',
      notes: '',
      isRecurring: false,
    },
  });

  const selectedType = watch('type');

  // Prepopulate if editing
  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount,
        description: initialData.description,
        category: initialData.category,
        accountId: initialData.accountId,
        date: initialData.date ? initialData.date.slice(0, 16) : getFormattedNow(),
        paymentMethod: initialData.paymentMethod,
        merchantName: initialData.merchantName || '',
        notes: initialData.notes || '',
        isRecurring: initialData.isRecurring,
      });
    } else {
      reset({
        type: 'EXPENSE',
        amount: undefined as unknown as number,
        description: '',
        category: 'Food & Dining',
        accountId: DEFAULT_USER_ACCOUNTS[0]?.id || '',
        date: getFormattedNow(),
        paymentMethod: 'UPI',
        merchantName: '',
        notes: '',
        isRecurring: false,
      });
    }
  }, [initialData, isOpen, reset]);

  // Adjust default category when type changes
  const handleTypeSelect = (type: TransactionType) => {
    setValue('type', type);
    if (type === 'INCOME') {
      setValue('category', 'Salary');
    } else if (type === 'EXPENSE') {
      setValue('category', 'Food & Dining');
    } else {
      setValue('category', 'Transfer');
    }
  };

  const onFormSubmit = async (values: TransactionFormValues) => {
    const selectedAccount = DEFAULT_USER_ACCOUNTS.find((a) => a.id === values.accountId);
    const accountName = selectedAccount?.name || 'Primary Account';

    await onSubmit({
      ...values,
      accountName,
      status: 'COMPLETED',
      date: new Date(values.date).toISOString(),
    });
  };

  if (!isOpen) return null;

  const categories =
    selectedType === 'INCOME'
      ? INCOME_CATEGORIES
      : selectedType === 'EXPENSE'
      ? EXPENSE_CATEGORIES
      : ['Transfer', 'Emergency Fund', 'Savings Allocation', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-lg rounded-3xl p-4 sm:p-6 border border-white/90 dark:border-white/15 shadow-2xl relative max-h-[90dvh] overflow-y-auto space-y-4 sm:space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <h2 id="dialog-title" className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              {initialData ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {initialData ? 'Update verified transaction metadata' : 'Record an income or expense transaction'}
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
          {/* Segmented Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl glass-surface border border-white/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleTypeSelect('EXPENSE')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'EXPENSE'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('INCOME')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'INCOME'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('TRANSFER')}
                className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'TRANSFER'
                    ? 'bg-spendx-blue-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Transfer</span>
              </button>
            </div>
          </div>

          {/* Amount & Transaction Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Amount (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Transaction Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                {...register('description')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 text-sm"
              />
              {errors.description && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                {categories.map((c) => (
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
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Account *
              </label>
              <select
                {...register('accountId')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                {DEFAULT_USER_ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.accountId.message}</p>
              )}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('date')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              />
              {errors.date && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
              >
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
              </select>
            </div>
          </div>

          {/* Merchant Name */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Merchant Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Starbucks Coffee, Amazon, Shell"
              {...register('merchantName')}
              className="w-full px-3 py-2.5 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add optional notes or audit remarks..."
              {...register('notes')}
              className="w-full px-3 py-2 rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isRecurring"
              {...register('isRecurring')}
              className="rounded border-slate-300 dark:border-slate-600 text-spendx-blue-primary focus:ring-spendx-blue-primary w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="isRecurring"
              className="font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              Recurring automated transaction (e.g. monthly bill, subscription, salary)
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100/60 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-pointer text-center min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary shadow-md hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Transaction' : 'Save Transaction'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
