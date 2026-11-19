import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SavingsGoalRecord, savingsService } from '@/services/savingsService';
import '@/styles/chart.css';

interface SavingsProgressChartProps {
  goals: SavingsGoalRecord[];
}

const CATEGORY_COLORS = [
  '#10B981', // Emerald
  '#A5F12B', // Neon Lime
  '#05CD99', // Mint
  '#0D9488', // Teal
  '#F59E0B', // Amber
  '#84CC16', // Olive Lime
  '#EF4444', // Rose
  '#64748B', // Slate
];

export const SavingsProgressChart: React.FC<SavingsProgressChartProps> = ({ goals }) => {
  if (goals.length === 0) return null;

  // 1. Bar Chart Data (Target vs Current)
  const barData = goals.map((g) => ({
    name: g.name.length > 14 ? `${g.name.slice(0, 12)}...` : g.name,
    fullName: g.name,
    saved: g.currentAmount,
    target: g.targetAmount,
  }));

  // 2. Donut Chart Data (Aggregated by Category)
  const categoryMap: { [cat: string]: number } = {};
  goals.forEach((g) => {
    categoryMap[g.category] = (categoryMap[g.category] || 0) + g.currentAmount;
  });

  const pieData = Object.entries(categoryMap)
    .filter(([_, val]) => val > 0)
    .map(([name, value], idx) => ({
      name,
      value,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

  const renderBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const savedVal = payload.find((p: any) => p.dataKey === 'saved')?.value || 0;
      const targetVal = payload.find((p: any) => p.dataKey === 'target')?.value || 0;
      const pct = targetVal > 0 ? Math.round((savedVal / targetVal) * 100) : 0;

      return (
        <div className="bg-surface p-3 rounded-xl border border-border shadow-elevated text-xs space-y-1 min-w-[150px]">
          <p className="font-semibold text-foreground border-b border-border pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between text-primary">
            <span>Saved:</span>
            <span className="font-bold tabular-nums">
              {savingsService.formatINR(savedVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-secondary-text">
            <span>Target:</span>
            <span className="font-semibold tabular-nums">
              {savingsService.formatINR(targetVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-income pt-1 border-t border-border font-medium">
            <span>Completion:</span>
            <span>{pct}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-surface p-2.5 rounded-xl border border-border shadow-elevated text-xs min-w-[130px]">
          <p className="font-semibold text-foreground">
            {data.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-primary">
            <span>Allocated:</span>
            <span className="font-bold tabular-nums">
              {savingsService.formatINR(data.value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Target vs Saved Bar Chart */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-display font-bold text-foreground">
              Savings Targets vs Accumulated Funds
            </h3>
            <p className="text-xs text-secondary-text">
              Direct comparison of current vault balance against milestone goals
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Saved
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-border" /> Target
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150, 150, 150, 0.15)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={renderBarTooltip} cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }} />
              <Bar
                dataKey="target"
                name="Target"
                fill="rgba(148, 163, 184, 0.2)"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="saved"
                name="Saved"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Donut */}
      <div className="bg-surface p-5 rounded-2xl border border-border shadow-card flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-display font-bold text-foreground">
            Category Allocation
          </h3>
          <p className="text-xs text-secondary-text">
            Distribution of saved capital
          </p>
        </div>

        {pieData.length > 0 ? (
          <>
            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={renderPieTooltip} />
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate max-w-[110px]">{item.name}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-foreground">
                    {savingsService.formatINR(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-secondary-text">
            No allocated funds to display
          </div>
        )}
      </div>
    </div>
  );
};
