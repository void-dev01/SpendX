import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  TrendingDown,
  PieChart,
  Target,
  ArrowRightLeft,
  Scale,
  Zap,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { insightsService } from '@/services/insightsService';

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onSelectPrompt }) => {
  const { data: insights = [] } = useQuery({
    queryKey: ['financial-insights-quick'],
    queryFn: () => insightsService.generateInsights(),
    staleTime: 60000,
  });

  const topInsights = insights.slice(0, 2);

  const suggestedPrompts = [
    {
      title: 'Analyze my spending this month',
      description: 'Breakdown of inflows, outflows, and net delta',
      icon: <TrendingDown className="w-4 h-4 text-destructive" />,
      query: 'Analyze my spending this month.',
    },
    {
      title: 'Where is most of my money going?',
      description: 'Identify primary expense categories and leakages',
      icon: <PieChart className="w-4 h-4 text-primary" />,
      query: 'Where is most of my money going?',
    },
    {
      title: 'Am I within my monthly budget?',
      description: 'Check active threshold utilization and limit pacing',
      icon: <Scale className="w-4 h-4 text-amber-500" />,
      query: 'Am I within my monthly budget?',
    },
    {
      title: 'Help me create a savings strategy',
      description: 'Formulate milestone targets for emergency fund and wealth',
      icon: <Target className="w-4 h-4 text-income" />,
      query: 'Help me create a savings strategy.',
    },
    {
      title: 'Compare my income and expenses',
      description: 'Review surplus cash flow retained across recent records',
      icon: <ArrowRightLeft className="w-4 h-4 text-secondary" />,
      query: 'Compare my income and expenses.',
    },
    {
      title: 'Find opportunities to reduce spending',
      description: 'Spot discretionary purchases and subscription optimization',
      icon: <Zap className="w-4 h-4 text-primary" />,
      query: 'Find opportunities to reduce spending.',
    },
  ];

  return (
    <div className="py-6 sm:py-8 px-4 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
      {/* Hero Badge */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Sparkles className="w-7 h-7" />
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground">
          Your finances deserve smarter conversations.
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text max-w-lg leading-relaxed">
          Ask SPENDX anything about your money. Get clear insights, understand your spending, and make more confident financial decisions.
        </p>
      </div>

      {/* Merged Live Insights Snapshot */}
      {topInsights.length > 0 && (
        <div className="w-full space-y-2 text-left pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Live Intelligence Highlights</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topInsights.map((ins) => (
              <div
                key={ins.id}
                onClick={() => onSelectPrompt(`Tell me more about this insight: ${ins.title}. ${ins.description}`)}
                className="p-3 rounded-xl bg-surface-elevated/80 border border-border hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors block">
                    {ins.title}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {ins.description}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <span>Ask Coach about this</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
        {suggestedPrompts.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() => onSelectPrompt(p.query)}
            className="p-3.5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-all flex items-start gap-3 text-xs group cursor-pointer shadow-card hover:bg-surface-elevated"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {p.icon}
            </div>
            <div>
              <span className="font-semibold font-display text-foreground group-hover:text-primary transition-colors block">
                {p.title}
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                {p.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
