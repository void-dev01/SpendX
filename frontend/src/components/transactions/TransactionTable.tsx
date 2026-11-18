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
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-income/10 text-income">
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-warning/10 text-warning">
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-expense/10 text-expense">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-[20px] overflow-hidden border border-border shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-surface-elevated">
              <th className="py-3.5 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onSelectAll}
                  aria-label="Select all transactions"
                  className="rounded border-border text-primary focus:ring-primary cursor-pointer w-4 h-4"
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
          <tbody className="divide-y divide-border-subtle text-xs">
            {transactions.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              const isIncome = t.type === 'INCOME';
              const isTransfer = t.type === 'TRANSFER';

              return (
                <tr
                  key={t.id}
                  className={`group transition-colors ${
                    isSelected
                      ? 'bg-primary/10'
                      : 'hover:bg-surface-elevated'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(t.id)}
                      aria-label={`Select transaction ${t.description}`}
                      className="rounded border-border text-primary focus:ring-primary cursor-pointer w-4 h-4"
                    />
                  </td>

                  {/* Transaction Title & Merchant */}
                  <td
                    className="py-3 px-3 cursor-pointer"
                    onClick={() => onViewDetails(t)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                          isIncome
                            ? 'bg-income/10 text-income'
                            : isTransfer
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-elevated text-secondary-text border border-border-subtle'
                        }`}
                      >
                        {getCategoryIcon(t.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {t.description}
                          </p>
                          {t.isRecurring && (
                            <span title="Recurring automated transaction">
                              <Repeat className="w-3 h-3 text-secondary shrink-0" />
                            </span>
                          )}
                        </div>
                        {t.merchantName && (
                          <p className="text-[11px] text-secondary-text truncate">
                            {t.merchantName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-elevated border border-border-subtle text-secondary-text whitespace-nowrap">
                      {t.category}
                    </span>
                  </td>

                  {/* Account */}
                  <td className="py-3 px-3 text-secondary-text whitespace-nowrap">
                    <span className="font-medium text-foreground">{t.accountName}</span>
                    <span className="block text-[10px] text-muted-foreground">{t.paymentMethod}</span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 text-secondary-text whitespace-nowrap">
                    <span>{new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {new Date(t.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  {/* Type & Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          isIncome
                            ? 'text-income'
                            : isTransfer
                            ? 'text-primary'
                            : 'text-secondary-text'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-3 h-3 text-income" />
                        ) : isTransfer ? (
                          <ArrowLeftRight className="w-3 h-3 text-primary" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-expense" />
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
                          ? 'text-income'
                          : isTransfer
                          ? 'text-primary'
                          : 'text-foreground'
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
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
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
                        <div className="absolute right-4 top-10 z-30 w-40 rounded-xl bg-surface border border-border p-1.5 shadow-elevated text-left animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewDetails(t);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated hover:text-primary transition-colors cursor-pointer"
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
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated hover:text-primary transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <div className="my-1 border-t border-border" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDelete(t);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-expense hover:bg-expense/10 transition-colors cursor-pointer"
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
