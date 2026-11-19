import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const monthlyComparisonData = [
  { month: 'Jun', income: 42000, expense: 22000 },
  { month: 'Jul', income: 45000, expense: 24500 },
  { month: 'Aug', income: 44000, expense: 19800 },
  { month: 'Sep', income: 48000, expense: 26000 },
  { month: 'Oct', income: 46000, expense: 21500 },
  { month: 'Nov', income: 45000, expense: 18450 },
];

const categoryBreakdown = [
  { name: 'Food & Dining', amount: 6200, percentage: 34, color: '#496BDB' },
  { name: 'Housing & Rent', amount: 4800, percentage: 26, color: '#7256D9' },
  { name: 'Shopping & Gear', amount: 3100, percentage: 17, color: '#0E9F85' },
  { name: 'Utilities & Bills', amount: 2500, percentage: 13, color: '#B7791F' },
  { name: 'Transportation', amount: 1850, percentage: 10, color: '#4779C9' },
];

export const AnalyticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'categories'>('comparison');

  return (
    <section id="analytics" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-primary uppercase tracking-wider shadow-xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Smart Financial Telemetry</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground">
            See the Bigger Picture{' '}
            <span className="text-gradient-brand">
              Behind Every Transaction.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Turn everyday financial activity into meaningful insights that help you understand
            your money, identify wasteful leaks, and plan ahead with confidence.
          </p>
        </div>

        {/* Analytics Showcase Container */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-elevated relative">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display text-foreground">Cash Flow & Capital Allocation</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-income/10 text-income font-medium">
                  Net Positive (+₹26,550)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Past 6-Month Trajectory • Verified Demo Ledger
              </p>
            </div>

            {/* View Switcher Segmented Control */}
            <div className="flex items-center rounded-2xl bg-surface-elevated p-1 border border-border-subtle self-stretch sm:self-auto">
              <button
                onClick={() => setActiveTab('comparison')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'comparison'
                    ? 'bg-primary text-[#111711] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Inflow vs Outflow
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-primary text-[#111711] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Category Outflow
              </button>
            </div>
          </div>

          {/* Main Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            {/* Chart Area */}
            <div className="lg:col-span-8 space-y-4">
              {activeTab === 'comparison' ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-[#11866D]" />
                        <span className="font-medium text-foreground">Income</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-[#D95765]" />
                        <span className="font-medium text-foreground">Expense</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px]">Amounts in INR (₹)</span>
                  </div>

                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyComparisonData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        barGap={6}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#8995A8' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#8995A8' }}
                          tickFormatter={(val) => `₹${val / 1000}k`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-surface p-3 rounded-xl border border-border shadow-elevated text-xs space-y-1">
                                  <p className="font-bold font-display text-foreground">
                                    {payload[0].payload.month} 2026
                                  </p>
                                  <p className="text-income font-medium tabular-nums">
                                    Income: ₹{payload[0].value?.toLocaleString('en-IN')}
                                  </p>
                                  <p className="text-expense font-medium tabular-nums">
                                    Expense: ₹{payload[1].value?.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="income"
                          fill="#11866D"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                        <Bar
                          dataKey="expense"
                          fill="#D95765"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                /* Category Allocation View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground font-display">Monthly Category Outflow</span>
                    <span className="font-mono text-[11px]">Total: ₹18,450</span>
                  </div>

                  <div className="space-y-3">
                    {categoryBreakdown.map((cat) => (
                      <div
                        key={cat.name}
                        className="rounded-2xl bg-surface-elevated p-3.5 border border-border-subtle space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-semibold text-foreground font-display">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2 tabular-nums">
                            <span className="font-bold text-foreground">
                              ₹{cat.amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              ({cat.percentage}%)
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right KPI Summary Cards */}
            <div className="lg:col-span-4 space-y-3.5">
              {/* Average Savings Rate Card */}
              <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4 border border-white/70 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Savings Velocity
                  </span>
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-foreground tabular-nums">
                  59.0%
                </div>
                <p className="text-xs text-muted-foreground">
                  Saved ₹26,550 of ₹45,000 monthly income.
                </p>
              </div>

              {/* Top Merchant Leak Card */}
              <div className="rounded-2xl bg-white/50 dark:bg-white/5 p-4 border border-white/70 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Recurring Subscriptions
                  </span>
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-foreground tabular-nums">
                  ₹2,190 / mo
                </div>
                <p className="text-xs text-muted-foreground">
                  4 active services detected (Streaming, Cloud, Music).
                </p>
              </div>

              {/* Monthly Trend Indicator */}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 p-4 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>3-Month Projected Runway</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  At your current burn rate of ₹18,450/month, your surplus will cover
                  emergency obligations for <strong>6.7 months</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
