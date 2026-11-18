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
    <div className="bg-surface rounded-[20px] p-5 sm:p-6 border border-border shadow-card flex items-center gap-4 hover:shadow-elevated hover:border-primary/30 transition-all duration-200 group">
      {/* Horizon Signature Circular Icon Badge */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-xs ${iconColorClass}`}
      >
        <Icon weight="duotone" className="w-7 h-7" />
      </div>

      {/* Metric Content */}
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-secondary-text tracking-wide truncate block">
          {label}
        </span>
        <div
          className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight truncate my-0.5"
          title={dashboardService.formatINR(value)}
        >
          {dashboardService.formatINR(value)}
        </div>
        <div className="flex items-center gap-2 text-xs truncate">
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
    </div>
  );
};
