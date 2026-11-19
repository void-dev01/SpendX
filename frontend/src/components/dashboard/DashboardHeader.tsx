import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { DateRangePeriod } from '@/services/dashboardService';

interface DashboardHeaderProps {
  userDisplayName: string;
  isDemo: boolean;
  selectedPeriod: DateRangePeriod;
  onPeriodChange: (period: DateRangePeriod) => void;
  onClearSampleData?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userDisplayName,
  isDemo,
  selectedPeriod,
  onPeriodChange,
  onClearSampleData,
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
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground">
            {getGreeting()}, {userDisplayName}!
          </h1>

          {isDemo && (
            <div className="inline-flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/20"
                title="Currently showing illustrative benchmark data. Connect your accounts to enable live synchronization."
              >
                <AlertCircle className="w-3 h-3 text-warning" />
                Demo Data
              </span>
              {onClearSampleData && (
                <button
                  type="button"
                  onClick={onClearSampleData}
                  className="text-[11px] font-semibold underline text-warning hover:opacity-80 transition-opacity cursor-pointer"
                  title="Clear benchmark sample data and start with an empty real portfolio"
                >
                  Clear Sample Data & Start Fresh
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-secondary-text">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>{currentDateFormatted}</span>
          <span className="text-border">•</span>
          <span>Here's what's happening with your money today.</span>
        </div>
      </div>

      {/* Right: Date-range selector */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-card dark:bg-[#1B211B] border border-border self-start md:self-auto shadow-xs">
        {periodOptions.map((opt) => {
          const isActive = selectedPeriod === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPeriodChange(opt.value)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'text-secondary-text hover:text-foreground hover:bg-surface-subtle font-medium'
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
