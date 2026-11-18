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
            className={`bg-surface p-4 rounded-[20px] border transition-all ${
              isSelected
                ? 'border-primary bg-primary/10 shadow-elevated'
                : 'border-border shadow-card'
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
                  className="rounded border-border text-primary focus:ring-primary cursor-pointer w-4 h-4 mt-1"
                />

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

                <div className="min-w-0" onClick={() => onViewDetails(t)}>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {t.description}
                    </h3>
                    {t.isRecurring && (
                      <Repeat className="w-3 h-3 text-secondary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-secondary-text truncate mt-0.5">
                    {t.merchantName || t.accountName}
                  </p>
                </div>
              </div>

              {/* Amount & Menu */}
              <div className="flex items-center gap-1 text-right shrink-0">
                <span
                  className={`font-bold text-sm tabular-nums ${
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

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
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
                      <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-surface border border-border p-1.5 shadow-elevated text-left">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            onViewDetails(t);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
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
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
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
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-expense hover:bg-expense/10 transition-colors"
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
            <div className="flex items-center justify-between text-xs text-secondary-text pt-3 mt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border-subtle text-[11px] font-medium text-secondary-text">
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
