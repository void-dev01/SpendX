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
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-base font-display font-bold text-foreground">
              Budget Alerts & Thresholds
            </h3>
          </div>
          <p className="text-xs text-secondary-text mt-1">
            Real-time notifications triggered when category spending reaches configured ceilings.
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface-elevated border border-income/20 text-income flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-income shrink-0" />
            <div>
              <span className="font-semibold text-foreground">All Budgets Within Healthy Limits</span>
              <p className="text-[11px] text-secondary-text mt-0.5">
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
                  className={`p-3.5 rounded-xl bg-surface-elevated border text-xs flex items-start justify-between gap-3 ${
                    isDanger
                      ? 'border-destructive/30'
                      : 'border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`p-1 rounded-md mt-0.5 ${
                        isDanger ? 'text-destructive' : 'text-amber-500'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {alert.title}
                      </h4>
                      <p className="text-secondary-text mt-0.5 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/budgets/${alert.budgetId}`}
                    className="shrink-0 p-1 rounded-lg text-secondary-text hover:text-primary transition-colors cursor-pointer"
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
      <div className="bg-surface p-6 rounded-2xl border border-secondary/30 shadow-card flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h3 className="text-base font-display font-bold text-foreground">
              Deterministic Budget Insights
            </h3>
          </div>
          <p className="text-xs text-secondary-text mt-1">
            Data-driven observations computed directly from your verified ledger entries.
          </p>
        </div>

        {insights.length === 0 ? (
          <div className="py-8 text-center text-xs text-secondary-text">
            Insights will populate once category expenses are recorded.
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs space-y-1 shadow-xs"
              >
                <h4 className="font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="text-secondary-text leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-[11px] text-muted-foreground font-medium">
          Deterministic financial calculations • SPENDX Intelligence
        </div>
      </div>
    </div>
  );
};
