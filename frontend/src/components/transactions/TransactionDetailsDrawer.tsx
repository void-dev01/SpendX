import React from 'react';
import {
  X,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Wallet,
  Tag,
  CreditCard,
  Building,
  Repeat,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TransactionRecord, transactionService } from '@/services/transactionService';

interface TransactionDetailsDrawerProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
  onEdit: (transaction: TransactionRecord) => void;
  onDelete: (transaction: TransactionRecord) => void;
}

export const TransactionDetailsDrawer: React.FC<TransactionDetailsDrawerProps> = ({
  transaction,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === 'INCOME';
  const isTransfer = transaction.type === 'TRANSFER';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 animate-in fade-in duration-200">
      <div
        className="bg-surface w-full max-w-md h-full border-l border-border shadow-elevated p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Transaction details drawer"
      >
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-income/10 text-income">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Transaction Telemetry
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-secondary-text hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Amount Card */}
          <div className="bg-surface-elevated p-5 rounded-xl border border-border text-center space-y-1.5">
            <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">
              {transaction.type} Amount
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
            <h2 className="text-base font-display font-bold text-foreground pt-1">
              {transaction.description}
            </h2>
            {transaction.merchantName && (
              <p className="text-xs text-secondary-text">
                at {transaction.merchantName}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-xs">
            {/* Category */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <Tag className="w-4 h-4 text-primary" />
                <span>Category</span>
              </div>
              <span className="font-semibold text-foreground">
                {transaction.category}
              </span>
            </div>

            {/* Account */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <Wallet className="w-4 h-4 text-secondary" />
                <span>Account</span>
              </div>
              <span className="font-semibold text-foreground">
                {transaction.accountName}
              </span>
            </div>

            {/* Payment Method */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <CreditCard className="w-4 h-4 text-income" />
                <span>Channel / Method</span>
              </div>
              <span className="font-semibold text-foreground">
                {transaction.paymentMethod}
              </span>
            </div>

            {/* Date & Time */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Timestamp</span>
              </div>
              <span className="font-semibold text-foreground">
                {new Date(transaction.date).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Recurring Status */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary-text">
                <Repeat className="w-4 h-4 text-primary" />
                <span>Cadence</span>
              </div>
              <span className="font-semibold text-foreground">
                {transaction.isRecurring ? 'Recurring Automated Cycle' : 'One-time Payment'}
              </span>
            </div>

            {/* Merchant */}
            {transaction.merchantName && (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary-text">
                  <Building className="w-4 h-4 text-secondary" />
                  <span>Verified Merchant</span>
                </div>
                <span className="font-semibold text-foreground">
                  {transaction.merchantName}
                </span>
              </div>
            )}

            {/* Notes */}
            {transaction.notes && (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border space-y-1">
                <div className="flex items-center gap-2 text-secondary-text">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Audit Notes</span>
                </div>
                <p className="text-foreground leading-relaxed pl-6">
                  {transaction.notes}
                </p>
              </div>
            )}

            {/* Transaction ID */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
              <span className="text-secondary-text">Ledger ID</span>
              <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]">
                {transaction.id}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons at bottom */}
        <div className="space-y-3 pt-6 border-t border-border mt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-medium text-xs text-white bg-primary hover:bg-primary/90 shadow-xs transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(transaction);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <Link
            to={`/transactions/${transaction.id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-secondary-text hover:text-primary transition-colors cursor-pointer"
          >
            <span>Open Dedicated Audit Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
