import React from 'react';
import {
  ShoppingBag,
  Briefcase,
  Zap,
  Fuel,
  Tv,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Shield,
  Ticket,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardTransaction, dashboardService } from '@/services/dashboardService';

interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Fuel':
        return <Fuel className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Ticket':
        return <Ticket className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Recent Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your latest verified financial activity.
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer group"
        >
          View All Transactions
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No transactions recorded for this period.
        </div>
      ) : (
        <>
          {/* Desktop Table View (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100/60 dark:border-white/5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1">Transaction</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 pr-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/40 dark:divide-white/5">
                {transactions.map((txn) => {
                  const isIncome = txn.type === 'income';
                  return (
                    <tr
                      key={txn.id}
                      className="group hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pl-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {getIcon(txn.iconName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                              {txn.title}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {txn.merchant}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                          {txn.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {txn.date}
                      </td>

                      <td className="py-3 pr-1 text-right">
                        <div
                          className={`inline-flex items-center justify-end gap-1 font-bold text-sm tabular-nums ${
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          <span>
                            {isIncome ? '+' : '-'}
                            {dashboardService.formatINR(txn.amount)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (< md) */}
          <div className="md:hidden space-y-3">
            {transactions.map((txn) => {
              const isIncome = txn.type === 'income';
              return (
                <div
                  key={txn.id}
                  className="p-3 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {getIcon(txn.iconName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {txn.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <span className="truncate">{txn.category}</span>
                        <span>•</span>
                        <span className="shrink-0">{txn.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {dashboardService.formatINR(txn.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
