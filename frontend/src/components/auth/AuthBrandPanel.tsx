import React from 'react';
import { SpendxLogo } from '../landing/SpendxLogo';
import { Zap, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 select-none bg-surface-elevated">
      {/* Top Brand Header */}
      <div className="space-y-3">
        <SpendxLogo size="md" />

        <div className="pt-2 space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-foreground leading-snug">
            Intelligent Wealth Telemetry.{' '}
            <span className="text-gradient-brand block">
              Without the Friction.
            </span>
          </h2>
          <p className="text-xs text-secondary-text leading-relaxed">
            Automated transaction tracking, real-time budgets, and AI financial clarity.
          </p>
        </div>
      </div>

      {/* Feature Value Highlights */}
      <div className="space-y-2.5 my-auto py-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Instant Ingestion</p>
            <p className="text-[11px] text-muted-foreground">Auto-parse SMS & CSV statements</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-income/15 text-income flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-income" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Active Runway Telemetry</p>
            <p className="text-[11px] text-muted-foreground">Predictive cash flow & savings targets</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-secondary/15 text-foreground dark:text-secondary-text flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">100% Private & Persistent</p>
            <p className="text-[11px] text-muted-foreground">Your finances, your verified control</p>
          </div>
        </div>
      </div>

      {/* Bottom Compact Micro-Badge */}
      <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border">
        <span>Bank-grade local security</span>
        <span className="flex items-center gap-1 font-semibold text-income">
          <Sparkles className="w-3 h-3" />
          <span>Active Engine</span>
        </span>
      </div>
    </div>
  );
};
