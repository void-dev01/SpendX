import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import {
  TransactionRecord,
  TransactionType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/services/transactionService';
import { AccountRecord, accountService } from '@/services/accountService';

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
  accounts?: AccountRecord[];
}

export const TransactionFormDialog: React.FC<TransactionFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  accounts: propAccounts,
}) => {
  // Format current datetime for input
  const getFormattedNow = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const storedAccounts = accountService.getStoredAccounts();
  const availableAccounts: AccountRecord[] =
    propAccounts && propAccounts.length > 0
      ? propAccounts
      : storedAccounts.length > 0
      ? storedAccounts
      : [
          {
            id: 'acc-cash-wallet',
            userId: 'default',
            name: 'Cash / Primary Wallet',
            institution: 'Cash',
            type: 'CASH',
            balance: 0,
            currency: 'INR',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

  const defaultAccountId = availableAccounts[0]?.id || 'acc-cash-wallet';

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
      accountId: defaultAccountId,
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
        accountId: initialData.accountId || defaultAccountId,
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
        accountId: defaultAccountId,
        date: getFormattedNow(),
        paymentMethod: 'UPI',
        merchantName: '',
        notes: '',
        isRecurring: false,
      });
    }
  }, [initialData, isOpen, reset, defaultAccountId]);

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
    const selectedAccount = availableAccounts.find((a) => a.id === values.accountId);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-in fade-in duration-200">
      <div
        className="bg-surface w-full max-w-lg rounded-2xl p-4 sm:p-6 border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto space-y-4 sm:space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 id="dialog-title" className="text-lg font-display font-bold text-foreground">
              {initialData ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              {initialData ? 'Update verified transaction metadata' : 'Record an income or expense transaction'}
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
          {/* Segmented Type Selector */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-surface-elevated border border-border">
              <button
                type="button"
                onClick={() => handleTypeSelect('EXPENSE')}
                className={`py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'EXPENSE'
                    ? 'bg-destructive text-white shadow-xs'
                    : 'text-secondary-text hover:text-foreground'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('INCOME')}
                className={`py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'INCOME'
                    ? 'bg-income text-[#111711] shadow-xs font-bold'
                    : 'text-secondary-text hover:text-foreground'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('TRANSFER')}
                className={`py-2 px-3 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedType === 'TRANSFER'
                    ? 'bg-primary text-[#111711] shadow-xs font-bold'
                    : 'text-secondary-text hover:text-foreground'
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
              <label className="block font-medium text-foreground mb-1">
                Amount (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] text-destructive mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Transaction Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                {...register('description')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
              />
              {errors.description && (
                <p className="text-[11px] text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">
                Category *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Account *
              </label>
              <select
                {...register('accountId')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
              >
                {availableAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="text-[11px] text-destructive mt-1">{errors.accountId.message}</p>
              )}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-foreground mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('date')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
              />
              {errors.date && (
                <p className="text-[11px] text-destructive mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Payment Method
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
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
            <label className="block font-medium text-foreground mb-1">
              Merchant Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Starbucks Coffee, Amazon, Shell"
              {...register('merchantName')}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add optional notes or audit remarks..."
              {...register('notes')}
              className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isRecurring"
              {...register('isRecurring')}
              className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="isRecurring"
              className="font-medium text-foreground cursor-pointer"
            >
              Recurring automated transaction (e.g. monthly bill, subscription, salary)
            </label>
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
                <span>{initialData ? 'Update Transaction' : 'Save Transaction'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
