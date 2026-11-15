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
    <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              Tax Optimization & Deductions ({taxSummary.taxYear})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorized tax-allowable expenditures compiled from your verified financial ledger
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExportTaxReport}
          className="btn-spendx-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 self-start sm:self-auto shrink-0"
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
            className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 flex flex-col justify-between space-y-3"
          >
            <div>
              <span className="text-[11px] font-bold text-spendx-blue-primary">
                {b.bucket}
              </span>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {b.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
              <div>
                <span className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
                  {transactionService.formatINR(b.totalAmount)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {b.transactionCount} transactions
                </span>
              </div>

              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
