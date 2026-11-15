import React from 'react';
import { Search, Bookmark, RefreshCw, Filter } from 'lucide-react';

interface InsightsFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedImpact: string;
  onImpactChange: (impact: string) => void;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  onResetDismissed: () => void;
}

const TYPE_PILLS: { label: string; value: string }[] = [
  { label: 'All Insights', value: 'ALL' },
  { label: 'Alerts', value: 'CRITICAL_ALERT' },
  { label: 'Savings Opportunities', value: 'SAVINGS_OPPORTUNITY' },
  { label: 'Budget Advice', value: 'BUDGET_ADVICE' },
  { label: 'Milestones', value: 'MILESTONE_CELEBRATION' },
  { label: 'Cash Flow', value: 'CASH_FLOW_INTELLIGENCE' },
];

export const InsightsFilterToolbar: React.FC<InsightsFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedImpact,
  onImpactChange,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
  onResetDismissed,
}) => {
  return (
    <div className="space-y-3">
      {/* Search & Top Controls */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search intelligence, advice, budget nudges..."
            value={searchQuery}
            aria-label="Search insights"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 transition-all"
          />
        </div>

        {/* Right side controls: Impact dropdown, Bookmark toggle, Reset Dismissed */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Impact Filter Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={selectedImpact}
              onChange={(e) => onImpactChange(e.target.value)}
              aria-label="Filter by impact level"
              className="w-full appearance-none pl-3 pr-7 py-2 text-xs font-semibold rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple focus:outline-none focus:ring-2 focus:ring-spendx-blue-primary/40 cursor-pointer"
            >
              <option value="ALL">All Impact</option>
              <option value="HIGH">High Impact</option>
              <option value="MEDIUM">Medium Impact</option>
              <option value="LOW">Low Impact</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Bookmarked toggle button */}
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            aria-label="Show bookmarked only"
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
              showBookmarkedOnly
                ? 'bg-spendx-purple-primary text-white border-spendx-purple-primary shadow-sm'
                : 'bg-white/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-white' : ''}`} />
            <span>Saved</span>
          </button>

          {/* Reset Dismissed */}
          <button
            type="button"
            onClick={onResetDismissed}
            title="Restore dismissed insights"
            className="p-2 text-xs font-semibold rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Pill Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TYPE_PILLS.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => onTypeChange(pill.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === pill.value
                ? 'bg-spendx-blue-primary text-white shadow-sm shadow-spendx-blue-primary/20'
                : 'bg-white/60 dark:bg-slate-900/40 border border-slate-200/70 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
};
