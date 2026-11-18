import React from 'react';
import { Wallet, TrendUp, TrendDown, CurrencyInr } from '@phosphor-icons/react';
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
        iconColorClass="bg-primary/10 text-primary"
        trendPercentage={overview.totalBalance.trendPercentage}
        trendIsPositive={overview.totalBalance.trendIsPositive}
      />

      {/* 2. Total Income */}
      <FinancialSummaryCard
        label={overview.totalIncome.label}
        value={overview.totalIncome.value}
        description={overview.totalIncome.description}
        icon={TrendUp}
        iconColorClass="bg-income/10 text-income"
        trendPercentage={overview.totalIncome.trendPercentage}
        trendIsPositive={overview.totalIncome.trendIsPositive}
      />

      {/* 3. Total Expenses */}
      <FinancialSummaryCard
        label={overview.totalExpenses.label}
        value={overview.totalExpenses.value}
        description={overview.totalExpenses.description}
        icon={TrendDown}
        iconColorClass="bg-expense/10 text-expense"
        trendPercentage={overview.totalExpenses.trendPercentage}
        trendIsPositive={overview.totalExpenses.trendIsPositive}
      />

      {/* 4. Available Balance */}
      <FinancialSummaryCard
        label={overview.availableBalance.label}
        value={overview.availableBalance.value}
        description={overview.availableBalance.description}
        icon={CurrencyInr}
        iconColorClass="bg-secondary/10 text-secondary"
        trendPercentage={overview.availableBalance.trendPercentage}
        trendIsPositive={overview.availableBalance.trendIsPositive}
      />
    </div>
  );
};
