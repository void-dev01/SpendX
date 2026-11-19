import React from 'react';
import { TrendUp, TrendDown, ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck } from '@phosphor-icons/react';
import { dashboardService } from '@/services/dashboardService';

export interface FinancialSummaryCardProps {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  iconColorClass?: string;
  trendPercentage?: number;
  trendIsPositive?: boolean;
  variant?: 'balance' | 'income' | 'expense' | 'savings';
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  trendPercentage,
  trendIsPositive,
  variant,
}) => {
  // Infer variant from label if not provided explicitly
  const cardVariant =
    variant ||
    (label.toLowerCase().includes('balance')
      ? 'balance'
      : label.toLowerCase().includes('income')
      ? 'income'
      : label.toLowerCase().includes('expense')
      ? 'expense'
      : 'savings');

  if (cardVariant === 'balance') {
    return (
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between relative group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
                {label}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border/80 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
              <Wallet weight="duotone" className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div
            className="text-3xl sm:text-[34px] font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight my-1 truncate"
            title={dashboardService.formatINR(value)}
          >
            {dashboardService.formatINR(value)}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs mt-3">
          <span className="text-secondary-text font-medium truncate">
            {description}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full shrink-0">
            <ShieldCheck weight="bold" className="w-3.5 h-3.5" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    );
  }

  if (cardVariant === 'income') {
    return (
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 border border-border shadow-xs hover:shadow-card hover:border-income/40 transition-all duration-200 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
              {label}
            </span>
            <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowDownRight weight="bold" className="w-5 h-5" />
            </div>
          </div>

          <div
            className="text-2xl sm:text-[28px] font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight my-1 truncate"
            title={dashboardService.formatINR(value)}
          >
            {dashboardService.formatINR(value)}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs mt-3">
          <span className="text-secondary-text font-medium truncate">
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
                <TrendUp weight="bold" className="w-3.5 h-3.5" />
              ) : (
                <TrendDown weight="bold" className="w-3.5 h-3.5" />
              )}
              <span>{trendPercentage > 0 ? `+${trendPercentage}%` : `${trendPercentage}%`}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (cardVariant === 'expense') {
    return (
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 border border-border shadow-xs hover:shadow-card hover:border-expense/40 transition-all duration-200 flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
              {label}
            </span>
            <div className="w-9 h-9 rounded-xl bg-expense/10 text-expense flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowUpRight weight="bold" className="w-5 h-5" />
            </div>
          </div>

          <div
            className="text-2xl sm:text-[28px] font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight my-1 truncate"
            title={dashboardService.formatINR(value)}
          >
            {dashboardService.formatINR(value)}
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs mt-3">
          <span className="text-secondary-text font-medium truncate">
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
                <TrendUp weight="bold" className="w-3.5 h-3.5" />
              ) : (
                <TrendDown weight="bold" className="w-3.5 h-3.5" />
              )}
              <span>{trendPercentage > 0 ? `+${trendPercentage}%` : `${trendPercentage}%`}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default / Savings card
  return (
    <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 border border-border shadow-xs hover:shadow-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text">
            {label}
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border/80 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
            <Icon weight="duotone" className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className="text-2xl sm:text-[28px] font-display font-extrabold tracking-tight tabular-nums text-foreground leading-tight my-1 truncate"
          title={dashboardService.formatINR(value)}
        >
          {dashboardService.formatINR(value)}
        </div>
      </div>

      <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs mt-3">
        <span className="text-secondary-text font-medium truncate">
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
              <TrendUp weight="bold" className="w-3.5 h-3.5" />
            ) : (
              <TrendDown weight="bold" className="w-3.5 h-3.5" />
            )}
            <span>{trendPercentage > 0 ? `+${trendPercentage}%` : `${trendPercentage}%`}</span>
          </div>
        )}
      </div>
    </div>
  );
};
