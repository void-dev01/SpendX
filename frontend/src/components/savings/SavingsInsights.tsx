import React from 'react';
import { Sparkles, Compass, Award } from 'lucide-react';
import { SavingsInsight } from '@/services/savingsService';

interface SavingsInsightsProps {
  insights: SavingsInsight[];
}

export const SavingsInsights: React.FC<SavingsInsightsProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-spendx-ai-accent/15 text-spendx-ai-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              SPENDX Milestone Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated pacing forecasts and milestone optimization
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-spendx-ai-accent/10 text-spendx-ai-accent border border-spendx-ai-accent/20">
          AI Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {insights.map((insight) => {
          const isPositive = insight.type === 'POSITIVE';
          return (
            <div
              key={insight.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                isPositive
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-500/20'
                  : 'bg-spendx-blue-primary/5 dark:bg-spendx-blue-primary/10 border-spendx-blue-primary/20'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isPositive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'bg-spendx-blue-primary/15 text-spendx-blue-primary'
                }`}
              >
                {isPositive ? (
                  <Award className="w-4 h-4" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {insight.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
