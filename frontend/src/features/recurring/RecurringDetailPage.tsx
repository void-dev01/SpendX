import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  History,
} from 'lucide-react';
import { recurringService, RecurringRecord } from '@/services/recurringService';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { RecurringFormDialog } from '@/components/recurring/RecurringFormDialog';

export const RecurringDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch payment details
  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['recurringPayment', id],
    queryFn: () => (id ? recurringService.getRecurringById(id) : null),
    enabled: Boolean(id),
  });

  // Fetch accounts
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // Fetch related transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Filter transactions related to this merchant or marked isRecurring
  const relatedTransactions = transactions.filter((tx) => {
    if (!payment) return false;
    const nameMatch =
      tx.description.toLowerCase().includes(payment.merchant.toLowerCase()) ||
      tx.merchantName?.toLowerCase().includes(payment.merchant.toLowerCase()) ||
      tx.description.toLowerCase().includes(payment.name.toLowerCase());
    return nameMatch || (tx.isRecurring && tx.category === payment.category);
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<RecurringRecord>) => {
      if (!id) throw new Error('Missing ID');
      return recurringService.updateRecurringPayment(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      toast.success('Schedule updated successfully');
      setIsEditOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update schedule');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Missing ID');
      return recurringService.deleteRecurringPayment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      toast.success('Recurring payment schedule deleted');
      navigate('/recurring');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete schedule');
    },
  });

  const togglePauseMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Missing ID');
      return recurringService.togglePause(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      toast.success('Schedule status toggled');
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error('Missing ID');
      return recurringService.markAsPaid(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurringPayment', id] });
      queryClient.invalidateQueries({ queryKey: ['recurringPayments'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Payment marked as paid and reconciled!');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-spendx-blue-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="glass-card p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          Recurring Schedule Not Found
        </h3>
        <p className="text-xs text-slate-500">
          The requested recurring payment record could not be found or has been deleted.
        </p>
        <button
          type="button"
          onClick={() => navigate('/recurring')}
          className="btn-spendx-primary px-5 py-2 text-sm rounded-xl font-semibold"
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
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-spendx-blue-primary bg-spendx-blue-primary/10 px-2 py-0.5 rounded-md">
                {payment.category}
              </span>
              <span className="text-[11px] text-slate-400 capitalize">
                • {payment.frequency.toLowerCase()} schedule
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-spendx-text-primary dark:text-spendx-soft-purple tracking-tight mt-1">
              {payment.name}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => togglePauseMutation.mutate()}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
          >
            {payment.status === 'PAUSED' ? (
              <>
                <PlayCircle className="w-4 h-4 text-emerald-500" />
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
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
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
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Amount Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Payment Amount
          </span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
              {recurringService.formatINR(payment.amount)}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">
              /{payment.frequency.toLowerCase()}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Next renewal {dueDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Status Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Status
          </span>
          <div className="my-2 flex items-center gap-2">
            <span className="text-2xl font-bold capitalize text-spendx-text-primary dark:text-spendx-soft-purple">
              {payment.status.toLowerCase().replace('_', ' ')}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {diffDays > 0 ? `Due in ${diffDays} days` : diffDays === 0 ? 'Due today' : 'Payment overdue'}
          </span>
        </div>

        {/* Source Account Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Payment Method
          </span>
          <div className="my-2 flex items-center gap-2 text-spendx-text-primary dark:text-spendx-soft-purple">
            <CreditCard className="w-5 h-5 text-spendx-blue-primary" />
            <span className="text-base font-bold truncate">
              {payment.linkedAccountName || 'Unlinked'}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate">
            {payment.linkedAccountId ? 'Automatic debit enabled' : 'Manual cash/external bank transfer'}
          </span>
        </div>
      </div>

      {/* 3. Detailed Schedule Details */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-6">
        <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          Schedule Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-400">Merchant / Entity</span>
            <p className="text-sm font-semibold text-spendx-text-primary dark:text-spendx-soft-purple mt-1 truncate">
              {payment.merchant}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-400">Billing Interval</span>
            <p className="text-sm font-semibold text-spendx-text-primary dark:text-spendx-soft-purple mt-1 capitalize">
              {payment.frequency.toLowerCase()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-400">Schedule Inception</span>
            <p className="text-sm font-semibold text-spendx-text-primary dark:text-spendx-soft-purple mt-1">
              {new Date(payment.startDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-400">Last Recorded Payment</span>
            <p className="text-sm font-semibold text-spendx-text-primary dark:text-spendx-soft-purple mt-1">
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
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5">
            <span className="text-xs text-slate-400">Notes & References</span>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{payment.notes}</p>
          </div>
        )}

        {/* Mark as paid callout */}
        <div className="p-5 rounded-2xl bg-spendx-blue-primary/5 border border-spendx-blue-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              Reconcile Next Billing Cycle
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Marking this cycle as paid will deduct ₹{payment.amount.toLocaleString('en-IN')} from your linked account and advance the next due date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => markPaidMutation.mutate()}
            disabled={markPaidMutation.isPending}
            className="btn-spendx-primary px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Cycle Paid</span>
          </button>
        </div>
      </div>

      {/* 4. Related Payment Ledger History */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-spendx-blue-primary" />
          <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
            Associated Transaction Ledger ({relatedTransactions.length})
          </h3>
        </div>

        {relatedTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">
            No previous transactions matching {payment.merchant} found in your ledger.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {relatedTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    • {tx.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-500 tabular-nums">
                    -₹{tx.amount.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-emerald-500 font-medium">Reconciled</span>
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
