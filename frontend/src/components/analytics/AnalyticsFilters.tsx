import React from 'react';
import {
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import {
  AnalyticsDatePreset,
  AnalyticsFiltersState,
} from '@/services/analyticsService';
import { AccountRecord } from '@/services/accountService';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/services/transactionService';

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersState;
  onChange: (filters: AnalyticsFiltersState) => void;
  accounts: AccountRecord[];
  onReset: () => void;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onChange,
  accounts,
  onReset,
}) => {
  const datePresets: { label: string; value: AnalyticsDatePreset }[] = [
    { label: 'This Week', value: 'THIS_WEEK' },
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Last Month', value: 'LAST_MONTH' },
    { label: 'Last 3 Months', value: 'LAST_3_MONTHS' },
    { label: 'Last 6 Months', value: 'LAST_6_MONTHS' },
    { label: 'This Year', value: 'THIS_YEAR' },
    { label: 'Last Year', value: 'LAST_YEAR' },
    { label: 'All Time', value: 'ALL_TIME' },
    { label: 'Custom', value: 'CUSTOM' },
  ];

  const allCategories = Array.from(
    new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])
  ).sort();

  return (
    <div className="glass-panel p-5 rounded-3xl space-y-4">
      {/* Top Row: Date Presets Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
          {datePresets.map((preset) => {
            const isActive = filters.datePreset === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange({ ...filters, datePreset: preset.value })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm'
                    : 'glass-surface text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-white/60 dark:border-white/5'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Reset Action */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 transition-colors cursor-pointer shrink-0"
          title="Reset to default filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Custom Date Range (when CUSTOM selected) */}
      {filters.datePreset === 'CUSTOM' && (
        <div className="p-3.5 rounded-2xl glass-surface border border-spendx-blue-primary/30 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          <div>
            <label
              htmlFor="analytics-custom-start"
              className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              Start Date
            </label>
            <input
              id="analytics-custom-start"
              type="date"
              value={filters.customStartDate || ''}
              onChange={(e) =>
                onChange({ ...filters, customStartDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
            />
          </div>
          <div>
            <label
              htmlFor="analytics-custom-end"
              className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              End Date
            </label>
            <input
              id="analytics-custom-end"
              type="date"
              value={filters.customEndDate || ''}
              onChange={(e) =>
                onChange({ ...filters, customEndDate: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
            />
          </div>
        </div>
      )}

      {/* Bottom Filter Controls: Account, Type, Category & Compare Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100/60 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Account Filter */}
          <div className="relative">
            <label htmlFor="analytics-account-select" className="sr-only">
              Filter by account
            </label>
            <select
              id="analytics-account-select"
              value={filters.accountId}
              onChange={(e) => onChange({ ...filters, accountId: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium"
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div className="relative">
            <label htmlFor="analytics-type-select" className="sr-only">
              Filter by transaction type
            </label>
            <select
              id="analytics-type-select"
              value={filters.transactionType}
              onChange={(e) =>
                onChange({
                  ...filters,
                  transactionType: e.target.value as AnalyticsFiltersState['transactionType'],
                })
              }
              className="px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium"
            >
              <option value="ALL">All Flows (Income & Expense)</option>
              <option value="EXPENSE">Expenses Only</option>
              <option value="INCOME">Income Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <label htmlFor="analytics-category-select" className="sr-only">
              Filter by category
            </label>
            <select
              id="analytics-category-select"
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium"
            >
              <option value="ALL">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare with Previous Period Switch */}
        <label
          htmlFor="analytics-compare-toggle"
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
        >
          <input
            id="analytics-compare-toggle"
            type="checkbox"
            checked={filters.compareWithPrevious}
            onChange={(e) =>
              onChange({ ...filters, compareWithPrevious: e.target.checked })
            }
            className="w-4 h-4 rounded text-spendx-blue-primary focus:ring-spendx-blue-primary border-slate-300 dark:border-slate-600 cursor-pointer"
          />
          <ArrowRightLeft className="w-3.5 h-3.5 text-spendx-purple-primary" />
          <span>Compare vs. Prior Period</span>
        </label>
      </div>
    </div>
  );
};
