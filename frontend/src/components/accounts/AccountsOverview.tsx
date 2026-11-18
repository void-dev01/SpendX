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
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums">
            {accountService.formatINR(metrics.totalAssets)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Combined liquid assets & deposits
        </div>
      </div>

      {/* 2. Total Bank Balance */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bank & Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums">
            {accountService.formatINR(metrics.totalBankBalance)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Checking & savings institutions
        </div>
      </div>

      {/* 3. Cash Balance */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cash Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-secondary tabular-nums">
            {accountService.formatINR(metrics.totalCashBalance)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Physical wallets on hand
        </div>
      </div>

      {/* 4. Credit Card Outstanding */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between group hover:shadow-elevated transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Credit Card Outstanding
          </span>
          <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-warning tabular-nums">
            {accountService.formatINR(metrics.creditCardOutstanding)}
          </span>
        </div>
        <div className="text-xs text-secondary-text pt-2 border-t border-border truncate">
          Total payable liability (not an asset)
        </div>
      </div>
    </div>
  );
};
