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
      <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between h-full shadow-card">
        <h3 className="text-base font-bold font-display text-foreground">
          Income Sources
        </h3>
        <div className="py-12 text-center text-xs text-muted-foreground">
          No eligible income sources detected for this timeframe.
        </div>
      </div>
    );
  }

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryBreakdownItem;
      return (
        <div className="bg-surface p-2.5 rounded-xl border border-border shadow-elevated text-xs min-w-[140px] space-y-1">
          <p className="font-bold font-display text-foreground">{data.category}</p>
          <div className="flex items-center justify-between text-income font-semibold">
            <span>Inflow:</span>
            <span className="tabular-nums">{analyticsService.formatINR(data.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-secondary-text text-[11px]">
            <span>Share:</span>
            <span>{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between h-full space-y-4 shadow-card">
      <div>
        <h2 className="text-base font-bold font-display text-foreground">
          Income Sources
        </h2>
        <p className="text-xs text-secondary-text mt-0.5">
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
              stroke="none"
            >
              {items.map((entry) => (
                <Cell key={`income-${entry.category}`} fill={entry.color} stroke="none" />
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
            className="p-2.5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground truncate font-medium">
                {item.category}
              </span>
              <span className="text-[10px] text-muted-foreground shrink-0">
                ({item.transactionCount})
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-secondary-text font-medium">
                {item.percentage}%
              </span>
              <span className="font-bold text-income tabular-nums">
                +{analyticsService.formatINR(item.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
