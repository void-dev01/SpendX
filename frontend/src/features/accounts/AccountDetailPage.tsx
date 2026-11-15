import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Building2,
  Landmark,
  CreditCard,
  Banknote,
  Wallet,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { accountService, AccountRecord } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';

export const AccountDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [txSearch, setTxSearch] = useState('');
  const [txType, setTxType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  // Load account
  const { data: account, isLoading: isAccountLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => (id ? accountService.getAccountById(id) : null),
  });

  // Load all transactions to filter by this account
  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  // Filter transactions belonging to this account
  const accountTransactions = useMemo(() => {
    if (!id) return [];
    return allTransactions.filter((t) => {
      if (t.accountId !== id) return false;
      if (txType !== 'ALL' && t.type !== txType) return false;
      if (txSearch.trim()) {
        const q = txSearch.toLowerCase();
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        return matchesDesc || matchesCat;
      }
      return true;
    });
  }, [allTransactions, id, txType, txSearch]);

  const getAccountIcon = (type?: AccountRecord['type']) => {
    switch (type) {
      case 'BANK':
        return <Building2 className="w-6 h-6 text-spendx-blue-primary" />;
      case 'SAVINGS':
        return <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-6 h-6 text-amber-500" />;
      case 'CASH':
        return <Banknote className="w-6 h-6 text-spendx-purple-primary" />;
      default:
        return <Wallet className="w-6 h-6 text-spendx-blue-primary" />;
    }
  };

  if (isAccountLoading) {
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
          to="/accounts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Accounts</span>
        </Link>
      </div>

      {/* Account Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-glass-elevated space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/60 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/70 dark:bg-white/5 border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
              {getAccountIcon(account?.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {account?.institution || 'Banking Institution'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Active Connection
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-spendx-indigo dark:text-spendx-soft-purple mt-0.5">
                {account?.name || `Account #${id}`}
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium">
              {account?.type === 'CREDIT_CARD' ? 'Outstanding Balance' : 'Available Balance'}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums mt-0.5 ${
                account?.type === 'CREDIT_CARD'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {accountService.formatINR(account?.balance || 0)}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <span className="text-slate-400">Account Classification</span>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {account?.type || 'BANK'}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Masked Number</span>
            </div>
            <p className="font-mono font-bold text-slate-800 dark:text-slate-100 text-sm">
              {account?.lastFourDigits ? `•••• •••• •••• ${account.lastFourDigits}` : 'Wallet ID'}
            </p>
          </div>

          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-spendx-blue-primary" />
              <span>Registered Date</span>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {account ? new Date(account.createdAt).toLocaleDateString('en-IN') : 'Recent'}
            </p>
          </div>
        </div>

        {account?.notes && (
          <div className="p-4 rounded-xl glass-surface border border-white/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-400 block mb-1">Account Remarks</span>
            <p>{account.notes}</p>
          </div>
        )}
      </div>

      {/* Associated Transactions Activity */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-glass space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100/60 dark:border-white/10">
          <div>
            <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Account Activity ({accountTransactions.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Historical ledger entries debited or credited to this account.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Filter entries..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-spendx-blue-primary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl text-xs glass-surface border border-white/80 dark:border-white/10 font-medium"
            >
              <option value="ALL">All Flow</option>
              <option value="INCOME">Income (+)</option>
              <option value="EXPENSE">Expense (-)</option>
            </select>
          </div>
        </div>

        {/* Transactions list */}
        {accountTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No transactions found for this account.
          </div>
        ) : (
          <div className="space-y-2.5">
            {accountTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between gap-3 hover:border-spendx-blue-primary/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {tx.description}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {tx.category} • {new Date(tx.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {accountService.formatINR(tx.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailPage;
