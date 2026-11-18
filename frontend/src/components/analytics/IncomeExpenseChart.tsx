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
      <div className="rounded-2xl bg-surface border border-border p-8 text-center text-xs text-muted-foreground shadow-card">
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
        <div className="bg-surface p-3 rounded-xl border border-border shadow-elevated text-xs space-y-1.5 min-w-[170px]">
          <p className="font-bold font-display text-foreground border-b border-border pb-1">
            {label}
          </p>
          <div className="flex items-center justify-between text-income font-medium">
            <span>Income:</span>
            <span className="font-bold tabular-nums">
              {analyticsService.formatINR(incomeVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-destructive font-medium">
            <span>Expenses:</span>
            <span className="font-bold tabular-nums">
              {analyticsService.formatINR(expenseVal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-foreground pt-1 border-t border-border font-semibold">
            <span>Net Delta:</span>
            <span className={`tabular-nums ${net >= 0 ? 'text-income' : 'text-destructive'}`}>
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
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      {/* Header & Chart Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            Income vs Expenses
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Temporal comparison of gross inflows against expenditures
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('BAR')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              chartType === 'BAR'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-secondary-text hover:text-foreground'
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
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-secondary-text hover:text-foreground'
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
