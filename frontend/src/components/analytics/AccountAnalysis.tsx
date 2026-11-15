import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, ArrowUpRight } from 'lucide-react';
import {
  AccountFinancialItem,
  analyticsService,
} from '@/services/analyticsService';

interface AccountAnalysisProps {
  accounts: AccountFinancialItem[];
}

export const AccountAnalysis: React.FC<AccountAnalysisProps> = ({ accounts }) => {
  const navigate = useNavigate();

  if (accounts.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Account Financial Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Flow reconciliation across registered bank, checking, and credit repositories
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <span>View All Accounts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100/80 dark:border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Account Name</th>
              <th className="py-2.5 px-3 text-right">Inflows</th>
              <th className="py-2.5 px-3 text-right">Outflows</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 dark:divide-white/5">
            {accounts.map((acc) => {
              const isPositive = acc.netCashFlow >= 0;
              return (
                <tr
                  key={acc.accountId}
                  onClick={() => navigate(`/accounts/${acc.accountId}`)}
                  className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200 group-hover:text-spendx-blue-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{acc.accountName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{analyticsService.formatINR(acc.income)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-rose-600 dark:text-rose-400 tabular-nums">
                    {analyticsService.formatINR(acc.expenses)}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold tabular-nums ${
                      isPositive
                        ? 'text-spendx-indigo dark:text-spendx-soft-purple'
                        : 'text-rose-500'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {analyticsService.formatINR(acc.netCashFlow)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    {acc.transactionCount} txns
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
