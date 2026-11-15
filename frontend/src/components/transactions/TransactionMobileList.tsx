import React, { useState } from 'react';
import {
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

interface TransactionMobileListProps {
  transactions: TransactionRecord[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onViewDetails: (transaction: TransactionRecord) => void;
  onEdit: (transaction: TransactionRecord) => void;
  onDelete: (transaction: TransactionRecord) => void;
}

export const TransactionMobileList: React.FC<TransactionMobileListProps> = ({
  transactions,
  selectedIds,
  onSelectToggle,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return <Utensils className="w-4 h-4" />;
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Transport':
        return <Car className="w-4 h-4" />;
      case 'Bills & Utilities':
        return <Zap className="w-4 h-4" />;
      case 'Entertainment':
        return <Film className="w-4 h-4" />;
      case 'Healthcare':
        return <HeartPulse className="w-4 h-4" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4" />;
      case 'Salary':
      case 'Freelance':
      case 'Business':
        return <Briefcase className="w-4 h-4" />;
      case 'Housing & Rent':
        return <Home className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {transactions.map((t) => {
        const isSelected = selectedIds.includes(t.id);
        const isIncome = t.type === 'INCOME';
        const isTransfer = t.type === 'TRANSFER';

        return (
          <div
            key={t.id}
            className={`glass-panel p-4 rounded-2xl border transition-all ${
              isSelected
                ? 'border-spendx-blue-primary bg-spendx-blue-primary/10 dark:bg-spendx-blue-primary/20 shadow-md'
                : 'border-white/80 dark:border-white/10'
            }`}
          >
            {/* Top Row: Checkbox, Title, Amount & Menu */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectToggle(t.id)}
                  aria-label={`Select ${t.description}`}
                  className="rounded border-slate-300 dark:border-slate-600 text-spendx-blue-primary focus:ring-spendx-blue-primary cursor-pointer w-4 h-4 mt-1"
                />

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

                <div className="min-w-0" onClick={() => onViewDetails(t)}>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                      {t.description}
                    </h3>
                    {t.isRecurring && (
                      <Repeat className="w-3 h-3 text-spendx-purple-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {t.merchantName || t.accountName}
                  </p>
                </div>
              </div>

              {/* Amount & Menu */}
              <div className="flex items-center gap-1 text-right shrink-0">
                <span
                  className={`font-bold text-sm tabular-nums ${
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

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                    aria-label="Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === t.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 top-8 z-30 w-36 rounded-xl glass-panel border border-white/80 dark:border-white/15 p-1.5 shadow-xl text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewDetails(t);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
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
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onDelete(t);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Meta Row */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-slate-100/60 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {t.category}
                </span>
                <span>•</span>
                <span>{t.accountName}</span>
              </div>

              <span>
                {new Date(t.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
