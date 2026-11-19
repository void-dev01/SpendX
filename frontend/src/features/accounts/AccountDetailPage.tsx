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
        return <Building2 className="w-6 h-6 text-primary" />;
      case 'SAVINGS':
        return <Landmark className="w-6 h-6 text-income" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-6 h-6 text-warning" />;
      case 'CASH':
        return <Banknote className="w-6 h-6 text-secondary" />;
      default:
        return <Wallet className="w-6 h-6 text-primary" />;
    }
  };

  if (isAccountLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-36 bg-surface-elevated rounded" />
        <div className="bg-surface border border-border p-6 rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/accounts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Accounts</span>
        </Link>
      </div>

      {/* Account Hero Card */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 sm:p-8 border border-border shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-center shrink-0 shadow-xs">
              {getAccountIcon(account?.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">
                  {account?.institution || 'Banking Institution'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-foreground border border-primary/40">
                  <CheckCircle2 className="w-3 h-3 text-primary" /> Active Connection
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-foreground mt-0.5">
                {account?.name || `Account #${id}`}
              </h1>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-secondary-text font-medium">
              {account?.type === 'CREDIT_CARD' ? 'Outstanding Balance' : 'Available Balance'}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums mt-0.5 ${
                account?.type === 'CREDIT_CARD'
                  ? 'text-warning'
                  : 'text-foreground'
              }`}
            >
              {accountService.formatINR(account?.balance || 0)}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border space-y-1">
            <span className="text-secondary-text font-medium">Account Classification</span>
            <p className="font-bold text-foreground text-sm">
              {account?.type || 'BANK'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border space-y-1">
            <div className="flex items-center gap-1 text-secondary-text font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-income" />
              <span>Masked Number</span>
            </div>
            <p className="font-mono font-bold text-foreground text-sm">
              {account?.lastFourDigits ? `•••• •••• •••• ${account.lastFourDigits}` : 'Wallet ID'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border space-y-1">
            <div className="flex items-center gap-1 text-secondary-text font-medium">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Registered Date</span>
            </div>
            <p className="font-bold text-foreground text-sm">
              {account ? new Date(account.createdAt).toLocaleDateString('en-IN') : 'Recent'}
            </p>
          </div>
        </div>

        {account?.notes && (
          <div className="p-4 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-xs text-secondary-text">
            <span className="font-bold text-foreground block mb-1">Account Remarks</span>
            <p>{account.notes}</p>
          </div>
        )}
      </div>

      {/* Associated Transactions Activity */}
      <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 sm:p-8 border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">
              Account Activity ({accountTransactions.length})
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Historical ledger entries debited or credited to this account.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Filter entries..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-medium"
            >
              <option value="ALL">All Flow</option>
              <option value="INCOME">Income (+)</option>
              <option value="EXPENSE">Expense (-)</option>
            </select>
          </div>
        </div>

        {/* Transactions list */}
        {accountTransactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-secondary-text font-medium">
            No transactions found for this account.
          </div>
        ) : (
          <div className="space-y-2.5">
            {accountTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-income/10 text-income'
                          : 'bg-expense/10 text-expense'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {tx.description}
                      </h3>
                      <p className="text-[11px] text-secondary-text font-medium">
                        {tx.category} • {new Date(tx.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold text-sm tabular-nums ${
                        isIncome ? 'text-income' : 'text-foreground'
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
