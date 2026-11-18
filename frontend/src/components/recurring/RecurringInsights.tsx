import React from 'react';
import { Lightbulb } from 'lucide-react';
import { RecurringRecord, recurringService } from '@/services/recurringService';

interface RecurringInsightsProps {
  payments: RecurringRecord[];
}

export const RecurringInsights: React.FC<RecurringInsightsProps> = ({ payments }) => {
  const activePayments = payments.filter((p) => p.status !== 'CANCELLED' && p.status !== 'PAUSED');

  // Compute annualized cost
  const annualTotal = activePayments.reduce((sum, p) => {
    switch (p.frequency) {
      case 'DAILY':
        return sum + p.amount * 365;
      case 'WEEKLY':
        return sum + p.amount * 52;
      case 'MONTHLY':
        return sum + p.amount * 12;
      case 'QUARTERLY':
        return sum + p.amount * 4;
      case 'YEARLY':
        return sum + p.amount;
      default:
        return sum + p.amount * 12;
    }
  }, 0);

  // Find largest single recurring payment
  const largestPayment = activePayments.reduce<RecurringRecord | null>((max, p) => {
    if (!max || p.amount > max.amount) return p;
    return max;
  }, null);

  // Group by category to find top recurring commitment category
  const categoryTotals: Record<string, number> = {};
  activePayments.forEach((p) => {
    categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.amount;
  });

  let topCategory = 'Subscriptions';
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = amt;
    }
  });

  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="text-base font-display font-bold text-foreground">
          Recurring Intelligence & Projections
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Annualized Projection */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border shadow-xs">
          <span className="text-xs text-secondary-text font-medium">
            Projected Annual Outflow
          </span>
          <p className="text-xl font-display font-bold text-foreground mt-1 tabular-nums">
            {recurringService.formatINR(annualTotal)}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">
            Total recurring liability per calendar year
          </p>
        </div>

        {/* Top Category */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border shadow-xs">
          <span className="text-xs text-secondary-text font-medium">
            Top Category Obligation
          </span>
          <p className="text-xl font-display font-bold text-primary mt-1 truncate">
            {topCategory}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">
            {recurringService.formatINR(topCategoryAmount)} / month commitment
          </p>
        </div>

        {/* Highest Single Commitment */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border shadow-xs">
          <span className="text-xs text-secondary-text font-medium">
            Largest Commitment
          </span>
          <p className="text-xl font-display font-bold text-secondary mt-1 truncate">
            {largestPayment ? largestPayment.name : 'None'}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">
            {largestPayment ? `${recurringService.formatINR(largestPayment.amount)} / ${largestPayment.frequency.toLowerCase()}` : 'No active subscriptions'}
          </p>
        </div>
      </div>
    </div>
  );
};
