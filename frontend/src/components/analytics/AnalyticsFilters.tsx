import React from 'react';
import {
  ArrowRightLeft,
  RotateCcw,
  ChevronDown,
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
    <div className="rounded-2xl bg-card dark:bg-[#1B211B] border border-border p-4 sm:p-5 space-y-4 shadow-xs">
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
                    ? 'bg-primary text-[#111711] shadow-xs font-bold'
                    : 'bg-surface-subtle dark:bg-[#242C23] text-secondary-text hover:text-foreground hover:bg-card border border-border'
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
          className="flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-foreground px-3 py-1.5 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border hover:border-primary/40 transition-colors cursor-pointer shrink-0 shadow-xs"
          title="Reset to default filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Custom Date Range (when CUSTOM selected) */}
      {filters.datePreset === 'CUSTOM' && (
        <div className="p-3.5 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          <div>
            <label
              htmlFor="analytics-custom-start"
              className="block text-[11px] font-semibold text-secondary-text mb-1"
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
              className="w-full h-10 px-3 rounded-xl text-xs bg-surface dark:bg-[#1B211B] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label
              htmlFor="analytics-custom-end"
              className="block text-[11px] font-semibold text-secondary-text mb-1"
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
              className="w-full h-10 px-3 rounded-xl text-xs bg-surface dark:bg-[#1B211B] border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      )}

      {/* Bottom Filter Controls: Account, Type, Category & Compare Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
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
              className={`appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-xs ${
                filters.accountId !== 'ALL'
                  ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                  : 'border-border text-foreground hover:border-primary/40 font-medium'
              }`}
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className={`appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-xs ${
                filters.transactionType !== 'ALL'
                  ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                  : 'border-border text-foreground hover:border-primary/40 font-medium'
              }`}
            >
              <option value="ALL">All Flows (Income & Expense)</option>
              <option value="EXPENSE">Expenses Only</option>
              <option value="INCOME">Income Only</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              className={`appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-xs ${
                filters.category !== 'ALL'
                  ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                  : 'border-border text-foreground hover:border-primary/40 font-medium'
              }`}
            >
              <option value="ALL">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Compare with Previous Period Switch */}
        <label
          htmlFor="analytics-compare-toggle"
          className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none py-1"
        >
          <input
            id="analytics-compare-toggle"
            type="checkbox"
            checked={filters.compareWithPrevious}
            onChange={(e) =>
              onChange({ ...filters, compareWithPrevious: e.target.checked })
            }
            className="w-4 h-4 rounded text-primary accent-primary focus:ring-primary/40 border-border bg-surface-subtle cursor-pointer"
          />
          <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
          <span>Compare vs. Prior Period</span>
        </label>
      </div>
    </div>
  );
};
