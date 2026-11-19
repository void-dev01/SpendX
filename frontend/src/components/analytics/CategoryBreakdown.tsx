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

interface CategoryBreakdownProps {
  items: CategoryBreakdownItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between h-full shadow-card">
        <h3 className="text-base font-bold font-display text-foreground">
          Where Your Money Goes
        </h3>
        <div className="py-12 text-center text-xs text-muted-foreground">
          No eligible expense categories detected for this timeframe.
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
          <div className="flex items-center justify-between text-primary font-semibold">
            <span>Spent:</span>
            <span className="tabular-nums">{analyticsService.formatINR(data.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-secondary-text text-[11px]">
            <span>Share:</span>
            <span>{data.percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
            <span>Transactions:</span>
            <span>{data.transactionCount}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between h-full space-y-4 shadow-card">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-foreground">
            Where Your Money Goes
          </h2>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => onSelectCategory('ALL')}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
        <p className="text-xs text-secondary-text mt-0.5">
          Proportional breakdown of core & discretionary expenditures
        </p>
      </div>

      {/* Donut Chart */}
      <div className="h-48 w-full my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={renderTooltip} />
            <Pie
              data={items}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="amount"
              cursor="pointer"
              onClick={(entry: any) => {
                if (entry && entry.category) {
                  onSelectCategory(entry.category);
                }
              }}
            >
              {items.map((entry) => (
                <Cell
                  key={`cell-${entry.category}`}
                  fill={entry.color}
                  stroke={selectedCategory === entry.category ? '#10B981' : 'transparent'}
                  strokeWidth={selectedCategory === entry.category ? 2 : 0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Interactive List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item) => {
          const isSelected = selectedCategory === item.category;
          return (
            <div
              key={item.category}
              onClick={() =>
                onSelectCategory(isSelected ? 'ALL' : item.category)
              }
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                isSelected
                  ? 'bg-primary/10 border-primary/40 font-semibold text-foreground'
                  : 'bg-surface-elevated border-border hover:border-primary/40 text-foreground'
              }`}
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
                <span className="font-bold text-foreground tabular-nums">
                  {analyticsService.formatINR(item.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
