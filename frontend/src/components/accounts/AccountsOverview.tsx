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
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs flex flex-col justify-between group hover:border-primary/40 hover:shadow-card transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Total Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs text-foreground group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {accountService.formatINR(metrics.totalAssets)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Combined liquid assets & deposits
          </div>
        </div>
      </div>

      {/* 2. Total Bank Balance */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs flex flex-col justify-between group hover:border-income/40 hover:shadow-card transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Bank & Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-income tabular-nums truncate block">
            {accountService.formatINR(metrics.totalBankBalance)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Checking & savings institutions
          </div>
        </div>
      </div>

      {/* 3. Cash Balance */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs flex flex-col justify-between group hover:border-primary/40 hover:shadow-card transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Cash Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <Banknote className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums truncate block">
            {accountService.formatINR(metrics.totalCashBalance)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Physical wallets on hand
          </div>
        </div>
      </div>

      {/* 4. Credit Card Outstanding */}
      <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs flex flex-col justify-between group hover:border-warning/40 hover:shadow-card transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-text truncate block">
            Credit Card Outstanding
          </span>
          <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-warning tabular-nums truncate block">
            {accountService.formatINR(metrics.creditCardOutstanding)}
          </span>
          <div className="text-xs text-secondary-text truncate mt-1">
            Total payable liability
          </div>
        </div>
      </div>
    </div>
  );
};
