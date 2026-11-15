import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  CategoryBreakdownItem,
  analyticsService,
} from '@/services/analyticsService';
import '@/styles/chart.css';

interface IncomeBreakdownProps {
  items: CategoryBreakdownItem[];
}

export const IncomeBreakdown: React.FC<IncomeBreakdownProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Income Sources
        </h3>
        <div className="py-12 text-center text-xs text-slate-400">
          No eligible income sources detected for this timeframe.
        </div>
      </div>
    );
  }

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryBreakdownItem;
      return (
        <div className="glass-surface p-2.5 rounded-xl border border-white/90 dark:border-white/15 shadow-md text-xs min-w-[140px] space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100">{data.category}</p>
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Inflow:</span>
            <span className="tabular-nums">{analyticsService.formatINR(data.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Share:</span>
            <span>{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Income Sources
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Breakdown of verified salary, dividends, and business inflows
        </p>
      </div>

      {/* Donut Chart */}
      <div className="h-44 w-full my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={renderTooltip} />
            <Pie
              data={items}
              innerRadius={46}
              outerRadius={70}
              paddingAngle={2}
              dataKey="amount"
            >
              {items.map((entry) => (
                <Cell key={`income-${entry.category}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Sources List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item) => (
          <div
            key={item.category}
            className="p-2.5 rounded-xl glass-surface border border-white/60 dark:border-white/5 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 dark:text-slate-200 truncate font-medium">
                {item.category}
              </span>
              <span className="text-[10px] text-slate-400 shrink-0">
                ({item.transactionCount})
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {item.percentage}%
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{analyticsService.formatINR(item.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
