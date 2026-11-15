import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Home,
  Receipt,
  Repeat,
} from 'lucide-react';
import { TransactionRecord, transactionService } from '@/services/transactionService';

interface TransactionTableProps {
  transactions: TransactionRecord[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (transaction: TransactionRecord) => void;
  onEdit: (transaction: TransactionRecord) => void;
  onDelete: (transaction: TransactionRecord) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAllSelected =
    transactions.length > 0 && transactions.every((t) => selectedIds.includes(t.id));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'Shopping':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'Transport':
        return <Car className="w-3.5 h-3.5" />;
      case 'Bills & Utilities':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Entertainment':
        return <Film className="w-3.5 h-3.5" />;
      case 'Healthcare':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Education':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Salary':
      case 'Freelance':
      case 'Business':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Housing & Rent':
        return <Home className="w-3.5 h-3.5" />;
      default:
        return <Receipt className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/80 dark:border-white/10 shadow-glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100/80 dark:border-white/5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-white/30 dark:bg-white/[0.02]">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  aria-label="Select all transactions"
                  className="rounded border-slate-300 dark:border-slate-600 text-spendx-blue-primary focus:ring-spendx-blue-primary cursor-pointer w-4 h-4"
                />
              </th>
              <th className="py-3.5 px-3">Transaction</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3">Account</th>
              <th className="py-3.5 px-3">Date</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3 text-right">Amount</th>
              <th className="py-3.5 pl-2 pr-4 w-12 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50 dark:divide-white/5 text-xs">
            {transactions.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              const isIncome = t.type === 'INCOME';
              const isTransfer = t.type === 'TRANSFER';

              return (
                <tr
                  key={t.id}
                  className={`group transition-colors ${
                    isSelected
                      ? 'bg-spendx-blue-primary/10 dark:bg-spendx-blue-primary/20'
                      : 'hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(t.id)}
                      aria-label={`Select transaction ${t.description}`}
                      className="rounded border-slate-300 dark:border-slate-600 text-spendx-blue-primary focus:ring-spendx-blue-primary cursor-pointer w-4 h-4"
                    />
                  </td>

                  {/* Transaction Title & Merchant */}
                  <td
                    className="py-3 px-3 cursor-pointer"
                    onClick={() => onViewDetails(t)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : isTransfer
                            ? 'bg-spendx-blue-primary/10 text-spendx-blue-primary'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {getCategoryIcon(t.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-spendx-blue-primary transition-colors">
                            {t.description}
                          </p>
                          {t.isRecurring && (
                            <span title="Recurring automated transaction">
                              <Repeat className="w-3 h-3 text-spendx-purple-primary shrink-0" />
                            </span>
                          )}
                        </div>
                        {t.merchantName && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {t.merchantName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {t.category}
                    </span>
                  </td>

                  {/* Account */}
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span className="font-medium">{t.accountName}</span>
                    <span className="block text-[10px] text-slate-400">{t.paymentMethod}</span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <span>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(t.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  {/* Type & Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : isTransfer
                            ? 'text-spendx-blue-primary'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                        ) : isTransfer ? (
                          <ArrowLeftRight className="w-3 h-3 text-spendx-blue-primary" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-rose-500" />
                        )}
                        {t.type}
                      </span>
                      <div>{getStatusBadge(t.status)}</div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold text-sm tabular-nums whitespace-nowrap ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isTransfer
                          ? 'text-spendx-blue-primary'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : isTransfer ? '' : '-'}
                      {transactionService.formatINR(t.amount)}
                    </span>
                  </td>

                  {/* Actions Menu */}
                  <td className="py-3 pl-2 pr-4 text-center relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                      aria-label="Transaction actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Dropdown */}
                    {activeMenuId === t.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-4 top-10 z-30 w-40 rounded-xl glass-panel border border-white/80 dark:border-white/15 p-1.5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewDetails(t);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10 hover:text-spendx-blue-primary transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEdit(t);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10 hover:text-spendx-blue-primary transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <div className="my-1 border-t border-slate-100/60 dark:border-white/5" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(t);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
