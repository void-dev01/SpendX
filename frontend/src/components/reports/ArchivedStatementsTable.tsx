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
    <div className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-4 min-w-0 overflow-hidden shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-display text-foreground">
            Monthly Financial Statements
          </h3>
          <p className="text-xs text-secondary-text">
            Reconciled monthly ledger archives ready for tax filing and personal accounting
          </p>
        </div>
      </div>

      <div className="overflow-x-auto touch-scroll -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full min-w-[580px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3">Statement Cycle</th>
              <th className="py-3 px-3">Total Inflows</th>
              <th className="py-3 px-3">Total Outflows</th>
              <th className="py-3 px-3">Net Cash Flow</th>
              <th className="py-3 px-3">Savings Rate</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {statements.map((stmt) => (
              <tr
                key={stmt.id}
                className="hover:bg-surface-elevated transition-colors group"
              >
                {/* Statement Cycle */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {stmt.monthName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stmt.transactionsCount} txs • {stmt.fileSizeApprox}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Total Inflows */}
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-income tabular-nums">
                    +{transactionService.formatINR(stmt.totalIncome)}
                  </span>
                </td>

                {/* Total Outflows */}
                <td className="py-3.5 px-3">
                  <span className="font-semibold text-destructive tabular-nums">
                    -{transactionService.formatINR(stmt.totalExpenses)}
                  </span>
                </td>

                {/* Net Cash Flow */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-1 font-bold tabular-nums">
                    {stmt.netSavings >= 0 ? (
                      <span className="text-income flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        {transactionService.formatINR(stmt.netSavings)}
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        {transactionService.formatINR(Math.abs(stmt.netSavings))}
                      </span>
                    )}
                  </div>
                </td>

                {/* Savings Rate */}
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums ${
                      stmt.savingsRate >= 30
                        ? 'bg-income/10 text-income border border-income/20'
                        : stmt.savingsRate > 0
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-surface-elevated text-secondary-text border border-border'
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
                      className="p-1.5 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadCSV(stmt)}
                      title="Download CSV ledger"
                      className="p-1.5 rounded-xl text-secondary-text hover:text-income hover:bg-income/10 transition-colors"
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
