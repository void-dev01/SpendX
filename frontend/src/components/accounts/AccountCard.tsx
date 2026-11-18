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
        return <Building2 className="w-5 h-5 text-primary" />;
      case 'SAVINGS':
        return <Landmark className="w-5 h-5 text-income" />;
      case 'CREDIT_CARD':
        return <CreditCard className="w-5 h-5 text-warning" />;
      case 'CASH':
        return <Banknote className="w-5 h-5 text-secondary" />;
      default:
        return <Wallet className="w-5 h-5 text-primary" />;
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
    <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex flex-col justify-between relative group hover:border-primary/40 hover:shadow-elevated transition-all">
      {/* Top Header: Icon, Type & Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0 shadow-xs">
            {getAccountIcon(account.type)}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              {getTypeLabel(account.type)}
            </span>
            <h3
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="text-base font-display font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate max-w-[180px] leading-tight"
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
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            aria-label="Account actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-30 w-36 rounded-xl bg-surface border border-border p-1.5 shadow-elevated text-left">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/accounts/${account.id}`);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
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
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(account);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-expense hover:bg-expense/10 transition-colors"
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
        <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider block">
          {account.type === 'CREDIT_CARD' ? 'Outstanding Amount' : 'Current Balance'}
        </span>
        <div
          className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight tabular-nums mt-1 leading-none ${
            account.type === 'CREDIT_CARD'
              ? 'text-warning'
              : 'text-foreground'
          }`}
        >
          {accountService.formatINR(account.balance)}
        </div>
      </div>

      {/* Bottom Footer: Masked Number & Status */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-income" />
          <span className="font-mono text-[11px] text-secondary-text">
            {account.lastFourDigits ? `•••• ${account.lastFourDigits}` : account.institution}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/accounts/${account.id}`)}
          className="inline-flex items-center gap-1 font-bold text-primary hover:underline transition-colors cursor-pointer"
        >
          <span>Ledger</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
