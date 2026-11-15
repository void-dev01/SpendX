import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { DateRangePeriod } from '@/services/dashboardService';

interface DashboardHeaderProps {
  userDisplayName: string;
  isDemo: boolean;
  selectedPeriod: DateRangePeriod;
  onPeriodChange: (period: DateRangePeriod) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userDisplayName,
  isDemo,
  selectedPeriod,
  onPeriodChange,
}) => {
  // Determine appropriate time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const periodOptions: { label: string; value: DateRangePeriod }[] = [
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'This Year', value: 'this_year' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      {/* Left: Greeting & Date */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple">
            {getGreeting()}, {userDisplayName}!
          </h1>

          {isDemo && (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
              title="Currently showing illustrative benchmark data. Connect your accounts to enable live synchronization."
            >
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Demo Data
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-spendx-blue-primary" />
          <span>{currentDateFormatted}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>Here's what's happening with your money today.</span>
        </div>
      </div>

      {/* Right: Date-range selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-surface border border-white/80 dark:border-white/10 self-start md:self-auto shadow-sm">
        {periodOptions.map((opt) => {
          const isActive = selectedPeriod === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
