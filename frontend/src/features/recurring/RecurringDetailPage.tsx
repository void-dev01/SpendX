import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CreditCard,
  Edit2,
  Trash2,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';
import { toast } from 'sonner';
import { recurringService } from '@/services/recurringService';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { RecurringFormDialog } from '@/components/recurring/RecurringFormDialog';

export const RecurringDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch Payment Details
  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['recurringPayment', id],
    queryFn: () => (id ? recurringService.getRecurringById(id) : null),
  });

  // Fetch Accounts for linked account name
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // Fetch all transactions to show associated historical records
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Filter associated transactions
  const relatedTransactions = transactions
    .filter(
      (tx) =>
        payment &&
        tx.type === 'EXPENSE' &&
        (tx.description.toLowerCase().includes(payment.merchant.toLowerCase()) ||
          tx.description.toLowerCase().includes(payment.name.toLowerCase()) ||
          tx.merchantName?.toLowerCase().includes(payment.merchant.toLowerCase()))
    )
    .slice(0, 10);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: any) => recurringService.updateRecurringPayment(id!, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      setIsEditOpen(false);
      toast.success(`Updated schedule for "${updated.name}"`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update recurring payment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => recurringService.deleteRecurringPayment(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      toast.success('Recurring schedule removed');
      navigate('/recurring');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete recurring payment');
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: () => recurringService.togglePause(id!),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      toast.success(
        updated.status === 'PAUSED'
          ? 'Recurring schedule paused'
          : 'Recurring schedule resumed'
      );
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: () => recurringService.markAsPaid(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Payment marked as paid and reconciled!');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="bg-surface p-12 rounded-2xl border border-border shadow-card text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h3 className="text-lg font-display font-bold text-foreground">
          Recurring Schedule Not Found
        </h3>
        <p className="text-xs text-secondary-text">
          The requested recurring payment record could not be found or has been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/recurring')}
          className="px-5 py-2 text-sm rounded-xl font-bold bg-primary text-[#111711] shadow-xs hover:bg-primary-hover transition-all cursor-pointer"
        >
          Return to Recurring
        </button>
      </div>
    );
  }

  const dueDate = new Date(payment.nextDueDate);
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/recurring')}
            aria-label="Back to recurring payments"
            className="p-2 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {payment.category}
              </span>
              <span className="text-[11px] text-secondary-text capitalize">
                • {payment.frequency.toLowerCase()} schedule
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mt-1">
              {payment.name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => togglePauseMutation.mutate()}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {payment.status === 'PAUSED' ? (
              <>
                <PlayCircle className="w-4 h-4 text-income" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-amber-500" />
                <span>Pause</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-surface-elevated border border-border hover:bg-surface-elevated/80 text-foreground transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this recurring schedule?')) {
                deleteMutation.mutate();
              }
            }}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Amount Card */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Amount
          </span>
          <div className="my-2">
            <span className="text-3xl font-display font-extrabold text-foreground tabular-nums">
              {recurringService.formatINR(payment.amount)}
            </span>
            <span className="text-xs text-secondary-text ml-1.5">
              /{payment.frequency.toLowerCase()}
            </span>
          </div>
          <span className="text-xs text-secondary-text">
            Next renewal {dueDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Status Card */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Status
          </span>
          <div className="my-2 flex items-center gap-2">
            <span className="text-2xl font-display font-bold capitalize text-foreground">
              {payment.status.toLowerCase().replace('_', ' ')}
            </span>
          </div>
          <span className="text-xs text-secondary-text">
            {diffDays > 0 ? `Due in ${diffDays} days` : diffDays === 0 ? 'Due today' : 'Payment overdue'}
          </span>
        </div>

        {/* Source Account Card */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Method
          </span>
          <div className="my-2 flex items-center gap-2 text-foreground">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold truncate">
              {payment.linkedAccountName || 'Unlinked'}
            </span>
          </div>
          <span className="text-xs text-secondary-text truncate">
            {payment.linkedAccountId ? 'Automatic debit enabled' : 'Manual cash/external bank transfer'}
          </span>
        </div>
      </div>

      {/* 3. Detailed Schedule Details */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-6">
        <h3 className="text-base font-display font-bold text-foreground">
          Schedule Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <span className="text-xs text-secondary-text">Merchant / Entity</span>
            <p className="text-sm font-semibold text-foreground mt-1 truncate">
              {payment.merchant}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <span className="text-xs text-secondary-text">Billing Interval</span>
            <p className="text-sm font-semibold text-foreground mt-1 capitalize">
              {payment.frequency.toLowerCase()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <span className="text-xs text-secondary-text">Schedule Inception</span>
            <p className="text-sm font-semibold text-foreground mt-1">
              {new Date(payment.startDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <span className="text-xs text-secondary-text">Last Recorded Payment</span>
            <p className="text-sm font-semibold text-foreground mt-1">
              {payment.lastPaidDate
                ? new Date(payment.lastPaidDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'No prior payments logged'}
            </p>
          </div>
        </div>

        {payment.notes && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border">
            <span className="text-xs text-secondary-text">Notes & References</span>
            <p className="text-sm text-foreground mt-1">{payment.notes}</p>
          </div>
        )}

        {/* Mark as paid callout */}
        <div className="p-5 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Reconcile Next Billing Cycle
            </h4>
            <p className="text-xs text-secondary-text mt-0.5">
              Marking this cycle as paid will deduct ₹{payment.amount.toLocaleString('en-IN')} from your linked account and advance the next due date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => markPaidMutation.mutate()}
            disabled={markPaidMutation.isPending}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-[#111711] shadow-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Cycle Paid</span>
          </button>
        </div>
      </div>

      {/* 4. Related Payment Ledger History */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-base font-display font-bold text-foreground">
            Associated Transaction Ledger ({relatedTransactions.length})
          </h3>
        </div>

        {relatedTransactions.length === 0 ? (
          <p className="text-xs text-secondary-text italic py-4">
            No previous transactions matching {payment.merchant} found in your ledger.
          </p>
        ) : (
          <div className="divide-y divide-border-subtle">
            {relatedTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {tx.description}
                  </p>
                  <p className="text-xs text-secondary-text">
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    • {tx.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold text-expense tabular-nums">
                    -₹{tx.amount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-income font-medium">Reconciled</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <RecurringFormDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (data) => {
          await updateMutation.mutateAsync(data);
        }}
        editingPayment={payment}
        accounts={accounts}
      />
    </div>
  );
};

export default RecurringDetailPage;
