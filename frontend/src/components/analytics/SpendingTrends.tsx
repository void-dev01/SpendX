import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  TimelineDataPoint,
  analyticsService,
} from '@/services/analyticsService';
import '@/styles/chart.css';

interface SpendingTrendsProps {
  timelineData: TimelineDataPoint[];
}

export const SpendingTrends: React.FC<SpendingTrendsProps> = ({ timelineData }) => {
  const [metric, setMetric] = useState<'expense' | 'income' | 'net'>('expense');

  if (timelineData.length === 0) return null;

  const getMetricConfig = () => {
    switch (metric) {
      case 'income':
        return {
          title: 'Income Inflow Velocity',
          color: '#10B981',
          gradientId: 'incomeGrad',
          name: 'Income',
        };
      case 'net':
        return {
          title: 'Net Cash Flow Surplus/Deficit',
          color: '#6366F1',
          gradientId: 'netGrad',
          name: 'Net Flow',
        };
      default:
        return {
          title: 'Expenditure Burn Rate',
          color: '#F43F5E',
          gradientId: 'expenseGrad',
          name: 'Expenses',
        };
    }
  };

  const config = getMetricConfig();

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value || 0;
      return (
        <div className="bg-surface p-2.5 rounded-xl border border-border shadow-elevated text-xs min-w-[140px] space-y-1">
          <p className="font-bold font-display text-foreground">{label}</p>
          <div className="flex items-center justify-between font-semibold" style={{ color: config.color }}>
            <span>{config.name}:</span>
            <span className="tabular-nums">{analyticsService.formatINR(val)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 space-y-4 shadow-card">
      {/* Header and Switcher Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            Spending Trends
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Velocity and pattern progression over chronological intervals
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-elevated border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('expense')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metric === 'expense'
                ? 'bg-destructive text-destructive-foreground shadow-xs'
                : 'text-secondary-text hover:text-foreground'
            }`}
          >
            Expenses
          </button>
          <button
            type="button"
            onClick={() => setMetric('income')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metric === 'income'
                ? 'bg-income text-income-foreground shadow-xs'
                : 'text-secondary-text hover:text-foreground'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setMetric('net')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metric === 'net'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-secondary-text hover:text-foreground'
            }`}
          >
            Net Cash Flow
          </button>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timelineData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${config.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
