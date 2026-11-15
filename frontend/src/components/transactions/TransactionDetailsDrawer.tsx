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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="glass-panel w-full max-w-md h-full border-l border-white/90 dark:border-white/15 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Transaction details drawer"
      >
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transaction Telemetry
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Amount Card */}
          <div className="glass-surface p-5 rounded-2xl border border-white/80 dark:border-white/10 text-center space-y-1.5">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {transaction.type} Amount
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
              {transactionService.formatINR(transaction.amount)}
            </div>
            <h2 className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple pt-1">
              {transaction.description}
            </h2>
            {transaction.merchantName && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                at {transaction.merchantName}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-xs">
            {/* Category */}
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Tag className="w-4 h-4 text-spendx-blue-primary" />
                <span>Category</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {transaction.category}
              </span>
            </div>

            {/* Account */}
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Wallet className="w-4 h-4 text-spendx-purple-primary" />
                <span>Account</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {transaction.accountName}
              </span>
            </div>

            {/* Payment Method */}
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Channel / Method</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {transaction.paymentMethod}
              </span>
            </div>

            {/* Date & Time */}
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Timestamp</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
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
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Repeat className="w-4 h-4 text-spendx-blue-primary" />
                <span>Cadence</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {transaction.isRecurring ? 'Recurring Automated Cycle' : 'One-time Payment'}
              </span>
            </div>

            {/* Merchant */}
            {transaction.merchantName && (
              <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Building className="w-4 h-4 text-rose-500" />
                  <span>Verified Merchant</span>
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {transaction.merchantName}
                </span>
              </div>
            )}

            {/* Notes */}
            {transaction.notes && (
              <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <FileText className="w-4 h-4 text-spendx-blue-primary" />
                  <span>Audit Notes</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed pl-6">
                  {transaction.notes}
                </p>
              </div>
            )}

            {/* Transaction ID */}
            <div className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Ledger ID</span>
              <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                {transaction.id}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons at bottom */}
        <div className="space-y-3 pt-6 border-t border-slate-100/60 dark:border-white/10 mt-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(transaction);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs text-white bg-spendx-blue-primary hover:bg-spendx-blue-primary/90 shadow-sm transition-all cursor-pointer"
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
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <Link
            to={`/transactions/${transaction.id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-spendx-blue-primary transition-colors cursor-pointer"
          >
            <span>Open Dedicated Audit Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
