import React, { useState } from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
    <div className="bg-card dark:bg-[#1B211B] p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs space-y-3">
      {/* Top Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search transactions, merchants, or categories..."
            className="w-full h-10 pl-10 pr-9 rounded-xl text-xs sm:text-sm bg-surface-subtle dark:bg-[#242C23] border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button (< md) */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden h-10 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-semibold bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground hover:border-primary/40 shadow-xs cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-[#111711] text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop Reset Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="hidden md:inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-xs font-semibold text-expense bg-expense/10 hover:bg-expense/20 border border-expense/25 transition-all cursor-pointer shrink-0"
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* Desktop Filter Row (md and up) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-2.5 pt-0.5">
        {/* 1. Transaction Type */}
        <div className="relative">
          <select
            value={filters.type}
            onChange={handleTypeChange}
            aria-label="Filter by transaction type"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.type !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40'
            }`}
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income (+)</option>
            <option value="EXPENSE">Expense (-)</option>
            <option value="TRANSFER">Transfer (⇄)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 2. Category */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.category !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40'
            }`}
          >
            <option value="ALL">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 3. Account */}
        <div className="relative">
          <select
            value={filters.accountId}
            onChange={handleAccountChange}
            aria-label="Filter by account"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.accountId !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40'
            }`}
          >
            <option value="ALL">All Accounts</option>
            {DEFAULT_USER_ACCOUNTS.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 4. Status */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={handleStatusChange}
            aria-label="Filter by status"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.status !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40'
            }`}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 5. Sort By */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            aria-label="Sort transactions"
            className="w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium transition-all cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="AMOUNT_DESC">Highest Amount</option>
            <option value="AMOUNT_ASC">Lowest Amount</option>
            <option value="NAME_ASC">Name (A-Z)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 md:hidden animate-in fade-in duration-200 backdrop-blur-xs">
          <div className="bg-card dark:bg-[#1B211B] rounded-t-3xl p-6 border-t border-border max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            {/* Drawer Handle */}
            <div className="w-10 h-1 bg-border rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base text-foreground">
                  Filter Transactions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-secondary-text hover:text-foreground"
                aria-label="Close filters drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-secondary-text mb-1.5">
                  Transaction Type
                </label>
                <div className="relative">
                  <select
                    value={filters.type}
                    onChange={handleTypeChange}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium pr-8"
                  >
                    <option value="ALL">All Types</option>
                    <option value="INCOME">Income (+)</option>
                    <option value="EXPENSE">Expense (-)</option>
                    <option value="TRANSFER">Transfer (⇄)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-text mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium pr-8"
                  >
                    <option value="ALL">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-text mb-1.5">
                  Account
                </label>
                <div className="relative">
                  <select
                    value={filters.accountId}
                    onChange={handleAccountChange}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium pr-8"
                  >
                    <option value="ALL">All Accounts</option>
                    {DEFAULT_USER_ACCOUNTS.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-text mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={filters.status}
                    onChange={handleStatusChange}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium pr-8"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary-text mb-1.5">
                  Sort Order
                </label>
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium pr-8"
                  >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="AMOUNT_DESC">Highest Amount</option>
                    <option value="AMOUNT_ASC">Lowest Amount</option>
                    <option value="NAME_ASC">Name (A-Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
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
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-surface-subtle dark:bg-[#242C23] border border-border text-secondary-text hover:text-foreground cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs cursor-pointer"
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
