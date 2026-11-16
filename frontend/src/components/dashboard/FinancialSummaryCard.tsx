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
    <div className="glass-card-interactive p-5 sm:p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-sm ${iconColorClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Center: Financial Value */}
      <div className="my-4">
        <div
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums leading-none ${
            label.toLowerCase().includes('balance') ||
            label.toLowerCase().includes('net worth') ||
            label.toLowerCase().includes('savings')
              ? 'text-gradient-wealth'
              : 'text-foreground'
          }`}
        >
          {dashboardService.formatINR(value)}
        </div>
      </div>

      {/* Bottom: Description & optional Trend */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-black/5 dark:border-white/10 text-xs">
        <span className="text-xs text-muted-foreground truncate font-medium">
          {description}
        </span>

        {trendPercentage !== undefined && (
          <div
            className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-lg shrink-0 ${
              trendIsPositive
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10'
                : 'text-rose-700 dark:text-rose-300 bg-rose-500/10'
            }`}
          >
            {trendIsPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
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
