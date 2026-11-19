import React from 'react';
import { Search, Plus, X, ChevronDown } from 'lucide-react';
import { AccountType } from '@/services/accountService';

export interface AccountFiltersState {
  search: string;
  type: 'ALL' | AccountType;
  sortBy: 'NAME_ASC' | 'NAME_DESC' | 'BALANCE_DESC' | 'BALANCE_ASC';
}

interface AccountsToolbarProps {
  filters: AccountFiltersState;
  onChange: (filters: AccountFiltersState) => void;
  onAddAccount: () => void;
  accountCount: number;
}

export const AccountsToolbar: React.FC<AccountsToolbarProps> = ({
  filters,
  onChange,
  onAddAccount,
  accountCount,
}) => {
  return (
    <div className="bg-card dark:bg-[#1B211B] p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by account, bank, or card name..."
          className="w-full h-10 pl-10 pr-9 rounded-xl text-xs sm:text-sm bg-surface-subtle dark:bg-[#242C23] border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 text-foreground transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            aria-label="Clear search text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter, Sort & Add Account */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
        {/* Type Filter */}
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <select
            value={filters.type}
            onChange={(e) =>
              onChange({ ...filters, type: e.target.value as AccountFiltersState['type'] })
            }
            aria-label="Filter accounts by type"
            className={`w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              filters.type !== 'ALL'
                ? 'border-primary/60 bg-primary/10 text-foreground font-semibold'
                : 'border-border text-foreground hover:border-primary/40 font-medium'
            }`}
          >
            <option value="ALL">All Types ({accountCount})</option>
            <option value="BANK">Checking / Bank</option>
            <option value="SAVINGS">Savings Vaults</option>
            <option value="CREDIT_CARD">Credit Cards</option>
            <option value="CASH">Cash Wallets</option>
            <option value="OTHER">Other Accounts</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none min-w-[140px]">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as AccountFiltersState['sortBy'] })
            }
            aria-label="Sort accounts"
            className="w-full appearance-none h-10 pl-3.5 pr-8 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium transition-all cursor-pointer"
          >
            <option value="BALANCE_DESC">Balance: High to Low</option>
            <option value="BALANCE_ASC">Balance: Low to High</option>
            <option value="NAME_ASC">Name: A to Z</option>
            <option value="NAME_DESC">Name: Z to A</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Add Account CTA */}
        <button
          type="button"
          onClick={onAddAccount}
          className="w-full sm:w-auto h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-xl text-xs font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>
    </div>
  );
};
