import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, RefreshCw } from 'lucide-react';
import { transactionService } from '@/services/transactionService';
import { accountService } from '@/services/accountService';
import { budgetService } from '@/services/budgetService';
import { savingsService } from '@/services/savingsService';
import {
  AnalyticsFiltersState,
  analyticsService,
} from '@/services/analyticsService';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { IncomeBreakdown } from '@/components/analytics/IncomeBreakdown';
import { SpendingTrends } from '@/components/analytics/SpendingTrends';
import { BudgetPerformanceSection } from '@/components/analytics/BudgetPerformanceSection';
import { SavingsPerformanceSection } from '@/components/analytics/SavingsPerformanceSection';
import { AccountAnalysis } from '@/components/analytics/AccountAnalysis';
import { TopSpendingCategories } from '@/components/analytics/TopSpendingCategories';
import { LargestTransactions } from '@/components/analytics/LargestTransactions';
import { PeriodComparison } from '@/components/analytics/PeriodComparison';
import { AnalyticsInsights } from '@/components/analytics/AnalyticsInsights';
import { AnalyticsDataTable } from '@/components/analytics/AnalyticsDataTable';
import { AnalyticsEmptyState } from '@/components/analytics/AnalyticsEmptyState';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const AnalyticsPage: React.FC = () => {
  // Global Filters State
  const [filters, setFilters] = useState<AnalyticsFiltersState>({
    datePreset: 'THIS_MONTH',
    accountId: 'ALL',
    transactionType: 'ALL',
    category: 'ALL',
    compareWithPrevious: true,
  });

  // Queries
  const {
    data: transactions = [],
    isLoading: isTxnsLoading,
    isError: isTxnsError,
    refetch: refetchTxns,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  const { data: rawBudgets = [] } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets(),
  });

  const { data: savingsGoals = [] } = useQuery({
    queryKey: ['savings-goals'],
    queryFn: () => savingsService.getGoals(),
  });

  const budgets = useMemo(() => {
    return budgetService.computeBudgetsWithMetrics(rawBudgets, transactions, 'THIS_MONTH');
  }, [rawBudgets, transactions]);

  // Derived Date Ranges
  const dateRange = useMemo(() => {
    return analyticsService.getDateRange(
      filters.datePreset,
      filters.customStartDate,
      filters.customEndDate
    );
  }, [filters.datePreset, filters.customStartDate, filters.customEndDate]);

  const prevDateRange = useMemo(() => {
    return analyticsService.getPreviousPeriodRange(dateRange.start, dateRange.end);
  }, [dateRange]);

  // Filtered Transactions for Current and Prior Windows
  const currentTxns = useMemo(() => {
    return analyticsService.filterTransactions(
      transactions,
      dateRange.start,
      dateRange.end,
      filters.accountId,
      filters.transactionType,
      filters.category
    );
  }, [transactions, dateRange, filters.accountId, filters.transactionType, filters.category]);

  const prevTxns = useMemo(() => {
    return analyticsService.filterTransactions(
      transactions,
      prevDateRange.start,
      prevDateRange.end,
      filters.accountId,
      filters.transactionType,
      filters.category
    );
  }, [transactions, prevDateRange, filters.accountId, filters.transactionType, filters.category]);

  // Analytics Aggregates
  const summary = useMemo(() => {
    return analyticsService.computeSummaryMetrics(currentTxns, prevTxns);
  }, [currentTxns, prevTxns]);

  const timelineData = useMemo(() => {
    return analyticsService.generateTimelineData(currentTxns, dateRange.start, dateRange.end);
  }, [currentTxns, dateRange]);

  const expenseBreakdown = useMemo(() => {
    return analyticsService.generateExpenseCategoryBreakdown(currentTxns);
  }, [currentTxns]);

  const incomeBreakdown = useMemo(() => {
    return analyticsService.generateIncomeCategoryBreakdown(currentTxns);
  }, [currentTxns]);

  const accountAnalysis = useMemo(() => {
    return analyticsService.generateAccountAnalysis(currentTxns);
  }, [currentTxns]);

  const topCategories = useMemo(() => {
    return analyticsService.generateTopSpendingCategories(expenseBreakdown);
  }, [expenseBreakdown]);

  const largestExpenses = useMemo(() => {
    return analyticsService.getLargestTransactions(currentTxns, 'EXPENSE', 5);
  }, [currentTxns]);

  const largestIncome = useMemo(() => {
    return analyticsService.getLargestTransactions(currentTxns, 'INCOME', 5);
  }, [currentTxns]);

  const insights = useMemo(() => {
    return analyticsService.generateInsights(summary, expenseBreakdown, currentTxns);
  }, [summary, expenseBreakdown, currentTxns]);

  const periodicTableRows = useMemo(() => {
    return analyticsService.generatePeriodicTableRows(currentTxns);
  }, [currentTxns]);

  const savingsMetrics = useMemo(() => {
    return savingsService.computeOverviewMetrics(savingsGoals);
  }, [savingsGoals]);

  const resetFilters = () => {
    setFilters({
      datePreset: 'THIS_MONTH',
      accountId: 'ALL',
      transactionType: 'ALL',
      category: 'ALL',
      compareWithPrevious: true,
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
            Financial Analytics
          </h1>
          <p className="text-sm text-secondary-text mt-1">
            Understand your money. Discover patterns. Make smarter decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetchTxns()}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface transition-colors cursor-pointer shadow-xs min-h-[38px]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-secondary-text" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. Global Filter Panel */}
      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        accounts={accounts}
        onReset={resetFilters}
      />

      {/* 3. Main Analytics Content */}
      {isTxnsLoading ? (
        <div className="rounded-2xl bg-surface border border-border p-16 flex flex-col items-center justify-center text-center shadow-card">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-xs text-secondary-text font-medium">
            Aggregating financial telemetry & telemetry trends...
          </p>
        </div>
      ) : isTxnsError ? (
        <div className="rounded-2xl bg-surface border border-destructive/20 p-10 text-center text-destructive text-xs shadow-card">
          Failed to load financial records. Please refresh or try again later.
        </div>
      ) : transactions.length === 0 ? (
        <AnalyticsEmptyState />
      ) : (
        <>
          {/* Summary Cards */}
          <AnalyticsSummaryCards
            summary={summary}
            showComparison={filters.compareWithPrevious}
          />

          {/* Income vs Expenses Main Visualization */}
          <ErrorBoundary fallbackTitle="Income vs Expenses Chart Unavailable">
            <IncomeExpenseChart data={timelineData} />
          </ErrorBoundary>

          {/* Category Distributions (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary fallbackTitle="Category Breakdown Unavailable">
              <CategoryBreakdown
                items={expenseBreakdown}
                selectedCategory={filters.category}
                onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
              />
            </ErrorBoundary>
            <ErrorBoundary fallbackTitle="Income Breakdown Unavailable">
              <IncomeBreakdown items={incomeBreakdown} />
            </ErrorBoundary>
          </div>

          {/* Spending Trends Area Chart */}
          <ErrorBoundary fallbackTitle="Spending Trends Chart Unavailable">
            <SpendingTrends timelineData={timelineData} />
          </ErrorBoundary>

          {/* Budget & Savings Performance (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetPerformanceSection budgets={budgets} />
            <SavingsPerformanceSection
              goals={savingsGoals}
              metrics={savingsMetrics}
            />
          </div>

          {/* Top Spending Categories & Largest Transactions (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopSpendingCategories categories={topCategories} />
            <LargestTransactions
              expenses={largestExpenses}
              income={largestIncome}
            />
          </div>

          {/* Account Financial Activity Table */}
          <AccountAnalysis accounts={accountAnalysis} />

          {/* Period-over-Period Performance Comparison */}
          {filters.compareWithPrevious && (
            <PeriodComparison summary={summary} />
          )}

          {/* AI Financial Insights Panel */}
          {insights.length > 0 && <AnalyticsInsights insights={insights} />}

          {/* Exact Data Breakdown Table & CSV Reporting */}
          <AnalyticsDataTable rows={periodicTableRows} />
        </>
      )}
    </div>
  );
};
