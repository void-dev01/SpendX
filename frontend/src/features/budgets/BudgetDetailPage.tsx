import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Target,
  ArrowDownRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { budgetService } from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';

export const BudgetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [txSearch, setTxSearch] = useState('');

  // Load budget
  const { data: budget, isLoading: isBudgetLoading } = useQuery({
    queryKey: ['budget', id],
    queryFn: () => (id ? budgetService.getBudgetById(id) : null),
  });

  // Load all transactions
  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Calculate actual spent for this budget's category
  const categoryTransactions = useMemo(() => {
    if (!budget) return [];
    return allTransactions.filter((t) => {
      if (t.type !== 'EXPENSE') return false;
      if (t.category !== budget.category) return false;
      if (txSearch.trim()) {
        const q = txSearch.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          (t.merchantName?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [allTransactions, budget, txSearch]);

  const totalSpent = useMemo(() => {
    return categoryTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [categoryTransactions]);

  const allocated = budget?.allocatedAmount || 0;
  const remaining = Math.max(0, allocated - totalSpent);
  const utilization = allocated > 0 ? (totalSpent / allocated) * 100 : 0;

  if (isBudgetLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-36 bg-slate-200/70 dark:bg-slate-800 rounded" />
        <div className="glass-panel p-6 rounded-3xl h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/budgets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Budgets</span>
        </Link>
      </div>

      {/* Hero Overview */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-glass-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/60 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center shrink-0 shadow-sm">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {budget?.category || 'Category'} Budget
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Active Allocation
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-spendx-indigo dark:text-spendx-soft-purple mt-0.5">
                {budget?.name || `Budget #${id}`}
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium">Allocated Ceiling</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-spendx-indigo dark:text-spendx-soft-purple mt-0.5">
              {budgetService.formatINR(allocated)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">
              {utilization.toFixed(1)}% Consumed
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {budgetService.formatINR(totalSpent)} spent of {budgetService.formatINR(allocated)}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200/60 dark:bg-slate-700/50 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilization >= 100
                  ? 'bg-rose-500'
                  : utilization >= 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary'
              }`}
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400">Recorded Outflow</span>
            <p className="font-bold text-rose-600 dark:text-rose-400 text-sm tabular-nums">
              {budgetService.formatINR(totalSpent)}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400">Remaining Reserve</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums">
              {budgetService.formatINR(remaining)}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400">Warning Threshold</span>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {budget?.alertThreshold || 80}%
            </p>
          </div>
        </div>

        {budget?.notes && (
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-400 block mb-1">Budget Description</span>
            <p>{budget.notes}</p>
          </div>
        )}
      </div>

      {/* Contributing Transactions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-glass space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Contributing Expenses ({categoryTransactions.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified debit transactions attributed to {budget?.category || 'this category'}.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              placeholder="Search expenses..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
            />
          </div>
        </div>

        {categoryTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No expenses recorded for this category yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {categoryTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between gap-3 hover:border-spendx-blue-primary/30 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {tx.description}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {tx.accountName} • {new Date(tx.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 tabular-nums">
                    -{budgetService.formatINR(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetDetailPage;
