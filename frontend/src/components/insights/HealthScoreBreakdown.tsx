import React from 'react';
import { Award } from 'lucide-react';
import { FinancialHealthScore } from '@/services/insightsService';

interface HealthScoreBreakdownProps {
  healthScore: FinancialHealthScore;
}

export const HealthScoreBreakdown: React.FC<HealthScoreBreakdownProps> = ({ healthScore }) => {
  const { pillars } = healthScore;

  const pillarList = [
    {
      title: 'Budget Discipline',
      score: pillars.budgetDiscipline.score,
      max: pillars.budgetDiscipline.max,
      label: pillars.budgetDiscipline.label,
      description: 'Pacing vs monthly category allocations and overruns',
      color: 'bg-primary',
    },
    {
      title: 'Savings Velocity',
      score: pillars.savingsVelocity.score,
      max: pillars.savingsVelocity.max,
      label: pillars.savingsVelocity.label,
      description: 'Progress and funding rate toward active savings targets',
      color: 'bg-secondary',
    },
    {
      title: 'Liquidity Cushion',
      score: pillars.liquidityCushion.score,
      max: pillars.liquidityCushion.max,
      label: pillars.liquidityCushion.label,
      description: 'Checking & cash reserves vs monthly fixed obligations',
      color: 'bg-income',
    },
    {
      title: 'Liability Health',
      score: pillars.liabilityRatio.score,
      max: pillars.liabilityRatio.max,
      label: pillars.liabilityRatio.label,
      description: 'Recurring direct debits, loans, and overdue status',
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-foreground">
              Financial Health Pillars
            </h3>
            <p className="text-xs text-secondary-text">
              Deterministic scoring matrix based on your live financial telemetry
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 tabular-nums">
          {healthScore.overallScore} / 100 Overall
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillarList.map((pillar) => {
          const pct = Math.round((pillar.score / pillar.max) * 100);

          return (
            <div
              key={pillar.title}
              className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-display text-foreground">
                  {pillar.title}
                </span>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  {pillar.score}/{pillar.max}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pillar.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-primary truncate">
                  {pillar.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
