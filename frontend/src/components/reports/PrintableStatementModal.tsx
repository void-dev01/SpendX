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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Top Control Bar (Non-Printable) */}
        <div className="p-3 sm:p-4 sm:px-6 border-b border-slate-200 dark:border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-spendx-blue-primary bg-spendx-blue-primary/10 px-2 py-0.5 rounded-md">
              Statement Preview
            </span>
            <span className="text-xs text-slate-500">• {report.periodLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="btn-spendx-primary px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-slate-800 dark:text-slate-100">
          {/* Statement Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
                  SPEND<span className="text-spendx-blue-primary">X</span>
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 border-l border-slate-300 dark:border-white/20">
                  FINANCIAL INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Official Consolidated Periodic Statement
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <p className="font-bold text-spendx-text-primary dark:text-spendx-soft-purple text-base">
                {report.title}
              </p>
              <p className="text-slate-500 dark:text-slate-400">Statement Period: {report.periodLabel}</p>
              <p className="text-slate-400">
                Generated: {new Date(report.generatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* User & Financial Position Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/70 dark:border-white/10 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Account Holder</span>
              <p className="font-bold text-sm text-spendx-text-primary dark:text-spendx-soft-purple mt-0.5">
                {report.user.name}
              </p>
              <p className="text-slate-500">{report.user.email}</p>
              <p className="text-slate-400 mt-1">Currency: {report.user.currency} (₹)</p>
            </div>

            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Verification Status</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Reconciled Double-Entry Ledger
              </p>
              <p className="text-slate-500 mt-1">
                {report.summary.transactionCount} audited transactions across active accounts
              </p>
            </div>
          </div>

          {/* Cash Flow Summary 4-Col */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Inflows</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                +{transactionService.formatINR(report.summary.totalIncome)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Outflows</span>
              <p className="text-lg font-bold text-rose-500 mt-1 tabular-nums">
                -{transactionService.formatINR(report.summary.totalExpenses)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Net Savings</span>
              <p className={`text-lg font-bold mt-1 tabular-nums ${report.summary.netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {report.summary.netSavings >= 0 ? '+' : ''}{transactionService.formatINR(report.summary.netSavings)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Savings Rate</span>
              <p className="text-lg font-bold text-spendx-blue-primary mt-1 tabular-nums">
                {report.summary.savingsRate}%
              </p>
            </div>
          </div>

          {/* Itemized Transactions Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Itemized Transaction Journal ({report.transactions.length})
            </h4>

            <div className="overflow-x-auto touch-scroll">
              <table className="w-full min-w-[500px] text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 uppercase font-semibold">
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Description</th>
                    <th className="py-2 px-2">Category</th>
                    <th className="py-2 px-2">Account</th>
                    <th className="py-2 px-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {report.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-2 text-slate-400 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-2.5 px-2 font-semibold text-spendx-text-primary dark:text-spendx-soft-purple">
                        {tx.description}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500">{tx.category}</td>
                      <td className="py-2.5 px-2 text-slate-400">{tx.accountName || 'Cash'}</td>
                      <td className={`py-2.5 px-2 text-right font-bold tabular-nums ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statement Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>SPENDX Automated Statement Generator • Verified Financial Record</span>
            <span>Document Ref: SPX-{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
