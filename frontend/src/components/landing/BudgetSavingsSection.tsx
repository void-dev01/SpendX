import React from 'react';
import {
  Wallet,
  Target,
  Sparkles,
  CheckCircle2,
  PiggyBank,
  ShieldCheck,
} from 'lucide-react';

export const BudgetSavingsSection: React.FC = () => {
  return (
    <section id="budgets" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-secondary uppercase tracking-wider shadow-xs">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Habits & Disciplines</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground">
            Build Better{' '}
            <span className="text-gradient-brand">
              Money Habits.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stay aware of your spending limits and keep your savings goals moving forward
            without calculating budgets manually every week.
          </p>
        </div>

        {/* 2 Visual Feature Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel A: Smart Budgets */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-foreground">Smart Budgets</h3>
                    <p className="text-xs text-muted-foreground">Monthly Adaptive Envelope</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  Demo Simulation
                </span>
              </div>

              {/* Main Overall Monthly Budget Metric */}
              <div className="rounded-2xl bg-surface-elevated p-4 sm:p-5 border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Monthly Spend Cap
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-display text-foreground tabular-nums mt-0.5">
                      ₹30,000
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Remaining Safe
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-display text-income tabular-nums mt-0.5">
                      ₹11,550
                    </div>
                  </div>
                </div>

                {/* Progress Bar (61.5% spent) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Spent: ₹18,450</span>
                    <span className="text-primary font-semibold">61.5% Used</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: '61.5%' }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    14 days remaining in cycle • Current pace is under budget.
                  </p>
                </div>
              </div>

              {/* Category Sub-Envelopes */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold font-display text-foreground uppercase tracking-wider">
                  Category Envelopes
                </span>

                {/* Dining */}
                <div className="rounded-xl bg-surface-elevated p-3 border border-border-subtle flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold font-display text-foreground">Food & Dining</span>
                      <span className="text-[10px] text-warning font-medium">88%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      ₹6,200 of ₹7,000 limit
                    </p>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-warning w-[88%]" />
                  </div>
                </div>

                {/* Shopping */}
                <div className="rounded-xl bg-surface-elevated p-3 border border-border-subtle flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold font-display text-foreground">Shopping</span>
                      <span className="text-[10px] text-primary font-medium">52%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      ₹3,100 of ₹6,000 limit
                    </p>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary w-[52%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>AI monitors velocity daily to protect your end-of-month runway.</span>
            </div>
          </div>

          {/* Panel B: Savings Goals */}
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-income/10 text-income flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-foreground">Savings Goals</h3>
                    <p className="text-xs text-muted-foreground">Milestones & Automated Velocity</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-income/10 text-income font-semibold">
                  Demo Simulation
                </span>
              </div>

              {/* Goal 1: Emergency Fund */}
              <div className="rounded-2xl bg-surface-elevated p-4 sm:p-5 border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-income" />
                    <div>
                      <h4 className="text-sm font-bold font-display text-foreground">Emergency Fund</h4>
                      <p className="text-[11px] text-muted-foreground">6 Months Safe Cushion</p>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-sm font-extrabold font-display text-foreground">₹32,000</div>
                    <span className="text-[11px] text-muted-foreground">of ₹50,000</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Auto-roundup active</span>
                    <span className="text-income font-bold">64.0%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-income transition-all duration-500"
                      style={{ width: '64%' }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Estimated completion: <strong>February 2027</strong> at current savings rate.
                </p>
              </div>

              {/* Goal 2: Tokyo Travel Fund */}
              <div className="rounded-2xl bg-surface-elevated p-4 sm:p-5 border border-border-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-display text-foreground">Tokyo Travel Fund</h4>
                    <p className="text-[11px] text-muted-foreground">Autumn 2027 Milestone</p>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-sm font-extrabold font-display text-foreground">₹48,000</div>
                    <span className="text-[11px] text-muted-foreground">of ₹1,20,000</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Monthly auto-deposit: ₹4,000</span>
                    <span className="text-primary font-bold">40.0%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: '40%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-income shrink-0" />
              <span>Micro-savings automatically rounded up from authorized transactions.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
