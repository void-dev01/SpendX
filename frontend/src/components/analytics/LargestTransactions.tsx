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
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            Largest Transactions
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Single most impactful individual debits and credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border">
            <button
              type="button"
              onClick={() => setTab('EXPENSE')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'EXPENSE'
                  ? 'bg-destructive text-destructive-foreground shadow-xs'
                  : 'text-secondary-text hover:text-foreground'
              }`}
            >
              Highest Expenses
            </button>
            <button
              type="button"
              onClick={() => setTab('INCOME')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'INCOME'
                  ? 'bg-income text-income-foreground shadow-xs'
                  : 'text-secondary-text hover:text-foreground'
              }`}
            >
              Highest Income
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            <span>All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No transactions found for this view.
        </div>
      ) : (
        <div className="space-y-2">
          {currentList.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/transactions/${t.id}`)}
              className="p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between text-xs group"
            >
              <div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors block">
                  {t.description || t.merchantName || 'Transaction'}
                </span>
                <span className="text-[10px] text-muted-foreground">
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
                      ? 'text-income'
                      : 'text-destructive'
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
