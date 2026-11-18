import React from 'react';
import { Plus } from 'lucide-react';
import { BudgetPeriod } from '@/services/budgetService';

export interface BudgetFiltersState {
  period: BudgetPeriod;
  statusFilter: 'ALL' | 'NEAR_LIMIT_EXCEEDED' | 'NORMAL';
  sortBy: 'UTIL_DESC' | 'BUDGET_DESC' | 'BUDGET_ASC' | 'SPENT_DESC' | 'NAME_ASC';
}

interface BudgetToolbarProps {
  filters: BudgetFiltersState;
  onChange: (filters: BudgetFiltersState) => void;
  onCreateBudget: () => void;
  budgetCount: number;
}

export const BudgetToolbar: React.FC<BudgetToolbarProps> = ({
  filters,
  onChange,
  onCreateBudget,
  budgetCount,
}) => {
  const periodOptions: { label: string; value: BudgetPeriod }[] = [
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Previous Month', value: 'PREVIOUS_MONTH' },
    { label: 'All Time', value: 'ALL_TIME' },
  ];

  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Period Selector Pills */}
      <div className="flex items-center gap-1 p-1 rounded-2xl glass-surface border border-white/80 dark:border-white/10 shadow-sm w-full md:w-auto overflow-x-auto touch-scroll max-w-full">
        {periodOptions.map((opt) => {
          const isActive = filters.period === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, period: opt.value })}
              className={`flex-1 sm:flex-initial text-center px-3 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[40px] ${
                isActive
                  ? 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Right: Filters & Create Budget */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
        {/* Status Filter */}
        <select
          value={filters.statusFilter}
          onChange={(e) =>
            onChange({
              ...filters,
              statusFilter: e.target.value as BudgetFiltersState['statusFilter'],
            })
          }
          aria-label="Filter budgets by status"
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium min-h-[44px]"
        >
          <option value="ALL">All Budgets ({budgetCount})</option>
          <option value="NEAR_LIMIT_EXCEEDED">Near Limit / Exceeded</option>
          <option value="NORMAL">On Track</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as BudgetFiltersState['sortBy'],
            })
          }
          aria-label="Sort budgets"
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium min-h-[44px]"
        >
          <option value="UTIL_DESC">Highest Utilization</option>
          <option value="BUDGET_DESC">Highest Budget Limit</option>
          <option value="SPENT_DESC">Highest Outflow</option>
          <option value="BUDGET_ASC">Lowest Budget Limit</option>
          <option value="NAME_ASC">Category Name (A-Z)</option>
        </select>

        {/* Create Budget CTA */}
        <button
          type="button"
          onClick={onCreateBudget}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary hover:opacity-95 shadow-md transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>
    </div>
  );
};
