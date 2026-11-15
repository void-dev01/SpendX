import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  ShoppingBag,
  Car,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Home,
  Tag,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  AlertTriangle,
} from 'lucide-react';
import { BudgetWithMetrics, budgetService } from '@/services/budgetService';

interface CategoryBudgetCardProps {
  budget: BudgetWithMetrics;
  onEdit: (budget: BudgetWithMetrics) => void;
  onDelete: (budget: BudgetWithMetrics) => void;
}

export const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Food & Dining':
        return <Utensils className="w-5 h-5 text-spendx-blue-primary" />;
      case 'Shopping':
        return <ShoppingBag className="w-5 h-5 text-spendx-purple-primary" />;
      case 'Transport':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'Bills & Utilities':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Entertainment':
        return <Film className="w-5 h-5 text-purple-500" />;
      case 'Healthcare':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'Education':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      case 'Travel':
        return <Plane className="w-5 h-5 text-emerald-500" />;
      case 'Housing & Rent':
        return <Home className="w-5 h-5 text-teal-500" />;
      default:
        return <Tag className="w-5 h-5 text-spendx-blue-primary" />;
    }
  };

  const getStatusBadge = () => {
    if (budget.status === 'EXCEEDED') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
          <AlertTriangle className="w-3 h-3" /> Exceeded ({budget.utilizationPercentage}%)
        </span>
      );
    }
    if (budget.status === 'NEAR_LIMIT') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
          Near Limit ({budget.utilizationPercentage}%)
        </span>
      );
    }
    if (budget.status === 'APPROACHING') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
          Approaching ({budget.utilizationPercentage}%)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-spendx-blue-primary bg-spendx-blue-primary/10 px-2 py-0.5 rounded-md">
        On Track ({budget.utilizationPercentage}%)
      </span>
    );
  };

  const getProgressBarColor = () => {
    if (budget.status === 'EXCEEDED') return 'bg-rose-500';
    if (budget.status === 'NEAR_LIMIT' || budget.status === 'APPROACHING')
      return 'bg-amber-500';
    return 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary';
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass flex flex-col justify-between relative group hover:border-spendx-blue-primary/40 transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
            {getCategoryIcon(budget.category)}
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {budget.category}
            </span>
            <h3
              onClick={() => navigate(`/budgets/${budget.id}`)}
              className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple hover:text-spendx-blue-primary transition-colors cursor-pointer truncate max-w-[170px]"
            >
              {budget.name}
            </h3>
          </div>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Budget actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl glass-panel border border-white/80 dark:border-white/15 p-1.5 shadow-xl text-left">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/budgets/${budget.id}`);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(budget);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <div className="my-1 border-t border-slate-100/60 dark:border-white/5" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(budget);
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

      {/* Progress Bar & Status */}
      <div className="my-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {budgetService.formatINR(budget.spent)}
          </span>
          <span className="text-xs text-slate-400">
            of {budgetService.formatINR(budget.allocatedAmount)}
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-200/60 dark:bg-slate-700/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div>{getStatusBadge()}</div>
          <span className="text-slate-400 text-[11px]">
            {budget.matchingTransactionCount} txns
          </span>
        </div>
      </div>

      {/* Bottom Footer: Remaining & Deep link */}
      <div className="pt-3 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Remaining:{' '}
          <strong
            className={`tabular-nums ${
              budget.status === 'EXCEEDED' ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {budgetService.formatINR(budget.remaining)}
          </strong>
        </span>

        <button
          type="button"
          onClick={() => navigate(`/budgets/${budget.id}`)}
          className="inline-flex items-center gap-1 font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <span>Audit</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
