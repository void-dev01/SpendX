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
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            Account Financial Analysis
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Flow reconciliation across registered bank, checking, and credit repositories
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <span>View All Accounts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Account Name</th>
              <th className="py-2.5 px-3 text-right">Inflows</th>
              <th className="py-2.5 px-3 text-right">Outflows</th>
              <th className="py-2.5 px-3 text-right">Net Flow</th>
              <th className="py-2.5 px-3 text-right">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {accounts.map((acc) => {
              const isPositive = acc.netCashFlow >= 0;
              return (
                <tr
                  key={acc.accountId}
                  onClick={() => navigate(`/accounts/${acc.accountId}`)}
                  className="hover:bg-surface-elevated transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[200px]">{acc.accountName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-income tabular-nums">
                    +{analyticsService.formatINR(acc.income)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-destructive tabular-nums">
                    {analyticsService.formatINR(acc.expenses)}
                  </td>
                  <td
                    className={`py-3 px-3 text-right font-bold tabular-nums ${
                      isPositive
                        ? 'text-primary'
                        : 'text-destructive'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {analyticsService.formatINR(acc.netCashFlow)}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground tabular-nums">
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
