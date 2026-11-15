import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingDown,
  Sparkles,
  Trophy,
  ArrowRight,
  Bookmark,
  X,
  PieChart,
} from 'lucide-react';
import { FinancialInsight } from '@/services/insightsService';
import { transactionService } from '@/services/transactionService';

interface InsightCardProps {
  insight: FinancialInsight;
  onBookmarkToggle: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onBookmarkToggle,
  onDismiss,
}) => {
  const navigate = useNavigate();

  const getVisualConfig = () => {
    switch (insight.type) {
      case 'CRITICAL_ALERT':
        return {
          icon: AlertTriangle,
          iconColor: 'text-rose-500 bg-rose-500/10',
          badgeColor: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
          typeLabel: 'Critical Alert',
        };
      case 'SAVINGS_OPPORTUNITY':
        return {
          icon: TrendingDown,
          iconColor: 'text-emerald-500 bg-emerald-500/10',
          badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          typeLabel: 'Savings Opportunity',
        };
      case 'BUDGET_ADVICE':
        return {
          icon: PieChart,
          iconColor: 'text-spendx-blue-primary bg-spendx-blue-primary/10',
          badgeColor: 'text-spendx-blue-primary bg-spendx-blue-primary/10 border-spendx-blue-primary/20',
          typeLabel: 'Budget Advisory',
        };
      case 'MILESTONE_CELEBRATION':
        return {
          icon: Trophy,
          iconColor: 'text-spendx-purple-primary bg-spendx-purple-primary/10',
          badgeColor: 'text-spendx-purple-primary bg-spendx-purple-primary/10 border-spendx-purple-primary/20',
          typeLabel: 'Milestone',
        };
      case 'CASH_FLOW_INTELLIGENCE':
      default:
        return {
          icon: Sparkles,
          iconColor: 'text-indigo-500 bg-indigo-500/10',
          badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
          typeLabel: 'Intelligence',
        };
    }
  };

  const config = getVisualConfig();
  const Icon = config.icon;

  return (
    <div className="glass-card-interactive p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 flex flex-col justify-between group relative transition-all duration-300 hover:border-spendx-blue-primary/40 space-y-4">
      {/* Top Header: Icon, Tags, and Bookmark/Dismiss */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                {config.typeLabel}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500">
                {insight.impact} impact
              </span>
              {insight.category && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400">
                  {insight.category}
                </span>
              )}
            </div>
          </div>

          {/* Actions: Bookmark & Dismiss */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onBookmarkToggle(insight.id)}
              aria-label={insight.isBookmarked ? 'Remove bookmark' : 'Bookmark insight'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-spendx-purple-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  insight.isBookmarked
                    ? 'fill-spendx-purple-primary text-spendx-purple-primary'
                    : ''
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => onDismiss(insight.id)}
              aria-label="Dismiss insight"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-3.5 space-y-1.5">
          <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple group-hover:text-spendx-blue-primary transition-colors">
            {insight.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>

      {/* Bottom Footer: Potential savings & Action button */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
        {insight.estimatedMonthlySavings ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{transactionService.formatINR(insight.estimatedMonthlySavings)}
            </span>
            <span className="text-[10px] text-slate-400">/mo potential</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Proactive intelligence</span>
        )}

        {insight.actionRoute ? (
          <button
            type="button"
            onClick={() => navigate(insight.actionRoute!)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-spendx-blue-primary/10 hover:bg-spendx-blue-primary/20 text-spendx-blue-primary transition-all hover:scale-102 active:scale-98"
          >
            <span>{insight.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onDismiss(insight.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <span>Acknowledge</span>
          </button>
        )}
      </div>
    </div>
  );
};
