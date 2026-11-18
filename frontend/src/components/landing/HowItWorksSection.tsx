import React from 'react';
import { UserPlus, Link2, Sparkles, LineChart } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Set up your personal financial workspace in less than two minutes.',
    badge: 'Onboarding',
    color: 'text-primary bg-primary/15',
  },
  {
    step: '02',
    icon: Link2,
    title: 'Connect or Add Financial Info',
    description: 'Use supported, authorized sources or add transactions manually with ease.',
    badge: 'Integration',
    color: 'text-amber-500 bg-amber-500/15',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Let SPENDX Organize',
    description: 'Transactions are structured, categorized, and presented in a clear overview.',
    badge: 'Automation',
    color: 'text-[#D4AF37] bg-[#D4AF37]/15',
  },
  {
    step: '04',
    icon: LineChart,
    title: 'Understand and Improve',
    description: 'Explore analytics, AI insights, budgets, and savings progress with confidence.',
    badge: 'Growth',
    color: 'text-emerald-500 bg-emerald-500/15',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Seamless Workflow</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Getting Started{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E2C766] to-[#10B981] bg-clip-text text-transparent">
              Is Simple.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Four straightforward steps to transform your raw financial activity into
            actionable, intelligent financial clarity.
          </p>
        </div>

        {/* Steps Grid: Horizontal on Desktop with connecting indicator, vertical on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="glass-card-interactive rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/10 flex flex-col justify-between relative group"
            >
              {/* Step Number Watermark */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-slate-300 dark:text-slate-700 tracking-tighter">
                  {item.step}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-muted-foreground">
                  {item.badge}
                </span>
              </div>

              <div className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                >
                  <item.icon className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 text-[11px] font-medium text-primary">
                Step {idx + 1} of 4
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
