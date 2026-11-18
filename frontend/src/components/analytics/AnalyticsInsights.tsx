import React from 'react';
import { Sparkles, Compass, Award, AlertTriangle } from 'lucide-react';
import { AnalyticsInsightItem } from '@/services/analyticsService';

interface AnalyticsInsightsProps {
  insights: AnalyticsInsightItem[];
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-foreground">
              AI Financial Insights
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Automated behavioral observations & velocity tracking
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
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
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                isPositive
                  ? 'bg-income/5 border-income/20'
                  : isWarning
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isPositive
                    ? 'bg-income/15 text-income'
                    : isWarning
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-primary/15 text-primary'
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
                <h4 className="text-xs font-semibold font-display text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-secondary-text leading-relaxed">
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
