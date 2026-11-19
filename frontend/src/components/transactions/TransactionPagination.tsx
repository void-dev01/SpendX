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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-secondary-text py-3 px-2">
      {/* Result count & Page size selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing{' '}
          <strong className="text-foreground tabular-nums">{startItem}</strong>{' '}
          to{' '}
          <strong className="text-foreground tabular-nums">{endItem}</strong>{' '}
          of{' '}
          <strong className="text-foreground tabular-nums">{totalItems}</strong>{' '}
          results
        </span>

        <div className="flex items-center gap-1.5">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Transactions per page"
            className="px-2 py-1 rounded-lg text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
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
          className="p-1.5 rounded-lg bg-surface-elevated border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface text-foreground transition-colors"
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
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary text-[#111711] shadow-xs'
                  : 'bg-surface-elevated border border-border hover:bg-surface text-foreground'
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
          className="p-1.5 rounded-lg bg-surface-elevated border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface text-foreground transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
