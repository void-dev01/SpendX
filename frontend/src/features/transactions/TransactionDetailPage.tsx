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

  if (!transaction) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Transactions Ledger</span>
          </Link>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-border shadow-card text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border flex items-center justify-center mx-auto text-secondary-text">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-display font-bold text-foreground">
              Transaction Not Found
            </h1>
            <p className="text-xs text-secondary-text max-w-sm mx-auto">
              The requested transaction identifier <span className="font-mono font-medium text-foreground">{id}</span> does not exist or has been removed.
            </p>
          </div>
          <div>
            <Link
              to="/transactions"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Return to Ledger
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isIncome = transaction.type === 'INCOME';
  const isTransfer = transaction.type === 'TRANSFER';

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
              {transaction.description}
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
            {transaction.type} Value
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
            {transactionService.formatINR(transaction.amount)}
          </div>
          {transaction.merchantName && (
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
              {transaction.category}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <Wallet className="w-3.5 h-3.5 text-secondary" />
              <span>Linked Account</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction.accountName || 'Primary Account'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <CreditCard className="w-3.5 h-3.5 text-income" />
              <span>Channel / Method</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {transaction.paymentMethod || 'Direct / UPI'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <div className="flex items-center gap-1.5 text-secondary-text font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Date & Time</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {new Date(transaction.date).toLocaleDateString('en-IN')}
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
