import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import { NormalizedImportTransaction } from '@/services/importService';
import { transactionService } from '@/services/transactionService';

interface ImportPreviewTableProps {
  transactions: NormalizedImportTransaction[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (select: boolean) => void;
  onChangeCategory: (id: string, category: string) => void;
  categories: string[];
}

export const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({
  transactions,
  onToggleSelect,
  onToggleSelectAll,
  onChangeCategory,
  categories,
}) => {
  const selectedCount = transactions.filter((t) => t.isSelected).length;
  const duplicateCount = transactions.filter(
    (t) => t.duplicateStatus === 'EXACT_DUPLICATE' || t.duplicateStatus === 'POTENTIAL_DUPLICATE'
  ).length;
  const allSelected = transactions.length > 0 && selectedCount === transactions.length;

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-elevated border border-border text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-foreground">
            {transactions.length} Transactions Extracted
          </span>
          <span className="text-income font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {selectedCount} ready to import
          </span>
          {duplicateCount > 0 && (
            <span className="text-amber-500 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {duplicateCount} duplicate warnings
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSelectAll(!allSelected)}
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            {allSelected ? 'Deselect All' : 'Select All Valid'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-surface border-b border-border z-10 font-semibold text-muted-foreground uppercase text-[11px]">
            <tr>
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  aria-label="Select all transactions"
                  className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Description & Merchant</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Amount</th>
              <th className="py-2.5 px-3">Status / Duplicate Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className={`transition-colors ${
                  tx.isSelected
                    ? 'bg-surface hover:bg-surface-elevated'
                    : 'opacity-50 bg-surface-elevated/40'
                }`}
              >
                {/* Select Checkbox */}
                <td className="py-3 px-3">
                  <input
                    type="checkbox"
                    checked={tx.isSelected}
                    onChange={() => onToggleSelect(tx.id)}
                    aria-label={`Select ${tx.description}`}
                    className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                </td>

                {/* Date */}
                <td className="py-3 px-3 text-secondary-text whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>

                {/* Description & Merchant */}
                <td className="py-3 px-3 max-w-[200px]">
                  <p className="font-semibold text-foreground truncate">
                    {tx.description}
                  </p>
                  <p className="text-[10px] text-secondary-text truncate">
                    {tx.merchantName} {tx.referenceNumber ? `• Ref: ${tx.referenceNumber}` : ''}
                  </p>
                </td>

                {/* Category Selection */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={tx.category}
                      onChange={(e) => onChangeCategory(tx.id, e.target.value)}
                      aria-label="Category for imported transaction"
                      className="p-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {tx.confidenceScore >= 80 && (
                      <span title={`${tx.confidenceScore}% categorization confidence`} className="inline-flex">
                        <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
                      </span>
                    )}
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3 px-3 font-semibold tabular-nums whitespace-nowrap">
                  <span
                    className={
                      tx.type === 'INCOME'
                        ? 'text-income'
                        : 'text-expense'
                    }
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {transactionService.formatINR(tx.amount)}
                  </span>
                </td>

                {/* Duplicate / Validation Status */}
                <td className="py-3 px-3">
                  {tx.validationErrors.length > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                      <XCircle className="w-3 h-3" /> {tx.validationErrors[0]}
                    </span>
                  ) : tx.duplicateStatus === 'EXACT_DUPLICATE' ? (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20"
                      title={tx.duplicateReason}
                    >
                      <AlertCircle className="w-3 h-3" /> Exact Duplicate
                    </span>
                  ) : tx.duplicateStatus === 'POTENTIAL_DUPLICATE' ? (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"
                      title={tx.duplicateReason}
                    >
                      <AlertTriangle className="w-3 h-3" /> Review Duplicate
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-income bg-income/10 px-2 py-0.5 rounded-full border border-income/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified New
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
