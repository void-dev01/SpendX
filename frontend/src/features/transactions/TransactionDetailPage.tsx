import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <RoutePlaceholder
      title={`Transaction #${id || 'Record'}`}
      description="Detailed ledger audit entry, merchant metadata, and categorization trace."
      routeId={`/transactions/${id}`}
      icon={ArrowLeftRight}
      badge="Transaction Detail"
    >
      <div className="space-y-4">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Transactions Ledger</span>
        </Link>

        <div className="glass-panel rounded-3xl p-6 border border-white/80 dark:border-white/15 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Transaction ID
              </span>
              <p className="text-base font-bold text-foreground font-mono">{id}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Ledger Entry</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10">
              <span className="text-muted-foreground">Amount</span>
              <p className="text-xl font-bold text-foreground tabular-nums mt-1">₹850.00</p>
            </div>
            <div className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10">
              <span className="text-muted-foreground">Category</span>
              <p className="text-base font-bold text-foreground mt-1">Shopping & Retail</p>
            </div>
            <div className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10">
              <span className="text-muted-foreground">Channel</span>
              <p className="text-base font-bold text-foreground mt-1">UPI Instant Sync</p>
            </div>
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
