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
    <div className="relative h-full flex flex-col justify-between p-8 sm:p-12 overflow-hidden select-none">
      {/* Background Decorative Ambient Radial Glows */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-[#718FE8]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#8066CC]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Brand Header */}
      <div className="space-y-4">
        <SpendxLogo size="lg" showTagline />

        <div className="pt-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            Intelligent Wealth Telemetry.{' '}
            <span className="bg-gradient-to-r from-[#718FE8] via-[#8B72D6] to-[#8066CC] bg-clip-text text-transparent block">
              Without the Friction.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Take control of your money with automated transaction capture, predictive runway
            forecasting, and conversational AI clarity.
          </p>
        </div>
      </div>

      {/* Center: Lightweight Interactive Fintech Preview Card */}
      <div className="my-8 relative">
        <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-2xl space-y-4 max-w-md">
          {/* Header pill */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-foreground">Live Telemetry</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
              ₹ INR
            </span>
          </div>

          {/* Balance Row */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Total Net Balance
              </span>
              <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                ₹1,24,580.00
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4%</span>
            </div>
          </div>

          {/* Dual Pill Stats */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="rounded-xl bg-white/40 dark:bg-white/5 p-2.5 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground">Inflow</span>
                <p className="text-xs font-bold text-foreground tabular-nums">+₹45,000</p>
              </div>
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="rounded-xl bg-white/40 dark:bg-white/5 p-2.5 border border-white/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground">Outflow</span>
                <p className="text-xs font-bold text-foreground tabular-nums">-₹18,450</p>
              </div>
              <span className="w-6 h-6 rounded-lg bg-[#DC5579]/10 text-[#DC5579] flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Floating AI Insight Mini-Pill */}
          <div className="rounded-xl bg-[#8066CC]/10 border border-[#8066CC]/20 p-2.5 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#8066CC] shrink-0" />
            <span className="text-[#8066CC] font-medium text-[11px] leading-snug">
              AI Insight: Savings velocity is 14% higher than last month.
            </span>
          </div>
        </div>

        {/* Small floating tag badge */}
        <div className="absolute -bottom-4 right-4 glass-panel rounded-full px-3 py-1 border border-white/80 dark:border-white/20 shadow-md flex items-center gap-1.5 text-[11px] text-foreground font-medium">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Automatic Transaction Categorization</span>
        </div>
      </div>

      {/* Bottom Security Guarantee */}
      <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Privacy by Design • Server-isolated cryptographic credentials</span>
      </div>
    </div>
  );
};
