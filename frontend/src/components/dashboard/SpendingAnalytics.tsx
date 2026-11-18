import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ArrowUpRight, Utensils, ShoppingBag, Car, Zap, Film, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SpendingCategory, dashboardService } from '@/services/dashboardService';

interface SpendingAnalyticsProps {
  totalSpent: number;
  categories: SpendingCategory[];
}

export const SpendingAnalytics: React.FC<SpendingAnalyticsProps> = ({
  totalSpent,
  categories,
}) => {
  // Map icon names to Lucide icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'Car':
        return <Car className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Film':
        return <Film className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SpendingCategory;
      return (
        <div className="bg-surface p-2.5 rounded-xl border border-border shadow-elevated text-xs min-w-[130px]">
          <p className="font-semibold text-foreground">
            {data.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-primary">
            <span>Amount:</span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(data.amount)}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {data.percentage}% of total outflow
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-[20px] border border-border shadow-card flex flex-col justify-between h-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
            Where Your Money Goes
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Explore your spending by category.
          </p>
        </div>

        <Link
          to="/analytics"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer group shrink-0"
        >
          <span>View Analytics</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative w-full min-w-0 h-[180px] sm:h-[200px] my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={renderCustomTooltip} />
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="amount"
              stroke="none"
            >
              {categories.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Spent
          </span>
          <span className="text-base sm:text-lg font-display font-bold text-foreground tabular-nums">
            {dashboardService.formatINR(totalSpent)}
          </span>
        </div>
      </div>

      {/* Category breakdown list */}
      <div className="space-y-1.5 mt-4 pt-4 border-t border-border">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: cat.color }}
              >
                {getCategoryIcon(cat.iconName)}
              </span>
              <span className="font-medium text-foreground">
                {cat.name}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-muted-foreground font-mono text-[11px]">
                {cat.percentage}%
              </span>
              <span className="font-semibold text-foreground tabular-nums">
                {dashboardService.formatINR(cat.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
