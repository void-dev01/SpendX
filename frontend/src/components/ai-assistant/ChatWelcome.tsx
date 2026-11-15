import React from 'react';
import {
  Sparkles,
  TrendingDown,
  PieChart,
  Target,
  ArrowRightLeft,
  Scale,
  Zap,
} from 'lucide-react';

interface ChatWelcomeProps {
  onSelectPrompt: (prompt: string) => void;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onSelectPrompt }) => {
  const suggestedPrompts = [
    {
      title: 'Analyze my spending this month',
      description: 'Breakdown of inflows, outflows, and net delta',
      icon: <TrendingDown className="w-4 h-4 text-rose-500" />,
      query: 'Analyze my spending this month.',
    },
    {
      title: 'Where is most of my money going?',
      description: 'Identify primary expense categories and leakages',
      icon: <PieChart className="w-4 h-4 text-spendx-blue-primary" />,
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
      icon: <Target className="w-4 h-4 text-emerald-500" />,
      query: 'Help me create a savings strategy.',
    },
    {
      title: 'Compare my income and expenses',
      description: 'Review surplus cash flow retained across recent records',
      icon: <ArrowRightLeft className="w-4 h-4 text-spendx-purple-primary" />,
      query: 'Compare my income and expenses.',
    },
    {
      title: 'Find opportunities to reduce spending',
      description: 'Spot discretionary purchases and subscription optimization',
      icon: <Zap className="w-4 h-4 text-indigo-500" />,
      query: 'Find opportunities to reduce spending.',
    },
  ];

  return (
    <div className="py-6 sm:py-8 px-4 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
      {/* Hero Badge */}
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-spendx-ai-accent/20 to-spendx-purple-primary/20 text-spendx-ai-accent flex items-center justify-center shadow-inner">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Heading & Subtitle */}
      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
          Your finances deserve smarter conversations.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
          Ask SPENDX anything about your money. Get clear insights, understand your spending, and make more confident financial decisions.
        </p>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-2">
        {suggestedPrompts.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() => onSelectPrompt(p.query)}
            className="p-3.5 rounded-2xl glass-card-interactive border border-white/80 dark:border-white/10 hover:border-spendx-blue-primary/40 transition-all flex items-start gap-3 text-xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl glass-surface border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {p.icon}
            </div>
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-spendx-blue-primary transition-colors block">
                {p.title}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {p.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
