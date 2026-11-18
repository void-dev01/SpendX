import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Target,
  ArrowDownRight,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { budgetService } from '@/services/budgetService';
import { transactionService } from '@/services/transactionService';

export const BudgetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [txSearch, setTxSearch] = useState('');

  const { data: budgets = [], isLoading: isBudgetLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets(),
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const budget = budgets.find((b) => b.id === id);

  const categoryTransactions = allTransactions
    .filter(
      (tx) =>
        tx.type === 'EXPENSE' &&
        tx.category.toLowerCase() === (budget?.category || '').toLowerCase() &&
        (txSearch === '' || tx.description.toLowerCase().includes(txSearch.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSpent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const allocated = budget?.allocatedAmount || 0;
  const remaining = Math.max(0, allocated - totalSpent);
  const utilization = allocated > 0 ? (totalSpent / allocated) * 100 : 0;

  if (isBudgetLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-36 bg-surface-elevated border border-border rounded" />
        <div className="bg-surface border border-border rounded-2xl p-6 h-64 shadow-card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/budgets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Budgets</span>
        </Link>
      </div>

      {/* Hero Overview */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {budget?.category || 'Category'} Budget
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-income/10 text-income">
                  <CheckCircle2 className="w-3 h-3" /> Active Allocation
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mt-0.5">
                {budget?.name || `Budget #${id}`}
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-secondary-text font-medium">Allocated Ceiling</span>
            <div className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums text-foreground mt-0.5">
              {budgetService.formatINR(allocated)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-foreground">
              {utilization.toFixed(1)}% Consumed
            </span>
            <span className="text-secondary-text">
              {budgetService.formatINR(totalSpent)} spent of {budgetService.formatINR(allocated)}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-surface-elevated border border-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilization >= 100
                  ? 'bg-destructive'
                  : utilization >= 80
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="text-secondary-text">Recorded Outflow</span>
            <p className="font-display font-bold text-expense text-sm tabular-nums">
              {budgetService.formatINR(totalSpent)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="text-secondary-text">Remaining Reserve</span>
            <p className="font-display font-bold text-income text-sm tabular-nums">
              {budgetService.formatINR(remaining)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="text-secondary-text">Warning Threshold</span>
            <p className="font-display font-bold text-foreground text-sm">
              {budget?.alertThreshold || 80}%
            </p>
          </div>
        </div>

        {budget?.notes && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs text-foreground">
            <span className="font-semibold text-secondary-text block mb-1">Budget Description</span>
            <p>{budget.notes}</p>
          </div>
        )}
      </div>

      {/* Contributing Transactions */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">
              Contributing Expenses ({categoryTransactions.length})
            </h2>
            <p className="text-xs text-secondary-text">
              Verified debit transactions attributed to {budget?.category || 'this category'}.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              placeholder="Search expenses..."
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>
        </div>

        {categoryTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-secondary-text">
            No expenses recorded for this category yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {categoryTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {tx.description}
                    </h3>
                    <p className="text-[11px] text-secondary-text">
                      {tx.accountName} • {new Date(tx.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-bold text-sm text-foreground tabular-nums">
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
