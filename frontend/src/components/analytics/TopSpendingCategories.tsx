import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  CategoryBreakdownItem,
  analyticsService,
} from '@/services/analyticsService';

interface TopSpendingCategoriesProps {
  categories: Array<CategoryBreakdownItem & { rank: number }>;
}

export const TopSpendingCategories: React.FC<TopSpendingCategoriesProps> = ({
  categories,
}) => {
  const navigate = useNavigate();

  if (categories.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            Top Spending Categories
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Ranked by overall volume of expenditures
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <span>Ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => (
          <div
            key={cat.category}
            onClick={() => navigate(`/transactions?category=${encodeURIComponent(cat.category)}`)}
            className="p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between text-xs group"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-[11px] shrink-0">
                #{cat.rank}
              </span>
              <div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors block">
                  {cat.category}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {cat.transactionCount} transactions • {cat.percentage}% of expenses
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-foreground tabular-nums">
                {analyticsService.formatINR(cat.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
