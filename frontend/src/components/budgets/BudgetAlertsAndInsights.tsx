import React from 'react';
import { AlertTriangle, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BudgetAlert, BudgetInsight } from '@/services/budgetService';

interface BudgetAlertsAndInsightsProps {
  alerts: BudgetAlert[];
  insights: BudgetInsight[];
}

export const BudgetAlertsAndInsights: React.FC<BudgetAlertsAndInsightsProps> = ({
  alerts,
  insights,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Alerts Section */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Budget Alerts & Thresholds
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications triggered when category spending reaches configured ceilings.
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="p-4 rounded-2xl glass-surface border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">All Budgets Within Healthy Limits</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                No active categories have breached warning thresholds for this period.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isDanger = alert.severity === 'DANGER';
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-2xl glass-surface border text-xs flex items-start justify-between gap-3 ${
                    isDanger
                      ? 'border-rose-500/30 bg-rose-500/5'
                      : 'border-amber-500/30 bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`p-1 rounded-md mt-0.5 ${
                        isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">
                        {alert.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/budgets/${alert.budgetId}`}
                    className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-spendx-blue-primary transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Insights Section */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-spendx-purple-primary/30 bg-gradient-to-br from-spendx-soft-purple/40 via-white/70 to-spendx-lavender/30 dark:from-spendx-indigo/30 dark:via-slate-900/60 dark:to-spendx-purple-primary/10 backdrop-blur-xl shadow-glass flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-spendx-purple-primary animate-pulse" />
            <h3 className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Deterministic Budget Insights
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data-driven observations computed directly from your verified ledger entries.
          </p>
        </div>

        {insights.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Insights will populate once category expenses are recorded.
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl glass-surface border border-white/80 dark:border-white/10 text-xs space-y-1"
              >
                <h4 className="font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 font-medium">
          Deterministic financial calculations • SPENDX Intelligence
        </div>
      </div>
    </div>
  );
};
