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
      color: 'bg-spendx-blue-primary',
    },
    {
      title: 'Savings Velocity',
      score: pillars.savingsVelocity.score,
      max: pillars.savingsVelocity.max,
      label: pillars.savingsVelocity.label,
      description: 'Progress and funding rate toward active savings targets',
      color: 'bg-spendx-purple-primary',
    },
    {
      title: 'Liquidity Cushion',
      score: pillars.liquidityCushion.score,
      max: pillars.liquidityCushion.max,
      label: pillars.liquidityCushion.label,
      description: 'Checking & cash reserves vs monthly fixed obligations',
      color: 'bg-emerald-500',
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
    <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              Financial Health Pillars
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic scoring matrix based on your live financial telemetry
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-spendx-purple-primary/10 text-spendx-purple-primary">
          {healthScore.overallScore} / 100 Overall
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillarList.map((pillar) => {
          const pct = Math.round((pillar.score / pillar.max) * 100);

          return (
            <div
              key={pillar.title}
              className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
                  {pillar.title}
                </span>
                <span className="text-xs font-extrabold text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
                  {pillar.score}/{pillar.max}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/70 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pillar.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-spendx-blue-primary truncate">
                  {pillar.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
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
