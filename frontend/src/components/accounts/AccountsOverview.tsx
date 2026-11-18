import React from 'react';
import { Wallet, Building2, Banknote, CreditCard } from 'lucide-react';
import { AccountsOverviewMetrics, accountService } from '@/services/accountService';

interface AccountsOverviewProps {
  metrics: AccountsOverviewMetrics;
}

export const AccountsOverview: React.FC<AccountsOverviewProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Balance */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Wallet className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Total Balance
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
              {accountService.formatINR(metrics.totalAssets)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Combined liquid assets & deposits
          </div>
        </div>
      </div>

      {/* 2. Total Bank Balance */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Bank & Savings
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
              {accountService.formatINR(metrics.totalBankBalance)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Checking & savings institutions
          </div>
        </div>
      </div>

      {/* 3. Cash Balance */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <Banknote className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Cash Balance
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-secondary tabular-nums truncate block">
              {accountService.formatINR(metrics.totalCashBalance)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Physical wallets on hand
          </div>
        </div>
      </div>

      {/* 4. Credit Card Outstanding */}
      <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex items-center gap-4 group hover:shadow-elevated transition-all">
        <div className="w-14 h-14 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <CreditCard className="w-7 h-7" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block truncate">
            Credit Card Outstanding
          </span>
          <div className="my-0.5">
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-warning tabular-nums truncate block">
              {accountService.formatINR(metrics.creditCardOutstanding)}
            </span>
          </div>
          <div className="text-xs text-secondary-text truncate">
            Total payable liability
          </div>
        </div>
      </div>
    </div>
  );
};
