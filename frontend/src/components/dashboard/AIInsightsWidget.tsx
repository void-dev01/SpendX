import React from 'react';
import { Sparkles, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIInsight } from '@/services/dashboardService';

interface AIInsightsWidgetProps {
  insights: AIInsight[];
}

export const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({ insights }) => {
  const getImpactBadge = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'warning':
        return (
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
        );
      case 'positive':
        return (
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        );
      default:
        return (
          <span className="p-1 rounded-md bg-spendx-blue-primary/10 text-spendx-blue-primary">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
        );
    }
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-secondary/25 shadow-card flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
              Your AI Money Insights
            </h2>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Deterministic pattern analysis on your cashflow.
          </p>
        </div>

        <Link
          to="/ai-assistant"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer group shrink-0"
        >
          Explore AI Insights
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Insight Cards */}
      <div className="space-y-3 my-auto">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-surface-elevated border border-border hover:border-secondary/40 transition-all flex flex-col justify-between gap-2 shadow-xs"
          >
            <div className="flex items-start gap-2.5">
              {getImpactBadge(item.impact)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-secondary-text shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {item.actionLabel && item.actionUrl && (
              <div className="pt-2 border-t border-border flex justify-end">
                <Link
                  to={item.actionUrl}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  {item.actionLabel}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-3 border-t border-border mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Deterministic financial calculations</span>
        <span className="font-mono text-[10px] text-secondary">SPENDX AI Engine</span>
      </div>
    </div>
  );
};
