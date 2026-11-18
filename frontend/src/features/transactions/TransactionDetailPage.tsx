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
        <div className="h-6 w-48 bg-surface-elevated border border-border rounded-lg" />
        <div className="bg-surface border border-border rounded-2xl p-6 h-64 shadow-card" />
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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Transactions Ledger</span>
        </Link>
      </div>

      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-income/10 text-income">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Verified Ledger Audit Entry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mt-1">
              {transaction ? transaction.description : `Transaction #${id}`}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
              Record Identifier
            </span>
            <p className="text-xs font-mono font-medium text-foreground">
              {id}
            </p>
          </div>
        </div>

        {/* Hero Amount Banner */}
        <div className="p-6 rounded-xl bg-surface-elevated border border-border text-center space-y-1">
          <span className="text-xs text-secondary-text uppercase font-medium tracking-wider">
            {transaction ? transaction.type : 'Transaction'} Value
          </span>
          <div
            className={`text-3xl sm:text-4xl font-display font-extrabold tracking-tight tabular-nums ${
              isIncome
                ? 'text-income'
                : isTransfer
                ? 'text-primary'
                : 'text-foreground'
            }`}
          >
            {isIncome ? '+' : isTransfer ? '' : '-'}
            {transactionService.formatINR(transaction?.amount || 850)}
          </div>
          {transaction?.merchantName && (
            <p className="text-xs text-secondary-text">
              at {transaction.merchantName}
            </p>
          )}
        </div>

        {/* Grid Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Category</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction?.category || 'Shopping'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <Wallet className="w-3.5 h-3.5 text-secondary" />
              <span>Linked Account</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction?.accountName || 'HDFC Bank - Salary'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <CreditCard className="w-3.5 h-3.5 text-income" />
              <span>Channel / Method</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction?.paymentMethod || 'UPI'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Date & Time</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction ? new Date(transaction.date).toLocaleDateString('en-IN') : 'Today'}
            </p>
          </div>
        </div>

        {/* Audit Remarks */}
        {transaction?.notes && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-secondary-text font-medium">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Audit Remarks</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {transaction.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
