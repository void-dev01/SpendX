import React from 'react';
import { Receipt, ShieldCheck, Download } from 'lucide-react';
import { TaxDeductibleSummary } from '@/services/reportsService';
import { transactionService } from '@/services/transactionService';

interface TaxSummarySectionProps {
  taxSummary: TaxDeductibleSummary;
  onExportTaxReport: () => void;
}

export const TaxSummarySection: React.FC<TaxSummarySectionProps> = ({
  taxSummary,
  onExportTaxReport,
}) => {
  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-5 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-foreground">
              Tax Optimization & Deductions ({taxSummary.taxYear})
            </h3>
            <p className="text-xs text-secondary-text">
              Categorized tax-allowable expenditures compiled from your verified financial ledger
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExportTaxReport}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0 min-h-[38px]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Tax Schedule</span>
        </button>
      </div>

      {/* Deductible Buckets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {taxSummary.buckets.map((b) => (
          <div
            key={b.bucket}
            className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[11px] font-bold text-primary">
                {b.bucket}
              </span>
              <p className="text-xs text-secondary-text mt-1 line-clamp-2">
                {b.description}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-baseline justify-between">
              <div>
                <span className="text-lg font-bold font-display text-foreground tabular-nums">
                  {transactionService.formatINR(b.totalAmount)}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {b.transactionCount} transactions
                </span>
              </div>

              <ShieldCheck className="w-4 h-4 text-income" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
