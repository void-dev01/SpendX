import React from 'react';
import { X, Printer, Download, Sparkles } from 'lucide-react';
import { GeneratedFinancialReport, reportsService } from '@/services/reportsService';
import { transactionService } from '@/services/transactionService';

interface PrintableStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: GeneratedFinancialReport | null;
}

export const PrintableStatementModal: React.FC<PrintableStatementModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    reportsService.exportToCSV(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-fadeIn">
      <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-elevated border border-border flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Top Control Bar (Non-Printable) */}
        <div className="p-3 sm:p-4 sm:px-6 border-b border-border flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-surface-elevated print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
              Statement Preview
            </span>
            <span className="text-xs text-secondary-text">• {report.periodLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface border border-border hover:bg-surface-elevated text-foreground transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-foreground">
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-display tracking-tight text-foreground">
                  SPEND<span className="text-primary">X</span>
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2 border-l border-border">
                  FINANCIAL INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-secondary-text mt-1">
                Official Consolidated Periodic Statement
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <p className="font-bold font-display text-foreground text-base">
                {report.title}
              </p>
              <p className="text-secondary-text">Statement Period: {report.periodLabel}</p>
              <p className="text-muted-foreground">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* User & Financial Position Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-surface-elevated border border-border text-xs">
            <div>
              <span className="text-muted-foreground uppercase font-semibold text-[10px]">Account Holder</span>
              <p className="font-bold text-sm text-foreground mt-0.5">
                {report.user.name}
              </p>
              <p className="text-secondary-text">{report.user.email}</p>
              <p className="text-muted-foreground mt-1">Currency: {report.user.currency} (₹)</p>
            </div>

            <div>
              <span className="text-muted-foreground uppercase font-semibold text-[10px]">Verification Status</span>
              <p className="font-bold text-income mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Reconciled Double-Entry Ledger
              </p>
              <p className="text-secondary-text mt-1">
                {report.summary.transactionCount} audited transactions across active accounts
              </p>
            </div>
          </div>

          {/* Cash Flow Summary 4-Col */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Total Inflows</span>
              <p className="text-lg font-bold text-income mt-1 tabular-nums">
                +{transactionService.formatINR(report.summary.totalIncome)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Total Outflows</span>
              <p className="text-lg font-bold text-destructive mt-1 tabular-nums">
                -{transactionService.formatINR(report.summary.totalExpenses)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Net Savings</span>
              <p className={`text-lg font-bold mt-1 tabular-nums ${report.summary.netSavings >= 0 ? 'text-income' : 'text-destructive'}`}>
                {report.summary.netSavings >= 0 ? '+' : ''}{transactionService.formatINR(report.summary.netSavings)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border">
              <span className="text-[11px] text-muted-foreground font-semibold uppercase">Savings Rate</span>
              <p className="text-lg font-bold text-primary mt-1 tabular-nums">
                {report.summary.savingsRate}%
              </p>
            </div>
          </div>

          {/* Itemized Transactions Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-text">
              Itemized Transaction Journal ({report.transactions.length})
            </h4>

            <div className="overflow-x-auto touch-scroll">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase font-semibold">
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">Account</th>
                    <th className="py-2 px-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {report.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-elevated">
                      <td className="py-2.5 px-2 text-muted-foreground whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-foreground">
                        {tx.description}
                      </td>
                      <td className="py-2.5 px-2 text-secondary-text">{tx.category}</td>
                      <td className="py-2.5 px-2 text-muted-foreground">{tx.accountName || 'Cash'}</td>
                      <td className={`py-2.5 px-2 text-right font-bold tabular-nums ${tx.type === 'INCOME' ? 'text-income' : 'text-foreground'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statement Footer */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-muted-foreground gap-2">
            <span>SPENDX Automated Statement Generator • Verified Financial Record</span>
            <span>Document Ref: SPX-{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
