import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { dashboardService, DateRangePeriod } from '@/services/dashboardService';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FinancialSummaryGrid } from '@/components/dashboard/FinancialSummaryGrid';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { SpendingAnalytics } from '@/components/dashboard/SpendingAnalytics';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SavingsGoalsWidget } from '@/components/dashboard/SavingsGoalsWidget';
import { AIInsightsWidget } from '@/components/dashboard/AIInsightsWidget';
import { UpcomingPayments } from '@/components/dashboard/UpcomingPayments';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangePeriod>('this_month');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['dashboard', selectedPeriod],
    queryFn: () => dashboardService.getDashboardData(selectedPeriod),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="glass-panel p-8 rounded-3xl max-w-xl mx-auto my-12 text-center space-y-4 border border-rose-500/20">
        <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Unable to Load Financial Overview
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {error instanceof Error ? error.message : 'An error occurred while fetching cashflow telemetry.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-spendx-blue-primary hover:bg-spendx-blue-primary/90 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Retry Connection
        </button>
      </div>
    );
  }

  // Check if completely empty (new user with 0 balance, 0 transactions)
  const isCompletelyEmpty =
    !data.isDemo &&
    data.overview.totalBalance.value === 0 &&
    data.recentTransactions.length === 0;

  if (isCompletelyEmpty) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          userDisplayName={data.userDisplayName}
          isDemo={data.isDemo}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <DashboardEmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Welcome Header & Date Range Filter */}
      <DashboardHeader
        userDisplayName={data.userDisplayName}
        isDemo={data.isDemo}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* 2. Financial Overview / Summary Cards */}
      <FinancialSummaryGrid overview={data.overview} />

      {/* 3 & 4. Income vs Expense Chart (2 cols) & Spending Analytics (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ErrorBoundary fallbackTitle="Income vs Expense Chart Unavailable">
            <IncomeExpenseChart data={data.incomeVsExpense} />
          </ErrorBoundary>
        </div>
        <div className="lg:col-span-1">
          <ErrorBoundary fallbackTitle="Spending Analytics Unavailable">
            <SpendingAnalytics
              totalSpent={data.spendingAnalytics.totalSpent}
              categories={data.spendingAnalytics.categories}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* 5 & 6. Recent Transactions (2 cols) & Budget Overview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <div className="lg:col-span-1">
          <BudgetOverview budgets={data.budgets} />
        </div>
      </div>

      {/* 7, 8, 9. Savings Goals (1 col), AI Financial Insights (1 col), Upcoming Payments (1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <SavingsGoalsWidget goals={data.savingsGoals} />
        </div>
        <div className="col-span-1">
          <AIInsightsWidget insights={data.aiInsights} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <UpcomingPayments payments={data.upcomingPayments} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
