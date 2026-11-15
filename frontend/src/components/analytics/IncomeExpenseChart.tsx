import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  TimelineDataPoint,
  analyticsService,
} from '@/services/analyticsService';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import '@/styles/chart.css';

interface IncomeExpenseChartProps {
  data: TimelineDataPoint[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'BAR' | 'LINE'>('BAR');

  if (data.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-xs text-slate-400">
        No income or expense data found for the selected timeframe.
      </div>
    );
  }

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const incomeVal = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenseVal = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const net = incomeVal - expenseVal;

      return (
        <div className="glass-surface p-3 rounded-xl border border-white/90 dark:border-white/15 shadow-md text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100/60 dark:border-white/10 pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Income:</span>
            <span className="font-bold tabular-nums">
              {analyticsService.formatINR(incomeVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-rose-500 font-medium">
            <span>Expenses:</span>
            <span className="font-bold tabular-nums">
              {analyticsService.formatINR(expenseVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 pt-1 border-t border-slate-100/60 dark:border-white/10 font-semibold">
            <span>Net Delta:</span>
            <span className={net >= 0 ? 'text-emerald-600' : 'text-rose-500'}>
              {net >= 0 ? '+' : ''}
              {analyticsService.formatINR(net)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-4">
      {/* Header & Chart Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Income vs Expenses
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Temporal comparison of gross inflows against expenditures
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl glass-surface border border-white/80 dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('BAR')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              chartType === 'BAR'
                ? 'bg-spendx-blue-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title="Grouped Bar Chart"
            aria-label="Bar chart view"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Bar</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('LINE')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              chartType === 'LINE'
                ? 'bg-spendx-blue-primary text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title="Line Trend Chart"
            aria-label="Line chart view"
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span className="text-[11px]">Line</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'BAR' ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150, 150, 150, 0.15)"
              />
              <XAxis
                dataKey="label"
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
              <Tooltip content={renderTooltip} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#12866E"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
              <Bar
                dataKey="expense"
                name="Expenses"
                fill="#DC5579"
                radius={[4, 4, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150, 150, 150, 0.15)"
              />
              <XAxis
                dataKey="label"
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
              <Tooltip content={renderTooltip} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#12866E"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#12866E' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke="#DC5579"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#DC5579' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
