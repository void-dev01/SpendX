import React from 'react';
import { Wallet, TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { OverviewMetrics } from '@/services/dashboardService';
import { FinancialSummaryCard } from './FinancialSummaryCard';

interface FinancialSummaryGridProps {
  overview: OverviewMetrics;
}

export const FinancialSummaryGrid: React.FC<FinancialSummaryGridProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Balance */}
      <FinancialSummaryCard
        label={overview.totalBalance.label}
        value={overview.totalBalance.value}
        description={overview.totalBalance.description}
        icon={Wallet}
        iconColorClass="bg-spendx-blue-primary/10 text-spendx-blue-primary dark:bg-spendx-blue-primary/20 dark:text-spendx-blue-primary"
        trendPercentage={overview.totalBalance.trendPercentage}
        trendIsPositive={overview.totalBalance.trendIsPositive}
      />

      {/* 2. Total Income */}
      <FinancialSummaryCard
        label={overview.totalIncome.label}
        value={overview.totalIncome.value}
        description={overview.totalIncome.description}
        icon={TrendingUp}
        iconColorClass="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        trendPercentage={overview.totalIncome.trendPercentage}
        trendIsPositive={overview.totalIncome.trendIsPositive}
      />

      {/* 3. Total Expenses */}
      <FinancialSummaryCard
        label={overview.totalExpenses.label}
        value={overview.totalExpenses.value}
        description={overview.totalExpenses.description}
        icon={TrendingDown}
        iconColorClass="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
        trendPercentage={overview.totalExpenses.trendPercentage}
        trendIsPositive={overview.totalExpenses.trendIsPositive}
      />

      {/* 4. Available Balance */}
      <FinancialSummaryCard
        label={overview.availableBalance.label}
        value={overview.availableBalance.value}
        description={overview.availableBalance.description}
        icon={IndianRupee}
        iconColorClass="bg-spendx-purple-primary/10 text-spendx-purple-primary dark:bg-spendx-purple-primary/20 dark:text-spendx-purple-primary"
        trendPercentage={overview.availableBalance.trendPercentage}
        trendIsPositive={overview.availableBalance.trendIsPositive}
      />
    </div>
  );
};
