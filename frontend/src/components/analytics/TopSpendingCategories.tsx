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
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Top Spending Categories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked by overall volume of expenditures
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
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
            className="p-3 rounded-2xl glass-surface border border-white/60 dark:border-white/5 hover:border-spendx-blue-primary/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-spendx-blue-primary/10 text-spendx-blue-primary font-bold flex items-center justify-center text-[11px] shrink-0">
                #{cat.rank}
              </span>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-spendx-blue-primary transition-colors block">
                  {cat.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.transactionCount} transactions • {cat.percentage}% of expenses
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {analyticsService.formatINR(cat.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
