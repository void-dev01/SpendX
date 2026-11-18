import React, { useState } from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import {
  TransactionFiltersState,
  DEFAULT_USER_ACCOUNTS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/services/transactionService';

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  onReset,
  activeFilterCount,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Combine unique categories for filter dropdown
  const allCategories = Array.from(new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, type: e.target.value as TransactionFiltersState['type'] });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value });
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, accountId: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as TransactionFiltersState['sortBy'] });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: e.target.value as TransactionFiltersState['status'] });
  };

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-3">
      {/* Top Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search transactions, merchants, or categories..."
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm glass-surface border border-white/80 dark:border-white/10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#718FE8]/40 text-slate-800 dark:text-slate-100 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button (< md) */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#718FE8] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop Reset Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Desktop Filter Row (md and up) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
        {/* 1. Transaction Type */}
        <div>
          <select
            value={filters.type}
            onChange={handleTypeChange}
            aria-label="Filter by transaction type"
            className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#718FE8]"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income (+)</option>
            <option value="EXPENSE">Expense (-)</option>
            <option value="TRANSFER">Transfer (⇄)</option>
          </select>
        </div>

        {/* 2. Category */}
        <div>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
            className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#718FE8]"
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Account */}
        <div>
          <select
            value={filters.accountId}
            onChange={handleAccountChange}
            aria-label="Filter by account"
            className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#718FE8]"
          >
            <option value="ALL">All Accounts</option>
            {DEFAULT_USER_ACCOUNTS.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Status */}
        <div>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            aria-label="Filter by status"
            className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#718FE8]"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* 5. Sort By */}
        <div>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            aria-label="Sort transactions"
            className="w-full px-3 py-2 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#718FE8] font-medium"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="AMOUNT_DESC">Highest Amount</option>
            <option value="AMOUNT_ASC">Lowest Amount</option>
            <option value="NAME_ASC">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="glass-panel rounded-t-3xl p-6 border-t border-white/80 dark:border-white/10 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-foreground">
                  Filter Transactions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={handleTypeChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">All Types</option>
                  <option value="INCOME">Income (+)</option>
                  <option value="EXPENSE">Expense (-)</option>
                  <option value="TRANSFER">Transfer (⇄)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">All Categories</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Account
                </label>
                <select
                  value={filters.accountId}
                  onChange={handleAccountChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100"
                >
                  <option value="ALL">All Accounts</option>
                  {DEFAULT_USER_ACCOUNTS.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Sort Order
                </label>
                <select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                  <option value="AMOUNT_DESC">Highest Amount</option>
                  <option value="AMOUNT_ASC">Lowest Amount</option>
                  <option value="NAME_ASC">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#718FE8] to-[#8B72D6] shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
