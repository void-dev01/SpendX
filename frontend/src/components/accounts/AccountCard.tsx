import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { AccountRecord, accountService } from '@/services/accountService';

interface AccountCardProps {
  account: AccountRecord;
  onEdit: (account: AccountRecord) => void;
  onDelete: (account: AccountRecord) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getAccountIcon = (type: AccountRecord['type']) => {
    switch (type) {
      case 'BANK':
        return <Building2 className="w-5 h-5 text-spendx-blue-primary" />;
      case 'SAVINGS':
        return <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-5 h-5 text-amber-500" />;
      case 'CASH':
        return <Banknote className="w-5 h-5 text-spendx-purple-primary" />;
      default:
        return <Wallet className="w-5 h-5 text-spendx-blue-primary" />;
    }
  };

  const getTypeLabel = (type: AccountRecord['type']) => {
    switch (type) {
      case 'BANK':
        return 'Checking';
      case 'SAVINGS':
        return 'Savings Vault';
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'CASH':
        return 'Cash Wallet';
      default:
        return 'Account';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass flex flex-col justify-between relative group hover:border-spendx-blue-primary/40 transition-all">
      {/* Top Header: Icon, Type & Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
            {getAccountIcon(account.type)}
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {getTypeLabel(account.type)}
            </span>
            <h3
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple hover:text-spendx-blue-primary transition-colors cursor-pointer truncate max-w-[180px]"
            >
              {account.name}
            </h3>
          </div>
        </div>

        {/* More Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Account actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl glass-panel border border-white/80 dark:border-white/15 p-1.5 shadow-xl text-left">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/accounts/${account.id}`);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(account);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <div className="my-1 border-t border-slate-100/60 dark:border-white/5" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(account);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Center: Balance */}
      <div className="my-4">
        <span className="text-[11px] text-slate-400 font-medium">
          {account.type === 'CREDIT_CARD' ? 'Outstanding Amount' : 'Current Balance'}
        </span>
        <div
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums mt-0.5 ${
            account.type === 'CREDIT_CARD'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {accountService.formatINR(account.balance)}
        </div>
      </div>

      {/* Bottom Footer: Masked Number & Status */}
      <div className="pt-3 border-t border-slate-100/60 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-mono text-[11px]">
            {account.lastFourDigits ? `•••• ${account.lastFourDigits}` : account.institution}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/accounts/${account.id}`)}
          className="inline-flex items-center gap-1 font-semibold text-spendx-blue-primary hover:text-spendx-purple-primary transition-colors cursor-pointer"
        >
          <span>Ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
