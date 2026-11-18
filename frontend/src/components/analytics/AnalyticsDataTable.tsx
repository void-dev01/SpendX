import React from 'react';
import { Download, Table as TableIcon } from 'lucide-react';
import {
  PeriodicTableRow,
  analyticsService,
} from '@/services/analyticsService';

interface AnalyticsDataTableProps {
  rows: PeriodicTableRow[];
}

export const AnalyticsDataTable: React.FC<AnalyticsDataTableProps> = ({ rows }) => {
  if (rows.length === 0) return null;

  const handleDownloadCSV = () => {
    analyticsService.exportAnalyticsCSV(rows);
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-4 sm:p-6 space-y-4 min-w-0 overflow-hidden shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-display text-foreground flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-primary" />
            <span>Periodic Financial Breakdown</span>
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Exact aggregated numbers and savings rate telemetry by interval
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface transition-colors cursor-pointer min-h-[40px] shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-secondary-text" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto touch-scroll -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full min-w-[540px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-3 text-right">Income</th>
              <th className="py-2.5 px-3 text-right">Expenses</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Savings Rate</th>
              <th className="py-2.5 px-3 text-right">Tx Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const isPositive = row.netCashFlow >= 0;
              return (
                <tr key={row.periodKey} className="hover:bg-surface-elevated transition-colors">
                  <td className="py-3 px-3 font-semibold text-foreground">
                    {row.periodLabel}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-income tabular-nums">
                    +{analyticsService.formatINR(row.income)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-destructive tabular-nums">
                    {analyticsService.formatINR(row.expenses)}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold tabular-nums ${
                      isPositive ? 'text-primary' : 'text-destructive'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {analyticsService.formatINR(row.netCashFlow)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-secondary tabular-nums">
                    {row.savingsRate}%
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground tabular-nums">
                    {row.transactionCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
