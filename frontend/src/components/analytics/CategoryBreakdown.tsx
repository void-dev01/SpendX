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
      <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Where Your Money Goes
        </h3>
        <div className="py-12 text-center text-xs text-slate-400">
          No eligible expense categories detected for this timeframe.
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
          <div className="flex items-center justify-between text-spendx-blue-primary font-semibold">
            <span>Spent:</span>
            <span className="tabular-nums">{analyticsService.formatINR(data.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Share:</span>
            <span>{data.percentage}%</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Transactions:</span>
            <span>{data.transactionCount}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Where Your Money Goes
          </h2>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => onSelectCategory('ALL')}
              className="text-[11px] font-semibold text-spendx-blue-primary hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                  stroke={selectedCategory === entry.category ? '#263653' : 'transparent'}
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
                  ? 'bg-spendx-blue-primary/10 border-spendx-blue-primary/40 font-semibold'
                  : 'glass-surface border-white/60 dark:border-white/5 hover:border-spendx-blue-primary/30'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 dark:text-slate-200 truncate">
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
                <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
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
