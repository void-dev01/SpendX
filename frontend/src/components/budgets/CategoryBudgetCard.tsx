import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Film,
  Zap,
  HeartPulse,
  Tag,
  AlertTriangle,
  ShieldCheck,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
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

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('dining') || cat.includes('grocery'))
      return <Utensils className="w-5 h-5 text-primary" />;
    if (cat.includes('shop'))
      return <ShoppingBag className="w-5 h-5 text-secondary" />;
    if (cat.includes('hous') || cat.includes('rent'))
      return <Home className="w-5 h-5 text-income" />;
    if (cat.includes('transport') || cat.includes('fuel'))
      return <Car className="w-5 h-5 text-amber-500" />;
    if (cat.includes('entertain'))
      return <Film className="w-5 h-5 text-primary" />;
    if (cat.includes('util') || cat.includes('bill'))
      return <Zap className="w-5 h-5 text-amber-500" />;
    if (cat.includes('health') || cat.includes('med'))
      return <HeartPulse className="w-5 h-5 text-expense" />;
    return <Tag className="w-5 h-5 text-primary" />;
  };

  const getStatusBadge = () => {
    switch (budget.status) {
      case 'EXCEEDED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
            <AlertTriangle className="w-3 h-3" /> Exceeded (
            {budget.utilizationPercentage}%)
          </span>
        );
      case 'NEAR_LIMIT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Near Limit (
            {budget.utilizationPercentage}%)
          </span>
        );
      case 'APPROACHING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {budget.utilizationPercentage}%
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-income bg-income/10 px-2 py-0.5 rounded-full border border-income/20">
            <ShieldCheck className="w-3 h-3" /> On Track (
            {budget.utilizationPercentage}%)
          </span>
        );
    }
  };

  const getProgressBarColor = () => {
    if (budget.status === 'EXCEEDED') return 'bg-destructive';
    if (budget.status === 'NEAR_LIMIT' || budget.status === 'APPROACHING')
      return 'bg-amber-500';
    return 'bg-primary';
  };

  return (
    <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:border-primary/40 hover:shadow-card flex flex-col justify-between relative group transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs">
            {getCategoryIcon(budget.category)}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-text block">
              {budget.category}
            </span>
            <h3
              onClick={() => navigate(`/budgets/${budget.id}`)}
              className="text-base font-display font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate max-w-[170px] leading-tight"
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
            className="p-1.5 rounded-lg text-secondary-text hover:text-foreground hover:bg-surface-subtle dark:hover:bg-[#242C23] transition-colors cursor-pointer"
            aria-label="Budget actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-card dark:bg-[#1B211B] border border-border p-1.5 shadow-elevated text-left">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/budgets/${budget.id}`);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-subtle dark:hover:bg-[#242C23] cursor-pointer"
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
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(budget);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
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
      <div className="my-4 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-display font-extrabold text-foreground tabular-nums tracking-tight">
            {budgetService.formatINR(budget.spent)}
          </span>
          <span className="text-xs text-secondary-text font-medium">
            of {budgetService.formatINR(budget.allocatedAmount)}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-elevated border border-border overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div>{getStatusBadge()}</div>
          <span className="text-secondary-text text-[11px] font-medium">
            {budget.matchingTransactionCount} txns
          </span>
        </div>
      </div>

      {/* Bottom Footer: Remaining & Deep link */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-secondary-text font-medium">
          Remaining:{' '}
          <strong
            className={`tabular-nums font-bold ${
              budget.status === 'EXCEEDED' ? 'text-expense' : 'text-income'
            }`}
          >
            {budgetService.formatINR(budget.remaining)}
          </strong>
        </span>

        <button
          type="button"
          onClick={() => navigate(`/budgets/${budget.id}`)}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline transition-colors cursor-pointer"
        >
          <span>Audit</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
