import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { IncomeExpenseDataPoint, dashboardService } from '@/services/dashboardService';

interface IncomeExpenseChartProps {
  data: IncomeExpenseDataPoint[];
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  // Custom Solid FinTech Tooltip
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const incomeVal = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenseVal = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const netSavings = incomeVal - expenseVal;

      return (
        <div className="bg-card dark:bg-[#202420] p-4 rounded-xl border border-border shadow-elevated text-xs space-y-2 min-w-[170px]">
          <p className="font-bold text-foreground border-b border-border pb-1.5">
            {label}
          </p>

          <div className="flex items-center justify-between text-income">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> Income:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(incomeVal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-expense">
            <span className="flex items-center gap-1 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" /> Expenses:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(expenseVal)}
            </span>
          </div>

          <div className="pt-1.5 border-t border-border flex items-center justify-between text-secondary-text font-medium">
            <span>Net Saved:</span>
            <span className={`font-bold tabular-nums ${netSavings >= 0 ? 'text-foreground' : 'text-expense'}`}>
              {dashboardService.formatINR(netSavings)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card dark:bg-[#1B211B] p-6 rounded-[22px] border border-border shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between h-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
            Income vs Expenses
          </h2>
          <p className="text-xs text-secondary-text mt-0.5">
            Understand how your money moves over time.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-income" />
            <span className="text-secondary-text">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-expense" />
            <span className="text-secondary-text">Expenses</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full min-w-0 h-[280px] sm:h-[330px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(232, 235, 230, 0.7)"
            />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#747B74', fontSize: 12, fontWeight: 500 }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#747B74', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              dx={-4}
            />

            <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(165, 241, 43, 0.5)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2, fill: '#FFFFFF' }}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              activeDot={{ r: 5, stroke: '#EF4444', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
