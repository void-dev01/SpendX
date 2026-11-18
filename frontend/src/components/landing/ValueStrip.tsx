import React from 'react';
import { Zap, Tag, Sparkles, LineChart } from 'lucide-react';

const valueProps = [
  {
    icon: Zap,
    title: 'Automated Tracking',
    description: 'Effortlessly capture from authorized financial records.',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: Tag,
    title: 'Smart Categorization',
    description: 'Machine intelligence automatically tags and files every rupee.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'AI Financial Guidance',
    description: 'Context-aware answers and proactive spending nudges.',
    color: 'text-secondary bg-secondary/10',
  },
  {
    icon: LineChart,
    title: 'Clear Financial Insights',
    description: 'Deep clarity across cash flow, commitments, and runway.',
    color: 'text-income bg-income/10',
  },
];

export const ValueStrip: React.FC = () => {
  return (
    <section className="py-8 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface rounded-3xl p-4 sm:p-6 border border-border shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x lg:divide-border">
            {valueProps.map((prop, idx) => (
              <div
                key={prop.title}
                className={`flex items-start gap-3.5 ${
                  idx > 0 ? 'lg:pl-6' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${prop.color}`}
                >
                  <prop.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground font-display tracking-tight">
                    {prop.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
