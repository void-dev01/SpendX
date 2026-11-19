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
      {/* Main Solid Surface Dashboard Container */}
      <div className="bg-surface rounded-3xl p-4 sm:p-6 border border-border shadow-elevated relative overflow-hidden">
        {/* Demo Watermark Badge */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground font-display">
              Financial Overview
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Live Simulation
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              November 2026
            </span>
            <div className="relative w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-expense rounded-full" />
            </div>
            <div className="w-7 h-7 rounded-full bg-primary text-[#111711] flex items-center justify-center text-xs font-bold font-display">
              SX
            </div>
          </div>
        </div>

        {/* Balance & Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {/* Total Net Balance Card */}
          <div className="sm:col-span-1 rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Balance
              </span>
              <div className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-foreground tabular-nums mt-0.5">
                ₹1,24,580.00
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-income mt-2">
              <TrendingUp className="w-3 h-3" />
              <span>+8.4% vs last mo</span>
            </div>
          </div>

          {/* Monthly Inflow (Income) Card */}
          <div className="rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Income
                </span>
                <span className="w-5 h-5 rounded-full bg-income/10 flex items-center justify-center text-income">
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-display text-foreground tabular-nums mt-0.5">
                ₹45,000
              </div>
            </div>
            <span className="text-[10px] text-income font-medium">
              +12.0% (Inflow)
            </span>
          </div>

          {/* Monthly Outflow (Expense) Card */}
          <div className="rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Expense
                </span>
                <span className="w-5 h-5 rounded-full bg-expense/10 flex items-center justify-center text-expense">
                  <ArrowDownRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-display text-foreground tabular-nums mt-0.5">
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
          <div className="sm:col-span-7 rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground font-display">Weekly Spending Velocity</span>
              <span className="text-[10px] text-muted-foreground font-mono">7-Day Curve</span>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#496BDB" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7256D9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#8995A8' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface px-2.5 py-1.5 rounded-lg border border-border shadow-card text-[11px]">
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
                    stroke="#496BDB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mini Recent Transactions */}
          <div className="sm:col-span-5 rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground font-display">Recent Activity</span>
              <span className="text-[10px] text-primary font-medium">Live Feed</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-income/10 text-income flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Salary Credit</p>
                    <p className="text-[9px] text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <span className="font-semibold text-income tabular-nums text-[11px]">
                  +₹45,000
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-info/10 text-info flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Electricity</p>
                    <p className="text-[9px] text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <span className="font-semibold text-expense tabular-nums text-[11px]">
                  -₹1,850
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-[11px]">Dining Out</p>
                    <p className="text-[9px] text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <span className="font-semibold text-expense tabular-nums text-[11px]">
                  -₹1,240
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 1: AI Insight Pill */}
      <div className="mt-3 sm:mt-0 sm:absolute sm:-top-5 sm:-right-4 bg-surface rounded-2xl p-3 border border-border shadow-card sm:max-w-xs transition-transform hover:-translate-y-1 duration-200">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-secondary font-display">AI Insight</span>
              <span className="text-[9px] text-accent font-mono font-semibold bg-accent/10 px-1 rounded">LIVE</span>
            </div>
            <p className="text-xs text-foreground mt-0.5 leading-snug">
              Your dining expenses are 12% higher this month.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Card 2: Savings Progress Pill */}
      <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-4 bg-surface rounded-2xl p-3 border border-border shadow-card sm:max-w-xs transition-transform hover:-translate-y-1 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-foreground font-display">Emergency Fund</span>
              <span className="font-bold text-primary">64%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted mt-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-primary w-[64%]" />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
              <span>₹32,000</span>
              <span>₹50,000 Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card 3: Smart Capture Pill */}
      <div className="hidden lg:flex absolute -bottom-8 right-6 bg-surface rounded-xl px-3 py-2 border border-border shadow-card items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
        <span className="text-xs text-foreground font-medium">
          Auto-Captured: ₹850 UPI at Example Store
        </span>
      </div>
    </div>
  );
};
