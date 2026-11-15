import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Wallet,
  Tag,
  CreditCard,
  FileText,
} from 'lucide-react';
import { transactionService } from '@/services/transactionService';

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => (id ? transactionService.getTransactionById(id) : null),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-200/70 dark:bg-slate-800 rounded-lg" />
        <div className="glass-panel rounded-3xl p-6 h-64" />
      </div>
    );
  }

  const isIncome = transaction?.type === 'INCOME';
  const isTransfer = transaction?.type === 'TRANSFER';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions Ledger</span>
        </Link>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-glass-elevated space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Verified Ledger Audit Entry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-spendx-indigo dark:text-spendx-soft-purple mt-1">
              {transaction ? transaction.description : `Transaction #${id}`}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
              Record Identifier
            </span>
            <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              {id}
            </p>
          </div>
        </div>

        {/* Hero Amount Banner */}
        <div className="p-6 rounded-2xl glass-surface border border-white/80 dark:border-white/10 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
            {transaction ? transaction.type : 'Transaction'} Value
          </span>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : isTransfer
                ? 'text-spendx-blue-primary'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {isIncome ? '+' : isTransfer ? '' : '-'}
            {transactionService.formatINR(transaction?.amount || 850)}
          </div>
          {transaction?.merchantName && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              at {transaction.merchantName}
            </p>
          )}
        </div>

        {/* Grid Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Tag className="w-3.5 h-3.5 text-spendx-blue-primary" />
              <span>Category</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {transaction?.category || 'Shopping'}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Wallet className="w-3.5 h-3.5 text-spendx-purple-primary" />
              <span>Linked Account</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {transaction?.accountName || 'HDFC Bank - Salary'}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              <span>Channel / Method</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {transaction?.paymentMethod || 'UPI'}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Date & Time</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {transaction ? new Date(transaction.date).toLocaleDateString('en-IN') : 'Today'}
            </p>
          </div>
        </div>

        {/* Audit Remarks */}
        {transaction?.notes && (
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <FileText className="w-3.5 h-3.5 text-spendx-blue-primary" />
              <span>Audit Remarks</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {transaction.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
