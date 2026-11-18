import React from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import { dashboardService } from '@/services/dashboardService';

interface FinancialSummaryCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
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
    <div className="bg-surface rounded-2xl p-5 border border-border shadow-card flex flex-col justify-between hover:shadow-elevated hover:border-primary/30 transition-all duration-200 group">
      {/* Top row: Label & Squircle Icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs ${iconColorClass}`}
        >
          <Icon weight="duotone" className="w-5 h-5" />
        </div>
      </div>

      {/* Center: Financial Value (Lining & Tabular Numerals) */}
      <div className="my-3 min-w-0">
        <div
          className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight truncate"
          title={dashboardService.formatINR(value)}
        >
          {dashboardService.formatINR(value)}
        </div>
      </div>

      {/* Bottom: Description & optional Trend */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border text-xs">
        <span className="text-xs text-secondary-text truncate font-medium">
          {description}
        </span>

        {trendPercentage !== undefined && (
          <div
            className={`inline-flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded-lg shrink-0 ${
              trendIsPositive
                ? 'text-income bg-income/10'
                : 'text-expense bg-expense/10'
            }`}
          >
            {trendIsPositive ? (
              <TrendUp weight="bold" className="w-3.5 h-3.5 text-income" />
            ) : (
              <TrendDown weight="bold" className="w-3.5 h-3.5 text-expense" />
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
