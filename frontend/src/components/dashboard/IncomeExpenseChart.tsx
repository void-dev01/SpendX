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
  // Custom Glassmorphic Tooltip
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const incomeVal = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenseVal = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const netSavings = incomeVal - expenseVal;

      return (
        <div className="glass-surface p-3.5 rounded-xl border border-white/90 dark:border-white/15 shadow-lg text-xs space-y-1.5 min-w-[160px]">
          <p className="font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-100/60 dark:border-white/10 pb-1">
            {label}
          </p>

          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3 h-3" /> Income:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(incomeVal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="flex items-center gap-1 font-medium">
              <ArrowDownRight className="w-3 h-3" /> Expenses:
            </span>
            <span className="font-bold tabular-nums">
              {dashboardService.formatINR(expenseVal)}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-100/60 dark:border-white/10 flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
            <span>Net Saved:</span>
            <span className={`font-semibold tabular-nums ${netSavings >= 0 ? 'text-spendx-blue-primary' : 'text-amber-500'}`}>
              {dashboardService.formatINR(netSavings)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-spendx-indigo dark:text-spendx-soft-purple">
              Income vs Expenses
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Understand how your money moves over time.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12866E]" />
            <span className="text-slate-600 dark:text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC5579]" />
            <span className="text-slate-600 dark:text-slate-300">Expenses</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Income Gradient */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#12866E" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#12866E" stopOpacity={0.0} />
              </linearGradient>

              {/* Expense Gradient */}
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DC5579" stopOpacity={0.40} />
                <stop offset="95%" stopColor="#DC5579" stopOpacity={0.0} />
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
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              dy={6}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              dx={-4}
            />

            <Tooltip content={renderCustomTooltip} cursor={{ stroke: 'rgba(113, 143, 232, 0.25)', strokeWidth: 1.5, strokeDasharray: '4 4' }} />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#12866E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
              activeDot={{ r: 5, stroke: '#12866E', strokeWidth: 2, fill: '#FFFFFF' }}
            />

            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#DC5579"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
              activeDot={{ r: 5, stroke: '#DC5579', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
