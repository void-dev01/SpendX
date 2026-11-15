import React from 'react';
import { Lightbulb, AlertTriangle, TrendingDown, Sparkles, Check } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';

const insightsData = [
  {
    type: 'WARNING',
    icon: AlertTriangle,
    title: 'Food & Dining Limit Velocity',
    description: 'You have spent 88% of your monthly dining budget with 14 days remaining in the cycle.',
    action: 'Reduce weekend restaurant dining to preserve reserve.',
    color: 'text-amber-500 bg-amber-500/15',
  },
  {
    type: 'SAVINGS',
    icon: TrendingDown,
    title: 'Subscription Audit Anomaly',
    description: 'Cloud storage charge increased by ₹420 this month due to exceeded volume tier.',
    action: 'Review storage retention policy or clean logs.',
    color: 'text-primary bg-primary/15',
  },
  {
    type: 'OPPORTUNITY',
    icon: Sparkles,
    title: 'High Liquid Surplus Detected',
    description: 'You have ₹24,000 sitting in low-yield checking account above your safe emergency floor.',
    action: 'Sweep ₹15,000 into High-Yield Liquid Vault (+4.2% p.a.).',
    color: 'text-[#8066CC] bg-[#8066CC]/15',
  },
];

export const InsightsPage: React.FC = () => {
  return (
    <RoutePlaceholder
      title="Financial Intelligence Insights"
      description="Context-aware financial alerts, proactive spending nudges, and capital optimization."
      routeId="/insights"
      icon={Lightbulb}
      badge="Intelligence"
    >
      <div className="space-y-4">
        {insightsData.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/80 dark:border-white/15 shadow-lg flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">{item.title}</h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-muted-foreground">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Actionable step: {item.action}</span>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/70 dark:bg-white/10 hover:bg-white/90 text-foreground border border-white/80 dark:border-white/15 shadow-sm self-start sm:self-auto cursor-pointer">
                Dismiss
              </button>
            </div>
          );
        })}
      </div>
    </RoutePlaceholder>
  );
};
