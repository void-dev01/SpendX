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
    <div className="glass-panel p-4 sm:p-6 rounded-3xl space-y-4 min-w-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-spendx-blue-primary" />
            <span>Periodic Financial Breakdown</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Exact aggregated numbers and savings rate telemetry by interval
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCSV}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer min-h-[40px]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto touch-scroll -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full min-w-[540px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100/80 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-3 text-right">Income</th>
              <th className="py-2.5 px-3 text-right">Expenses</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Savings Rate</th>
              <th className="py-2.5 px-3 text-right">Tx Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 dark:divide-white/5">
            {rows.map((row) => {
              const isPositive = row.netCashFlow >= 0;
              return (
                <tr key={row.periodKey} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {row.periodLabel}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{analyticsService.formatINR(row.income)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-rose-600 dark:text-rose-400 tabular-nums">
                    {analyticsService.formatINR(row.expenses)}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold tabular-nums ${
                      isPositive ? 'text-spendx-indigo dark:text-spendx-soft-purple' : 'text-rose-500'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {analyticsService.formatINR(row.netCashFlow)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-spendx-purple-primary tabular-nums">
                    {row.savingsRate}%
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
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
