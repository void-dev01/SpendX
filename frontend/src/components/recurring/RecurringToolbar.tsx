import React from 'react';
import { Search, Plus, Calendar, ListFilter, SlidersHorizontal, LayoutGrid } from 'lucide-react';
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
    <div className="bg-surface p-4 rounded-2xl border border-border shadow-card flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      {/* Left side: Search & filters */}
      <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subscriptions, rent, bills..."
            value={searchQuery}
            aria-label="Search recurring payments"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {RECURRING_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ListFilter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by status"
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="DUE_TODAY">Due Today</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PAID">Paid</option>
            <option value="PAUSED">Paused</option>
          </select>
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as RecurringSortOption)}
            aria-label="Sort recurring payments"
            className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all cursor-pointer"
          >
            <option value="dueDateAsc">Due: Soonest First</option>
            <option value="dueDateDesc">Due: Furthest First</option>
            <option value="amountDesc">Amount: High to Low</option>
            <option value="amountAsc">Amount: Low to High</option>
            <option value="nameAsc">Name: A to Z</option>
          </select>
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right side: View mode toggle & CTA */}
      <div className="flex items-center gap-3 justify-end">
        {/* List / Calendar View toggle */}
        <div className="inline-flex p-1 rounded-xl bg-surface-elevated border border-border shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-primary text-white shadow-xs'
                : 'text-secondary-text hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('calendar')}
            aria-label="Calendar view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-primary text-white shadow-xs'
                : 'text-secondary-text hover:text-foreground'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>

        {/* Add Payment CTA */}
        <button
          type="button"
          onClick={onOpenCreateDialog}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment</span>
        </button>
      </div>
    </div>
  );
};
