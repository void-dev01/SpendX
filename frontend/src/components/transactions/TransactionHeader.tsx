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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Transactions
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {filteredCount} {filteredCount === 1 ? 'record' : 'records'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track, manage, and audit every movement of your money.
        </p>
      </div>

      {/* Date Range Selector & Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
        {/* Date Range Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-surface border border-white/80 dark:border-white/10 shadow-sm overflow-x-auto max-w-full">
          {rangeOptions.map((opt) => {
            const isActive = dateRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDateRangeChange(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8220] text-[#0A0A0C] shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5 font-medium'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Import Statement Button */}
        {onImport && (
          <button
            type="button"
            onClick={onImport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 shadow-sm transition-all cursor-pointer"
            title="Import statement via CSV, Excel, PDF, or SMS"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        )}

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-surface border border-white/80 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm transition-all cursor-pointer"
          title="Export current filtered view as CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>

        {/* Add Transaction Button */}
        <button
          type="button"
          onClick={onAddTransaction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] to-[#AA8220] hover:opacity-95 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#0A0A0C]" />
          <span>Add Transaction</span>
        </button>
      </div>
    </div>
  );
};
