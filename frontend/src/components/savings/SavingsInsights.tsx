import React from 'react';
import { Sparkles, Compass, Award } from 'lucide-react';
import { SavingsInsight } from '@/services/savingsService';

interface SavingsInsightsProps {
  insights: SavingsInsight[];
}

export const SavingsInsights: React.FC<SavingsInsightsProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="bg-surface p-5 rounded-2xl border border-secondary/30 shadow-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-foreground">
              SPENDX Milestone Intelligence
            </h3>
            <p className="text-xs text-secondary-text">
              Automated pacing forecasts and milestone optimization
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
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
                  ? 'bg-income/5 border-income/20'
                  : 'bg-surface-elevated border-border'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isPositive
                    ? 'bg-income/10 text-income'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {isPositive ? (
                  <Award className="w-4 h-4" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-foreground">
                  {insight.title}
                </h4>
                <p className="text-xs text-secondary-text leading-relaxed">
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
