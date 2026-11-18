import React from 'react';
import { Download, Plus, UploadCloud } from 'lucide-react';
import { TransactionFiltersState } from '@/services/transactionService';

interface TransactionHeaderProps {
  dateRange: TransactionFiltersState['dateRange'];
  onDateRangeChange: (range: TransactionFiltersState['dateRange']) => void;
  onAddTransaction: () => void;
  onExport: () => void;
  onImport?: () => void;
  filteredCount: number;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onAddTransaction,
  onExport,
  onImport,
  filteredCount,
}) => {
  const rangeOptions: { label: string; value: TransactionFiltersState['dateRange'] }[] = [
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Last Month', value: 'LAST_MONTH' },
    { label: 'Last 3 Months', value: 'LAST_3_MONTHS' },
    { label: 'This Year', value: 'THIS_YEAR' },
    { label: 'All Time', value: 'ALL' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground">
            Transactions
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {filteredCount} {filteredCount === 1 ? 'record' : 'records'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-secondary-text mt-1">
          Track, manage, and audit every movement of your money.
        </p>
      </div>

      {/* Date Range Selector & Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 self-stretch lg:self-auto w-full lg:w-auto">
        {/* Date Range Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border shadow-xs overflow-x-auto max-w-full touch-scroll">
          {rangeOptions.map((opt) => {
            const isActive = dateRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDateRangeChange(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-secondary-text hover:text-foreground hover:bg-surface font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Import Statement Button */}
          {onImport && (
            <button
              type="button"
              onClick={onImport}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground bg-surface hover:bg-surface-elevated border border-border shadow-xs transition-colors cursor-pointer"
              title="Import statement via CSV, Excel, PDF, or SMS"
            >
              <UploadCloud className="w-3.5 h-3.5 text-primary" />
              <span>Import</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground bg-surface border border-border hover:bg-surface-elevated shadow-xs transition-colors cursor-pointer"
            title="Export current filtered view as CSV"
          >
            <Download className="w-3.5 h-3.5 text-secondary-text" />
            <span>Export CSV</span>
          </button>

          {/* Add Transaction Button */}
          <button
            type="button"
            onClick={onAddTransaction}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </div>
  );
};
