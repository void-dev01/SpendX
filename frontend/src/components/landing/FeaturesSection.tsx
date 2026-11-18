import React from 'react';
import {
  ArrowLeftRight,
  Zap,
  Bot,
  Wallet,
  ChartNoAxesCombined,
  Target,
  ArrowRight,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
  color: string;
  iconBg: string;
}

const features: FeatureItem[] = [
  {
    icon: ArrowLeftRight,
    title: 'Smart Transaction Tracking',
    description:
      'Track income and expenses in one organized place, with clear transaction history and intelligent categorization.',
    badge: 'Core Ledger',
    color: 'text-[#D4AF37]',
    iconBg: 'bg-[#D4AF37]/15',
  },
  {
    icon: Zap,
    title: 'Automatic Transaction Capture',
    description:
      'Reduce manual entry by capturing transaction information from supported sources and processing it intelligently.',
    badge: 'Automation',
    color: 'text-amber-500',
    iconBg: 'bg-amber-500/15',
  },
  {
    icon: Bot,
    title: 'AI Financial Assistant',
    description:
      'Ask questions about your spending, understand your financial habits, and get contextual insights.',
    badge: 'Intelligence',
    color: 'text-emerald-500',
    iconBg: 'bg-emerald-500/15',
  },
  {
    icon: Wallet,
    title: 'Smart Budget Management',
    description:
      'Create budgets, monitor category-wise spending, and understand how much you can safely spend.',
    badge: 'Envelopes',
    color: 'text-[#D4AF37]',
    iconBg: 'bg-[#D4AF37]/15',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Financial Analytics',
    description:
      'Explore spending patterns, income trends, category breakdowns, and monthly comparisons.',
    badge: 'Telemetry',
    color: 'text-emerald-500',
    iconBg: 'bg-emerald-500/15',
  },
  {
    icon: Target,
    title: 'Savings Goals',
    description:
      'Set meaningful savings targets, monitor your progress, and stay focused on your financial priorities.',
    badge: 'Velocity',
    color: 'text-sky-500',
    iconBg: 'bg-sky-500/15',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-primary uppercase tracking-wider">
            <span>Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Everything Your Money Needs.{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E2C766] to-[#10B981] bg-clip-text text-transparent">
              In One Place.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            From everyday spending to long-term financial goals, SPENDX brings clarity
            to every part of your financial journey.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card-interactive rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/10 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.iconBg} ${feature.color} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/10 border border-white/60 dark:border-white/10 text-muted-foreground">
                    {feature.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Intelligent Module</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
