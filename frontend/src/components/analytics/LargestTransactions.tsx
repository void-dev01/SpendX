import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { TransactionRecord, transactionService } from '@/services/transactionService';

interface LargestTransactionsProps {
  expenses: TransactionRecord[];
  income: TransactionRecord[];
}

export const LargestTransactions: React.FC<LargestTransactionsProps> = ({
  expenses,
  income,
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const currentList = tab === 'EXPENSE' ? expenses : income;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Largest Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Single most impactful individual debits and credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl glass-surface border border-white/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setTab('EXPENSE')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'EXPENSE'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              Highest Expenses
            </button>
            <button
              type="button"
              onClick={() => setTab('INCOME')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'INCOME'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              Highest Income
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
          >
            <span>All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No transactions found for this view.
        </div>
      ) : (
        <div className="space-y-2">
          {currentList.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/transactions/${t.id}`)}
              className="p-3 rounded-2xl glass-surface border border-white/60 dark:border-white/5 hover:border-spendx-blue-primary/30 transition-all cursor-pointer flex items-center justify-between text-xs group"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-spendx-blue-primary transition-colors block">
                  {t.description || t.merchantName || 'Transaction'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {t.category} • {t.accountName} •{' '}
                  {new Date(t.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`font-bold tabular-nums ${
                    t.type === 'INCOME'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {t.type === 'INCOME' ? '+' : '-'}
                  {transactionService.formatINR(t.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
