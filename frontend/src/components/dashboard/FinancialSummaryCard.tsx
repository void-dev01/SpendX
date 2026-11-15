import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';

interface FinancialSummaryCardProps {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColorClass: string;
  trendPercentage?: number;
  trendIsPositive?: boolean;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  iconColorClass,
  trendPercentage,
  trendIsPositive,
}) => {
  return (
    <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${iconColorClass}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Center: Financial Value */}
      <div className="mt-4 mb-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
          {dashboardService.formatINR(value)}
        </div>
      </div>

      {/* Bottom: Description & optional Trend */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-100/60 dark:border-white/5 text-xs">
        <span className="text-slate-500 dark:text-slate-400 truncate">
          {description}
        </span>

        {trendPercentage !== undefined && (
          <div
            className={`inline-flex items-center gap-0.5 font-semibold text-[11px] px-1.5 py-0.5 rounded-md shrink-0 ${
              trendIsPositive
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                : 'text-rose-700 dark:text-rose-300 bg-rose-500/10'
            }`}
          >
            {trendIsPositive ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
            )}
            <span>
              {trendPercentage > 0 ? `+${trendPercentage}%` : `${trendPercentage}%`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
