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
      {/* Background Soft Purple Sheen */}
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B72D6]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-[#8B72D6] uppercase tracking-wider">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Habits & Disciplines</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Build Better{' '}
            <span className="bg-gradient-to-r from-[#718FE8] via-[#8B72D6] to-[#8066CC] bg-clip-text text-transparent">
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Smart Budgets</h3>
                    <p className="text-xs text-muted-foreground">Monthly Adaptive Envelope</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  Demo Simulation
                </span>
              </div>

              {/* Main Overall Monthly Budget Metric */}
              <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4 sm:p-5 border border-white/70 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Monthly Spend Cap
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums mt-0.5">
                      ₹30,000
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Remaining Safe
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
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
                  <div className="w-full h-3 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#718FE8] to-[#8B72D6] transition-all duration-500"
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
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Category Envelopes
                </span>

                {/* Dining */}
                <div className="rounded-xl bg-white/40 dark:bg-white/5 p-3 border border-white/60 dark:border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Food & Dining</span>
                      <span className="text-[10px] text-amber-500 font-medium">88%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      ₹6,200 of ₹7,000 limit
                    </p>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 w-[88%]" />
                  </div>
                </div>

                {/* Shopping */}
                <div className="rounded-xl bg-white/40 dark:bg-white/5 p-3 border border-white/60 dark:border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground">Shopping</span>
                      <span className="text-[10px] text-primary font-medium">52%</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      ₹3,100 of ₹6,000 limit
                    </p>
                  </div>
                  <div className="w-24 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-primary w-[52%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[#8066CC] shrink-0" />
              <span>AI monitors velocity daily to protect your end-of-month runway.</span>
            </div>
          </div>

          {/* Panel B: Savings Goals */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Savings Goals</h3>
                    <p className="text-xs text-muted-foreground">Milestones & Automated Velocity</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Demo Simulation
                </span>
              </div>

              {/* Goal 1: Emergency Fund */}
              <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4 sm:p-5 border border-white/70 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Emergency Fund</h4>
                      <p className="text-[11px] text-muted-foreground">6 Months Safe Cushion</p>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-sm font-extrabold text-foreground">₹32,000</div>
                    <span className="text-[11px] text-muted-foreground">of ₹50,000</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Auto-roundup active</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">64.0%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: '64%' }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Estimated completion: <strong>February 2027</strong> at current savings rate.
                </p>
              </div>

              {/* Goal 2: Japan Trip 2027 */}
              <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4 sm:p-5 border border-white/70 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Tokyo Travel Fund</h4>
                    <p className="text-[11px] text-muted-foreground">Autumn 2027 Milestone</p>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-sm font-extrabold text-foreground">₹48,000</div>
                    <span className="text-[11px] text-muted-foreground">of ₹1,20,000</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Monthly auto-deposit: ₹4,000</span>
                    <span className="text-primary font-bold">40.0%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#718FE8] to-[#8066CC] transition-all duration-500"
                      style={{ width: '40%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Micro-savings automatically rounded up from authorized transactions.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
