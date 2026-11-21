import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { CustomSelect } from '@/components/common/CustomSelect';
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
    watch,
    setValue,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-in fade-in duration-200">
      <div
        className="bg-surface w-full max-w-lg rounded-2xl p-4 sm:p-6 border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto space-y-4 sm:space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 id="account-dialog-title" className="text-lg font-display font-bold text-foreground">
              {initialData ? 'Edit Account' : 'Add New Account'}
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              {initialData ? 'Update verified account details' : 'Connect a bank account, credit card, or cash wallet'}
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
          {/* Account Name */}
          <div>
            <label htmlFor="account-name" className="block font-medium text-foreground mb-1">
              Account Name *
            </label>
            <input
              id="account-name"
              type="text"
              placeholder="e.g. HDFC Salary Checking"
              {...register('name')}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Account Type & Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <CustomSelect
                id="account-type"
                name="type"
                label="Account Type *"
                value={watch('type')}
                onChange={(val) => setValue('type', val as any, { shouldValidate: true })}
                options={[
                  { label: 'Bank Account (Checking)', value: 'BANK' },
                  { label: 'Savings Account', value: 'SAVINGS' },
                  { label: 'Credit Card', value: 'CREDIT_CARD' },
                  { label: 'Cash Wallet', value: 'CASH' },
                  { label: 'Other Account', value: 'OTHER' },
                ]}
                error={errors.type?.message}
              />
            </div>

            <div>
              <label htmlFor="account-institution" className="block font-medium text-foreground mb-1">
                Bank / Institution *
              </label>
              <input
                id="account-institution"
                type="text"
                list="indian-banks"
                placeholder="e.g. HDFC Bank, SBI, ICICI, GPay"
                {...register('institution')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
              />
              <datalist id="indian-banks">
                <option value="HDFC Bank" />
                <option value="State Bank of India (SBI)" />
                <option value="ICICI Bank" />
                <option value="Axis Bank" />
                <option value="Kotak Mahindra Bank" />
                <option value="Punjab National Bank (PNB)" />
                <option value="Bank of Baroda" />
                <option value="Paytm / GPay UPI Wallet" />
                <option value="Physical Cash Wallet" />
              </datalist>
              {errors.institution && (
                <p className="text-[11px] text-destructive mt-1">{errors.institution.message}</p>
              )}
            </div>
          </div>

          {/* Balance & Last Four Digits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="account-balance" className="block font-medium text-foreground mb-1">
                Current Balance (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  ₹
                </span>
                <input
                  id="account-balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('balance', { valueAsNumber: true })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
                />
              </div>
              {errors.balance && (
                <p className="text-[11px] text-destructive mt-1">{errors.balance.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="account-last-four" className="block font-medium text-foreground mb-1">
                Last 4 Digits (Masked)
              </label>
              <input
                id="account-last-four"
                type="text"
                maxLength={4}
                placeholder="e.g. 4092"
                {...register('lastFourDigits')}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-xs"
              />
              {errors.lastFourDigits && (
                <p className="text-[11px] text-destructive mt-1">{errors.lastFourDigits.message}</p>
              )}
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block font-medium text-foreground mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Primary salary account, credit limit remarks, etc."
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
                <span>{initialData ? 'Update Account' : 'Save Account'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
