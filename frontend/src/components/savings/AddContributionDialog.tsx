import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, PlusCircle, Sparkles, AlertCircle } from 'lucide-react';
import { SavingsGoalRecord, savingsService } from '@/services/savingsService';
import { AccountRecord, accountService } from '@/services/accountService';

const contributionSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive({ message: 'Contribution amount must be greater than zero' }),
  sourceAccountId: z.string().min(1, { message: 'Source account is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  notes: z.string().optional(),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

interface AddContributionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoalRecord | null;
  onSubmit: (data: {
    amount: number;
    sourceAccountId: string;
    sourceAccountName: string;
    date: string;
    notes?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export const AddContributionDialog: React.FC<AddContributionDialogProps> = ({
  isOpen,
  onClose,
  goal,
  onSubmit,
  isSubmitting = false,
}) => {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: undefined as unknown as number,
      sourceAccountId: '',
      date: todayStr,
      notes: '',
    },
  });

  const enteredAmount = watch('amount') || 0;
  const selectedAccountId = watch('sourceAccountId');

  // Load user accounts
  useEffect(() => {
    if (isOpen) {
      setIsLoadingAccounts(true);
      accountService
        .getAccounts()
        .then((accs) => {
          // Filter to liquid accounts (checking, savings, cash, investment) - avoid credit cards as funding source if possible, but keep all active
          const valid = accs.filter((a) => a.status === 'ACTIVE');
          setAccounts(valid);
          if (valid.length > 0 && !selectedAccountId) {
            reset({
              amount: undefined as unknown as number,
              sourceAccountId: valid[0].id,
              date: todayStr,
              notes: '',
            });
          }
        })
        .finally(() => setIsLoadingAccounts(false));
    }
  }, [isOpen, reset, todayStr]);

  if (!isOpen || !goal) return null;

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // Projections
  const currentAmt = goal.currentAmount;
  const projectedAmt = currentAmt + (enteredAmount > 0 ? Number(enteredAmount) : 0);
  const currentPct =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((currentAmt / goal.targetAmount) * 100))
      : 0;
  const projectedPct =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((projectedAmt / goal.targetAmount) * 100))
      : 0;

  const isExceedingSourceBalance =
    selectedAccount && enteredAmount > selectedAccount.balance;

  const onFormSubmit = async (data: ContributionFormValues) => {
    const acc = accounts.find((a) => a.id === data.sourceAccountId);
    const sourceAccountName = acc ? acc.name : 'Primary Account';

    await onSubmit({
      amount: Number(data.amount),
      sourceAccountId: data.sourceAccountId,
      sourceAccountName,
      date: new Date(data.date).toISOString(),
      notes: data.notes?.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribution-dialog-title"
    >
      <div className="w-full max-w-md bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="contribution-dialog-title"
                className="text-lg font-display font-bold text-foreground"
              >
                Add Money to Goal
              </h2>
              <p className="text-xs text-secondary-text">
                Allocate funds towards <span className="font-semibold text-foreground">{goal.name}</span>
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
          {/* Amount */}
          <div>
            <label
              htmlFor="contrib-amount-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Contribution Amount (₹) *
            </label>
            <input
              id="contrib-amount-input"
              type="number"
              step="any"
              placeholder="e.g. 5000"
              autoFocus
              {...register('amount', { valueAsNumber: true })}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-surface-elevated border ${
                errors.amount
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-border focus:ring-primary/20 focus:border-primary'
              } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 font-semibold tabular-nums shadow-xs`}
            />
            {errors.amount && (
              <p className="text-[11px] text-destructive mt-1 font-medium">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Source Account Selector */}
          <div>
            <label
              htmlFor="contrib-source-account-select"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Source Account (Funding) *
            </label>
            {isLoadingAccounts ? (
              <div className="py-2 text-xs text-secondary-text flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading accounts...
              </div>
            ) : (
              <select
                id="contrib-source-account-select"
                {...register('sourceAccountId')}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-xs"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type}) — Avail: {savingsService.formatINR(acc.balance)}
                  </option>
                ))}
              </select>
            )}
            {errors.sourceAccountId && (
              <p className="text-[11px] text-destructive mt-1 font-medium">
                {errors.sourceAccountId.message}
              </p>
            )}

            {isExceedingSourceBalance && (
              <div className="mt-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Notice: Amount exceeds current balance in {selectedAccount?.name} (
                  {savingsService.formatINR(selectedAccount?.balance || 0)}).
                </span>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="contrib-date-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Date *
            </label>
            <input
              id="contrib-date-input"
              type="date"
              {...register('date')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
            {errors.date && (
              <p className="text-[11px] text-destructive mt-1 font-medium">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="contrib-notes-input"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Deposit Note / Reason (Optional)
            </label>
            <input
              id="contrib-notes-input"
              type="text"
              placeholder="e.g. Salary savings chunk, freelance milestone deposit"
              {...register('notes')}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
          </div>

          {/* Live Progress Preview */}
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-secondary" /> Projected Milestone
              </span>
              <span className="text-primary font-bold">
                {currentPct}% → {projectedPct}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface border border-border overflow-hidden">
              <div
                className="h-full rounded-full bg-income transition-all duration-300"
                style={{ width: `${projectedPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-secondary-text">
              <span>Current: {savingsService.formatINR(currentAmt)}</span>
              <span>Projected: {savingsService.formatINR(projectedAmt)}</span>
            </div>
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
              <span>Confirm Contribution</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
