import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 py-3 px-2">
      {/* Result count & Page size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing{' '}
          <strong className="text-slate-700 dark:text-slate-200 tabular-nums">{startItem}</strong>{' '}
          to{' '}
          <strong className="text-slate-700 dark:text-slate-200 tabular-nums">{endItem}</strong>{' '}
          of{' '}
          <strong className="text-slate-700 dark:text-slate-200 tabular-nums">{totalItems}</strong>{' '}
          results
        </span>

        <div className="flex items-center gap-1.5">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Transactions per page"
            className="px-2 py-1 rounded-lg text-xs glass-surface border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg glass-surface border border-white/80 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          // Only show up to 5 surrounding pages if totalPages is large
          if (
            totalPages > 5 &&
            Math.abs(pageNum - currentPage) > 2 &&
            pageNum !== 1 &&
            pageNum !== totalPages
          ) {
            return null;
          }

          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-spendx-blue-primary text-white shadow-sm'
                  : 'glass-surface border border-white/80 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg glass-surface border border-white/80 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
