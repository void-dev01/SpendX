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
          iconColor: 'text-income bg-income/10',
          badgeColor: 'text-income bg-income/10 border-income/20',
          typeLabel: 'Savings Opportunity',
        };
      case 'BUDGET_ADVICE':
        return {
          icon: PieChart,
          iconColor: 'text-primary bg-primary/10',
          badgeColor: 'text-primary bg-primary/10 border-primary/20',
          typeLabel: 'Budget Advisory',
        };
      case 'MILESTONE_CELEBRATION':
        return {
          icon: Trophy,
          iconColor: 'text-secondary bg-secondary/10',
          badgeColor: 'text-secondary bg-secondary/10 border-secondary/20',
          typeLabel: 'Milestone',
        };
      case 'CASH_FLOW_INTELLIGENCE':
      default:
        return {
          icon: Sparkles,
          iconColor: 'text-primary bg-primary/10',
          badgeColor: 'text-primary bg-primary/10 border-primary/20',
          typeLabel: 'Intelligence',
        };
    }
  };

  const config = getVisualConfig();
  const Icon = config.icon;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between group relative transition-all duration-300 hover:border-primary/40 space-y-4 shadow-card">
      {/* Top Header: Icon, Tags, and Bookmark/Dismiss */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                {config.typeLabel}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-elevated text-secondary-text border border-border">
                {insight.impact} impact
              </span>
              {insight.category && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-elevated text-muted-foreground border border-border">
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
              className="p-1.5 rounded-xl text-muted-foreground hover:text-secondary hover:bg-surface-elevated transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  insight.isBookmarked
                    ? 'fill-secondary text-secondary'
                    : ''
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => onDismiss(insight.id)}
              aria-label="Dismiss insight"
              className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-surface-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-3.5 space-y-1.5">
          <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
            {insight.title}
          </h3>
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>

      {/* Bottom Footer: Potential savings & Action button */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
        {insight.estimatedMonthlySavings ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-income tabular-nums">
              +{transactionService.formatINR(insight.estimatedMonthlySavings)}
            </span>
            <span className="text-[10px] text-muted-foreground">/mo potential</span>
          </div>
        ) : (
          <span className="text-[10px] text-muted-foreground italic">Proactive intelligence</span>
        )}

        {insight.actionRoute ? (
          <button
            type="button"
            onClick={() => navigate(insight.actionRoute!)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <span>{insight.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onDismiss(insight.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <span>Acknowledge</span>
          </button>
        )}
      </div>
    </div>
  );
};
