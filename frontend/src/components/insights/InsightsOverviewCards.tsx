import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { InsightsOverviewSummary } from '@/services/insightsService';
import { transactionService } from '@/services/transactionService';

interface InsightsOverviewCardsProps {
  summary: InsightsOverviewSummary;
}

export const InsightsOverviewCards: React.FC<InsightsOverviewCardsProps> = ({ summary }) => {
  const { healthScore } = summary;

  const getScoreColor = () => {
    if (healthScore.overallScore >= 80) return 'text-income bg-income/10 border-income/20';
    if (healthScore.overallScore >= 65) return 'text-primary bg-primary/10 border-primary/20';
    if (healthScore.overallScore >= 45) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-destructive bg-destructive/10 border-destructive/20';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Financial Health Score */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Financial Health
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-display tracking-tight text-foreground tabular-nums">
            {healthScore.overallScore}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ml-auto ${getScoreColor()}`}>
            {healthScore.rating.replace('_', ' ')}
          </span>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Synthesized from 4 pillars of liquidity & debt
        </div>
      </div>

      {/* 2. Actionable Opportunities */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Action Opportunities
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold font-display tracking-tight text-primary tabular-nums">
            {summary.actionableOpportunities}
          </span>
          <span className="text-xs text-secondary-text">identified</span>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Discretionary optimizations & surplus captures
        </div>
      </div>

      {/* 3. Potential Monthly Savings */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Potential Monthly Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-income/10 text-income flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-income tabular-nums">
            {transactionService.formatINR(summary.potentialMonthlySavings)}
          </span>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          Annualized ~{transactionService.formatINR(summary.potentialMonthlySavings * 12)}
        </div>
      </div>

      {/* 4. Critical Alerts */}
      <div className="rounded-2xl bg-surface border border-border p-5 flex flex-col justify-between shadow-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            Critical Alerts
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${summary.criticalAlertsCount > 0 ? 'bg-destructive/10 text-destructive' : 'bg-income/10 text-income'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className={`text-3xl font-bold font-display tracking-tight tabular-nums ${summary.criticalAlertsCount > 0 ? 'text-destructive' : 'text-income'}`}>
            {summary.criticalAlertsCount}
          </span>
          <span className="text-xs text-secondary-text">
            {summary.criticalAlertsCount === 0 ? 'all clear' : 'require action'}
          </span>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border truncate">
          {summary.criticalAlertsCount === 0 ? 'Zero active budget or bill overruns' : 'Overdue bills or budget overruns'}
        </div>
      </div>
    </div>
  );
};
