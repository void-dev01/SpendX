import React from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Sparkles,
  Briefcase,
  Zap,
  Utensils,
  Target,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';

const chartData = [
  { day: 'Mon', spend: 1200 },
  { day: 'Tue', spend: 2800 },
  { day: 'Wed', spend: 1650 },
  { day: 'Thu', spend: 3900 },
  { day: 'Fri', spend: 2400 },
  { day: 'Sat', spend: 4600 },
  { day: 'Sun', spend: 1900 },
];

export const HeroDashboard: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto select-none">
      {/* Decorative Ambient Radial Glow underneath */}
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-[#D4AF37]/25 via-[#10B981]/20 to-[#D4AF37]/25 rounded-[36px] blur-2xl -z-10" />

      {/* Main Floating Glass Dashboard Container */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/80 dark:border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Demo Watermark Badge */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
              Financial Overview
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Demo Simulation
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              November 2026
            </span>
            <div className="relative w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/10 flex items-center justify-center text-muted-foreground">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#DC5579] rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#10B981] text-[#0A0A0C] flex items-center justify-center text-xs font-bold">
              SX
            </div>
          </div>
        </div>

        {/* Balance & Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {/* Total Net Balance Card */}
          <div className="sm:col-span-1 rounded-2xl bg-white/50 dark:bg-white/5 p-3.5 border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Balance
              </span>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums mt-0.5">
                ₹1,24,580.00
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+8.4% vs last mo</span>
            </div>
          </div>

          {/* Monthly Inflow (Income) Card */}
          <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-3.5 border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Income
                </span>
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground tabular-nums mt-0.5">
                ₹45,000
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              +12.0% (Inflow)
            </span>
          </div>

          {/* Monthly Outflow (Expense) Card */}
          <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-3.5 border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Expense
                </span>
                <span className="w-5 h-5 rounded-full bg-[#DC5579]/10 flex items-center justify-center text-[#DC5579]">
                  <ArrowDownRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground tabular-nums mt-0.5">
                ₹18,450
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              Within Safe Limit
            </span>
          </div>
        </div>

        {/* Lower Row: Spending Analytics Mini-Chart & Recent Transactions */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-2">
          {/* Mini Spending Trend Chart */}
          <div className="sm:col-span-7 rounded-2xl bg-white/40 dark:bg-white/5 p-3.5 border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Weekly Spending Velocity</span>
              <span className="text-[10px] text-muted-foreground font-mono">7-Day Curve</span>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel px-2.5 py-1.5 rounded-lg border border-white/80 dark:border-white/10 shadow-md text-[11px]">
                            <span className="font-semibold text-foreground tabular-nums">
                              ₹{payload[0].value}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mini Recent Transactions */}
          <div className="sm:col-span-5 rounded-2xl bg-white/40 dark:bg-white/5 p-3.5 border border-white/60 dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Recent Activity</span>
              <span className="text-[10px] text-primary font-medium">Live Feed</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Salary Credit</p>
                    <p className="text-[9px] text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums text-[11px]">
                  +₹45,000
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Electricity</p>
                    <p className="text-[9px] text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <span className="font-semibold text-[#DC5579] tabular-nums text-[11px]">
                  -₹1,850
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Dining Out</p>
                    <p className="text-[9px] text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <span className="font-semibold text-[#DC5579] tabular-nums text-[11px]">
                  -₹1,240
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 1: AI Insight Pill (Top-Right Desktop / Relative On Mobile) */}
      <div className="mt-3 sm:mt-0 sm:absolute sm:-top-5 sm:-right-4 glass-panel rounded-2xl p-3 border border-white/80 dark:border-white/20 shadow-xl backdrop-blur-xl sm:max-w-xs transition-transform hover:-translate-y-1 duration-200">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#10B981] text-[#0A0A0C] flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#D4AF37]">AI Insight</span>
              <span className="text-[9px] text-emerald-500 font-mono font-semibold bg-emerald-500/10 px-1 rounded">LIVE</span>
            </div>
            <p className="text-xs text-foreground mt-0.5 leading-snug">
              Your dining expenses are 12% higher this month.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Card 2: Savings Progress Pill (Bottom-Left Desktop / Relative On Mobile) */}
      <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-4 glass-panel rounded-2xl p-3 border border-white/80 dark:border-white/20 shadow-xl backdrop-blur-xl sm:max-w-xs transition-transform hover:-translate-y-1 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-foreground">Emergency Fund</span>
              <span className="font-bold text-primary">64%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 mt-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#10B981] w-[64%]" />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
              <span>₹32,000</span>
              <span>₹50,000 Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 3: Smart Capture Pill (Bottom-Right Desktop) */}
      <div className="hidden lg:flex absolute -bottom-8 right-6 glass-panel rounded-xl px-3 py-2 border border-white/80 dark:border-white/20 shadow-lg backdrop-blur-xl items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-xs text-foreground font-medium">
          Auto-Captured: ₹850 UPI at Example Store
        </span>
      </div>
    </div>
  );
};
