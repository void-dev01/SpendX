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
    <div className="relative overflow-hidden p-6 rounded-2xl border border-spendx-purple-primary/30 bg-gradient-to-br from-spendx-soft-purple/40 via-white/70 to-spendx-lavender/30 dark:from-spendx-indigo/30 dark:via-slate-900/60 dark:to-spendx-purple-primary/10 backdrop-blur-xl shadow-glass flex flex-col justify-between h-full">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-spendx-purple-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-spendx-purple-primary animate-pulse" />
            <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Your AI Money Insights
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deterministic pattern analysis on your cashflow.
          </p>
        </div>

        <Link
          to="/ai-assistant"
          className="inline-flex items-center gap-1 text-xs font-semibold text-spendx-purple-primary hover:text-spendx-blue-primary transition-colors cursor-pointer group"
        >
          Explore AI Insights
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Insight Cards */}
      <div className="relative z-10 space-y-3 my-auto">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl glass-surface border border-white/70 dark:border-white/10 hover:border-spendx-purple-primary/40 transition-all flex flex-col justify-between gap-2"
          >
            <div className="flex items-start gap-2.5">
              {getImpactBadge(item.impact)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {item.actionLabel && item.actionUrl && (
              <div className="pt-2 border-t border-slate-100/40 dark:border-white/5 flex justify-end">
                <Link
                  to={item.actionUrl}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-spendx-purple-primary hover:text-spendx-blue-primary transition-colors cursor-pointer"
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
      <div className="relative z-10 pt-3 border-t border-spendx-purple-primary/10 mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>Deterministic financial calculations</span>
        <span className="font-mono text-[10px] text-spendx-purple-primary/80">SPENDX AI Engine</span>
      </div>
    </div>
  );
};
