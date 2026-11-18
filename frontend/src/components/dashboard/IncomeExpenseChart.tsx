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
        <div className="bg-surface p-3.5 rounded-xl border border-border shadow-elevated text-xs space-y-1.5 min-w-[160px]">
          <p className="font-semibold text-foreground border-b border-border pb-1">
            {label}
          </p>

          <div className="flex items-center justify-between text-income">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" /> Income:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(incomeVal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-expense">
            <span className="flex items-center gap-1 font-medium">
              <ArrowDownRight className="w-3 h-3" /> Expenses:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(expenseVal)}
            </span>
          </div>

          <div className="pt-1 border-t border-border flex items-center justify-between text-secondary-text font-medium">
            <span>Net Saved:</span>
            <span className={`font-semibold tabular-nums ${netSavings >= 0 ? 'text-primary' : 'text-warning'}`}>
              {dashboardService.formatINR(netSavings)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between h-full min-w-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
              Income vs Expenses
            </h2>
          </div>
          <p className="text-xs text-secondary-text mt-0.5">
            Understand how your money moves over time.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-income" />
            <span className="text-secondary-text">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-expense" />
            <span className="text-secondary-text">Expenses</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full min-w-0 h-[240px] xs:h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Income Gradient */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#11866D" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#11866D" stopOpacity={0.0} />
              </linearGradient>

              {/* Expense Gradient */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D95765" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#D95765" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
            />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8492AA', fontSize: 12 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8492AA', fontSize: 11 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              dx={-4}
            />

            <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(73, 107, 219, 0.25)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#11866D"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              activeDot={{ r: 5, stroke: '#11866D', strokeWidth: 2, fill: '#FFFFFF' }}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#D95765"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              activeDot={{ r: 5, stroke: '#D95765', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
