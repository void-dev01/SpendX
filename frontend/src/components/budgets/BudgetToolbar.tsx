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
    <div className="bg-surface p-3.5 sm:p-4 rounded-2xl border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Period Selector Pills */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border shadow-xs w-full md:w-auto overflow-x-auto touch-scroll max-w-full">
        {periodOptions.map((opt) => {
          const isActive = filters.period === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, period: opt.value })}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'bg-primary text-[#111711] shadow-xs font-bold'
                  : 'text-secondary-text hover:text-foreground hover:bg-surface'
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
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium min-h-[40px] shadow-xs"
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
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium min-h-[40px] shadow-xs"
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
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-all cursor-pointer whitespace-nowrap min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>
    </div>
  );
};
