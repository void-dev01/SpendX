import React from 'react';
import { Plus, Search } from 'lucide-react';
import { GoalCategory, SAVINGS_CATEGORIES } from '@/services/savingsService';

export interface SavingsFiltersState {
  search: string;
  category: 'ALL' | GoalCategory;
  status: 'ALL' | 'ACTIVE' | 'COMPLETED';
  sortBy: 'PROGRESS_DESC' | 'PROGRESS_ASC' | 'TARGET_DESC' | 'TARGET_ASC' | 'DATE_ASC';
}

interface SavingsToolbarProps {
  filters: SavingsFiltersState;
  onChange: (filters: SavingsFiltersState) => void;
  onCreateGoal: () => void;
  totalGoalCount: number;
}

export const SavingsToolbar: React.FC<SavingsToolbarProps> = ({
  filters,
  onChange,
  onCreateGoal,
  totalGoalCount,
}) => {
  const statusTabs: { label: string; value: SavingsFiltersState['status'] }[] = [
    { label: `All Goals (${totalGoalCount})`, value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Status Filter Pills */}
      <div className="flex items-center gap-1 p-1 rounded-2xl glass-surface border border-white/80 dark:border-white/10 shadow-sm self-start md:self-auto overflow-x-auto max-w-full">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ ...filters, status: tab.value })}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Search, Category, Sort & Create Goal */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative min-w-[160px] sm:min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
            aria-label="Search savings goals"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) =>
              onChange({
                ...filters,
                category: e.target.value as SavingsFiltersState['category'],
              })
            }
            aria-label="Filter savings goals by category"
            className="px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium"
          >
            <option value="ALL">All Categories</option>
            {SAVINGS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as SavingsFiltersState['sortBy'],
              })
            }
            aria-label="Sort savings goals"
            className="px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary font-medium"
          >
            <option value="PROGRESS_DESC">Highest Progress</option>
            <option value="PROGRESS_ASC">Lowest Progress</option>
            <option value="TARGET_DESC">Highest Target</option>
            <option value="TARGET_ASC">Lowest Target</option>
            <option value="DATE_ASC">Closest Target Date</option>
          </select>
        </div>

        {/* Create Goal Button */}
        <button
          type="button"
          onClick={onCreateGoal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm hover:shadow hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>
    </div>
  );
};
