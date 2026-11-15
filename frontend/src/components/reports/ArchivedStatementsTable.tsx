import React from 'react';
import { FileText, Download, Printer, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MonthlyStatementRecord } from '@/services/reportsService';
import { transactionService } from '@/services/transactionService';

interface ArchivedStatementsTableProps {
  statements: MonthlyStatementRecord[];
  onDownloadCSV: (statement: MonthlyStatementRecord) => void;
  onPreviewStatement: (statement: MonthlyStatementRecord) => void;
}

export const ArchivedStatementsTable: React.FC<ArchivedStatementsTableProps> = ({
  statements,
  onDownloadCSV,
  onPreviewStatement,
}) => {
  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
            Monthly Financial Statements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reconciled monthly ledger archives ready for tax filing and personal accounting
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Statement Cycle</th>
              <th className="py-3 px-3">Total Inflows</th>
              <th className="py-3 px-3">Total Outflows</th>
              <th className="py-3 px-3">Net Cash Flow</th>
              <th className="py-3 px-3">Savings Rate</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {statements.map((stmt) => (
              <tr
                key={stmt.id}
                className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group"
              >
                {/* Statement Cycle */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-spendx-text-primary dark:text-spendx-soft-purple group-hover:text-spendx-blue-primary transition-colors">
                        {stmt.monthName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {stmt.transactionsCount} txs • {stmt.fileSizeApprox}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Total Inflows */}
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{transactionService.formatINR(stmt.totalIncome)}
                  </span>
                </td>

                {/* Total Outflows */}
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-rose-500 tabular-nums">
                    -{transactionService.formatINR(stmt.totalExpenses)}
                  </span>
                </td>

                {/* Net Cash Flow */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1 font-bold tabular-nums">
                    {stmt.netSavings >= 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        {transactionService.formatINR(stmt.netSavings)}
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        {transactionService.formatINR(Math.abs(stmt.netSavings))}
                      </span>
                    )}
                  </div>
                </td>

                {/* Savings Rate */}
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      stmt.savingsRate >= 30
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : stmt.savingsRate > 0
                        ? 'bg-spendx-blue-primary/10 text-spendx-blue-primary'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                    }`}
                  >
                    {stmt.savingsRate}%
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewStatement(stmt)}
                      title="View printable statement"
                      className="p-1.5 rounded-xl text-slate-500 hover:text-spendx-blue-primary hover:bg-spendx-blue-primary/10 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadCSV(stmt)}
                      title="Download CSV ledger"
                      className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
