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
    if (healthScore.overallScore >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (healthScore.overallScore >= 65) return 'text-spendx-blue-primary bg-spendx-blue-primary/10 border-spendx-blue-primary/20';
    if (healthScore.overallScore >= 45) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Financial Health Score */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Financial Health
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
            {healthScore.overallScore}
          </span>
          <span className="text-xs text-slate-400">/ 100</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ml-auto ${getScoreColor()}`}>
            {healthScore.rating.replace('_', ' ')}
          </span>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Synthesized from 4 pillars of liquidity & debt
        </div>
      </div>

      {/* 2. Actionable Opportunities */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Action Opportunities
          </span>
          <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-spendx-blue-primary tabular-nums">
            {summary.actionableOpportunities}
          </span>
          <span className="text-xs text-slate-500">identified</span>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Discretionary optimizations & surplus captures
        </div>
      </div>

      {/* 3. Potential Monthly Savings */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Potential Monthly Savings
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
            {transactionService.formatINR(summary.potentialMonthlySavings)}
          </span>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          Annualized ~{transactionService.formatINR(summary.potentialMonthlySavings * 12)}
        </div>
      </div>

      {/* 4. Critical Alerts */}
      <div className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Critical Alerts
          </span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${summary.criticalAlertsCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 mb-1 flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${summary.criticalAlertsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {summary.criticalAlertsCount}
          </span>
          <span className="text-xs text-slate-500">
            {summary.criticalAlertsCount === 0 ? 'all clear' : 'require action'}
          </span>
        </div>

        <div className="text-xs text-slate-400 pt-2 border-t border-slate-100/60 dark:border-white/5 truncate">
          {summary.criticalAlertsCount === 0 ? 'Zero active budget or bill overruns' : 'Overdue bills or budget overruns'}
        </div>
      </div>
    </div>
  );
};
