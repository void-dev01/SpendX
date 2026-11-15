import React from 'react';
import { Sparkles, Compass, Award, AlertTriangle } from 'lucide-react';
import { AnalyticsInsightItem } from '@/services/analyticsService';

interface AnalyticsInsightsProps {
  insights: AnalyticsInsightItem[];
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-spendx-ai-accent/15 text-spendx-ai-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              AI Financial Insights
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated behavioral observations & velocity tracking
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-spendx-ai-accent/10 text-spendx-ai-accent border border-spendx-ai-accent/20">
          Analytics Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {insights.map((item) => {
          const isPositive = item.type === 'POSITIVE';
          const isWarning = item.type === 'WARNING';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                isPositive
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-500/20'
                  : isWarning
                  ? 'bg-amber-50/50 dark:bg-amber-950/15 border-amber-500/20'
                  : 'bg-spendx-blue-primary/5 dark:bg-spendx-blue-primary/10 border-spendx-blue-primary/20'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isPositive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : isWarning
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-spendx-blue-primary/15 text-spendx-blue-primary'
                }`}
              >
                {isPositive ? (
                  <Award className="w-4 h-4" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
