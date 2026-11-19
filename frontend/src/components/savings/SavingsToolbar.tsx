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
    <div className="bg-card dark:bg-[#1B211B] p-4 rounded-[20px] border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left: Status Filter Pills */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border shadow-xs self-start md:self-auto overflow-x-auto max-w-full">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange({ ...filters, status: tab.value })}
              className={`px-3.5 py-1.5 text-xs rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[36px] ${
                isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'text-secondary-text hover:text-foreground hover:bg-card'
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
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search goals..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
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
            className="px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-xs"
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
            className="px-3 py-2 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium shadow-xs"
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
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>
    </div>
  );
};
