import React from 'react';
import { SpendxLogo } from '../landing/SpendxLogo';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative h-full flex flex-col justify-between p-8 sm:p-12 overflow-hidden select-none bg-surface-elevated border-r border-border">
      {/* Top Brand Header */}
      <div className="space-y-4">
        <SpendxLogo size="lg" showTagline />

        <div className="pt-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground leading-tight">
            Intelligent Wealth Telemetry.{' '}
            <span className="bg-gradient-to-r from-[#496BDB] via-[#5F42C7] to-[#7256D9] bg-clip-text text-transparent block">
              Without the Friction.
            </span>
          </h2>
          <p className="text-sm text-secondary-text leading-relaxed max-w-md">
            Take control of your money with automated transaction capture, predictive runway
            forecasting, and conversational AI clarity.
          </p>
        </div>
      </div>

      {/* Center: Fintech Telemetry Preview Card */}
      <div className="my-8 relative">
        <div className="bg-surface rounded-2xl p-5 border border-border shadow-elevated space-y-4 max-w-md">
          {/* Header pill */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-income animate-pulse" />
              <span className="font-semibold text-foreground">Live Telemetry</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-medium">
              ₹ INR
            </span>
          </div>

          {/* Balance Row */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Total Net Balance
              </span>
              <div className="text-2xl font-display font-bold tracking-tight text-foreground tabular-nums">
                ₹1,24,580.00
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-income">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4%</span>
            </div>
          </div>

          {/* Dual Pill Stats */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="rounded-xl bg-surface-elevated p-2.5 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground">Inflow</span>
                <p className="text-xs font-bold text-income tabular-nums">+₹45,000</p>
              </div>
              <span className="w-6 h-6 rounded-lg bg-income/10 text-income flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="rounded-xl bg-surface-elevated p-2.5 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground">Outflow</span>
                <p className="text-xs font-bold text-expense tabular-nums">-₹18,450</p>
              </div>
              <span className="w-6 h-6 rounded-lg bg-expense/10 text-expense flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* AI Insight Mini-Pill */}
          <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-2.5 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="text-secondary font-medium text-[11px] leading-snug">
              AI Insight: Savings velocity is 14% higher than last month.
            </span>
          </div>
        </div>

        {/* Small floating tag badge */}
        <div className="absolute -bottom-3 right-4 bg-surface rounded-full px-3 py-1 border border-border shadow-card flex items-center gap-1.5 text-[11px] text-foreground font-medium">
          <Zap className="w-3 h-3 text-warning" />
          <span>Automatic Transaction Categorization</span>
        </div>
      </div>

      {/* Bottom Security Guarantee */}
      <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-secondary-text">
        <ShieldCheck className="w-4 h-4 text-income shrink-0" />
        <span>Privacy by Design • Server-isolated cryptographic credentials</span>
      </div>
    </div>
  );
};
