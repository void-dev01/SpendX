import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BudgetWithMetrics, budgetService } from '@/services/budgetService';

interface BudgetChartsProps {
  budgetMetrics: BudgetWithMetrics[];
}

const CATEGORY_COLORS = [
  '#718FE8',
  '#8B72D6',
  '#4779C9',
  '#C48620',
  '#8066CC',
  '#12866E',
  '#DC5579',
  '#5368A2',
];

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ budgetMetrics }) => {
  if (budgetMetrics.length === 0) return null;

  // Data for Donut chart
  const donutData = budgetMetrics
    .filter((b) => b.spent > 0)
    .map((b, idx) => ({
      name: b.category,
      value: b.spent,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));

  // Data for Bar chart (Budget vs Actual)
  const barData = budgetMetrics.map((b) => ({
    name: b.category.length > 12 ? `${b.category.slice(0, 10)}...` : b.category,
    fullName: b.category,
    budget: b.allocatedAmount,
    spent: b.spent,
  }));

  const renderDonutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-surface p-2.5 rounded-xl border border-white/90 dark:border-white/15 shadow-md text-xs min-w-[140px]">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {data.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-spendx-blue-primary">
            <span>Spent:</span>
            <span className="font-bold tabular-nums">
              {budgetService.formatINR(data.value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgetVal = payload.find((p: any) => p.dataKey === 'budget')?.value || 0;
      const spentVal = payload.find((p: any) => p.dataKey === 'spent')?.value || 0;

      return (
        <div className="glass-surface p-3 rounded-xl border border-white/90 dark:border-white/15 shadow-md text-xs space-y-1 min-w-[150px]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-100/60 dark:border-white/10 pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between text-spendx-blue-primary">
            <span>Allocated:</span>
            <span className="font-bold tabular-nums">
              {budgetService.formatINR(budgetVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span>Spent:</span>
            <span className="font-bold tabular-nums">
              {budgetService.formatINR(spentVal)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Category Spending Donut */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple">
            Category Spending Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            How actual expenses are distributed across your budget categories.
          </p>
        </div>

        {donutData.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No expenses recorded for these categories yet.
          </div>
        ) : (
          <div className="w-full h-56 my-auto pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={renderDonutTooltip} />
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, idx) => (
                    <Cell key={`donut-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 border-t border-slate-100/60 dark:border-white/5 text-[11px]">
          {donutData.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                {d.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Budget vs Actual Bar Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-glass flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Budget vs Actual Spend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparison of ceiling limits vs verified outflow.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-spendx-blue-primary" />
              <span className="text-slate-600 dark:text-slate-300">Allocated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-300">Spent</span>
            </div>
          </div>
        </div>

        <div className="w-full h-64 my-auto pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.15)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                dx={-4}
              />
              <Tooltip content={renderBarTooltip} cursor={{ fill: 'rgba(113, 143, 232, 0.06)' }} />
              <Bar dataKey="budget" name="Allocated" fill="#718FE8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spent" fill="#DC5579" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
