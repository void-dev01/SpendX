import React from 'react';
import { Search, Plus, Calendar, ListFilter, SlidersHorizontal, LayoutGrid, X } from 'lucide-react';
import { RECURRING_CATEGORIES } from '@/services/recurringService';

export type RecurringSortOption =
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'amountDesc'
  | 'amountAsc'
  | 'nameAsc';

interface RecurringToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortBy: RecurringSortOption;
  onSortChange: (sort: RecurringSortOption) => void;
  viewMode: 'list' | 'calendar';
  onViewModeChange: (mode: 'list' | 'calendar') => void;
  onOpenCreateDialog: () => void;
}

export const RecurringToolbar: React.FC<RecurringToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenCreateDialog,
}) => {
  return (
    <div className="bg-card dark:bg-[#1B211B] p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
      {/* Left side: Search & filters */}
      <div className="flex flex-1 flex-col sm:flex-row flex-wrap gap-2.5 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search subscriptions, rent, bills..."
            value={searchQuery}
            aria-label="Search recurring payments"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-9 text-xs sm:text-xs rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[145px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 text-xs rounded-xl bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              selectedCategory !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40 font-medium'
            }`}
          >
            <option value="ALL">All Categories</option>
            {RECURRING_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ListFilter className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[135px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 text-xs rounded-xl bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              selectedStatus !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40 font-medium'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="DUE_TODAY">Due Today</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PAID">Paid</option>
            <option value="PAUSED">Paused</option>
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[145px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as RecurringSortOption)}
            aria-label="Sort recurring payments"
            className="w-full appearance-none h-10 pl-3.5 pr-8 text-xs rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium transition-all cursor-pointer"
          >
            <option value="dueDateAsc">Due: Soonest First</option>
            <option value="dueDateDesc">Due: Furthest First</option>
            <option value="amountDesc">Amount: High to Low</option>
            <option value="amountAsc">Amount: Low to High</option>
            <option value="nameAsc">Name: A to Z</option>
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side: View mode toggle & CTA */}
      <div className="flex items-center gap-2.5 justify-end shrink-0">
        {/* List / Calendar View toggle */}
        <div className="inline-flex h-10 p-1 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border shadow-xs items-center">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
              viewMode === 'list'
                ? 'bg-primary text-[#111711] shadow-xs font-bold'
                : 'text-secondary-text hover:text-foreground hover:bg-card'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('calendar')}
            aria-label="Calendar view"
            className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
              viewMode === 'calendar'
                ? 'bg-primary text-[#111711] shadow-xs font-bold'
                : 'text-secondary-text hover:text-foreground hover:bg-card'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* Add Payment CTA */}
        <button
          type="button"
          onClick={onOpenCreateDialog}
          className="h-10 flex items-center justify-center gap-2 px-4 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-[#111711] shadow-xs transition-all shrink-0 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment</span>
        </button>
      </div>
    </div>
  );
};
