import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
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
    <div className="bg-card dark:bg-[#1B211B] p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Period Selector Pills */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border shadow-xs w-full md:w-auto overflow-x-auto touch-scroll max-w-full">
        {periodOptions.map((opt) => {
          const isActive = filters.period === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, period: opt.value })}
              className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'bg-primary text-[#111711] shadow-xs font-bold'
                  : 'text-secondary-text hover:text-foreground hover:bg-card font-medium'
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
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                statusFilter: e.target.value as BudgetFiltersState['statusFilter'],
              })
            }
            aria-label="Filter budgets by status"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.statusFilter !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40 font-medium'
            }`}
          >
            <option value="ALL">All Budgets ({budgetCount})</option>
            <option value="NEAR_LIMIT_EXCEEDED">Near Limit / Exceeded</option>
            <option value="NORMAL">On Track</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as BudgetFiltersState['sortBy'],
              })
            }
            aria-label="Sort budgets"
            className="w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium transition-all cursor-pointer"
          >
            <option value="UTIL_DESC">Highest Utilization</option>
            <option value="BUDGET_DESC">Highest Budget Limit</option>
            <option value="SPENT_DESC">Highest Outflow</option>
            <option value="BUDGET_ASC">Lowest Budget Limit</option>
            <option value="NAME_ASC">Category Name (A-Z)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Create Budget CTA */}
        <button
          type="button"
          onClick={onCreateBudget}
          className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>
    </div>
  );
};
