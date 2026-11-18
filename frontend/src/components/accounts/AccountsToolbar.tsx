import React from 'react';
import { Search, Plus, X } from 'lucide-react';
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
    <div className="bg-surface p-3.5 sm:p-4 rounded-2xl border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search by account, bank, or card name..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm bg-surface-elevated border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground transition-all min-h-[44px]"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter, Sort & Add Account */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) =>
            onChange({ ...filters, type: e.target.value as AccountFiltersState['type'] })
          }
          aria-label="Filter accounts by type"
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium min-h-[44px]"
        >
          <option value="ALL">All Types ({accountCount})</option>
          <option value="BANK">Checking / Bank</option>
          <option value="SAVINGS">Savings Vaults</option>
          <option value="CREDIT_CARD">Credit Cards</option>
          <option value="CASH">Cash Wallets</option>
          <option value="OTHER">Other Accounts</option>
        </select>

        {/* Sort Dropdown */}
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({ ...filters, sortBy: e.target.value as AccountFiltersState['sortBy'] })
          }
          aria-label="Sort accounts"
          className="flex-1 sm:flex-none min-w-[130px] px-3 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium min-h-[44px]"
        >
          <option value="BALANCE_DESC">Balance: High to Low</option>
          <option value="BALANCE_ASC">Balance: Low to High</option>
          <option value="NAME_ASC">Name: A to Z</option>
          <option value="NAME_DESC">Name: Z to A</option>
        </select>

        {/* Add Account CTA */}
        <button
          type="button"
          onClick={onAddAccount}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Account</span>
        </button>
      </div>
    </div>
  );
};
