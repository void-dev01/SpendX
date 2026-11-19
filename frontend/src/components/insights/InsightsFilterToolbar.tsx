import React from 'react';
import { Search, Bookmark, RefreshCw, ChevronDown, X } from 'lucide-react';

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
      <div className="p-3.5 sm:p-4 rounded-2xl bg-card dark:bg-[#1B211B] border border-border shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search intelligence, advice, budget nudges..."
            value={searchQuery}
            aria-label="Search insights"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Impact dropdown, Bookmark toggle, Reset Dismissed */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Impact Filter Dropdown */}
          <div className="relative flex-1 sm:flex-none min-w-[130px]">
            <select
              value={selectedImpact}
              onChange={(e) => onImpactChange(e.target.value)}
              aria-label="Filter by impact level"
              className={`w-full appearance-none h-10 pl-3.5 pr-8 text-xs font-semibold rounded-xl bg-surface-subtle dark:bg-[#242C23] border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-xs ${
                selectedImpact !== 'ALL'
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border text-foreground hover:border-primary/40'
              }`}
            >
              <option value="ALL">All Impact</option>
              <option value="HIGH">High Impact</option>
              <option value="MEDIUM">Medium Impact</option>
              <option value="LOW">Low Impact</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Bookmarked toggle button */}
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            aria-label="Show bookmarked only"
            className={`h-10 px-3.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              showBookmarkedOnly
                ? 'bg-primary text-[#111711] border-primary font-bold'
                : 'bg-surface-subtle dark:bg-[#242C23] border-border text-secondary-text hover:text-foreground hover:bg-card hover:border-primary/40'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-[#111711]' : ''}`} />
            <span>Saved</span>
          </button>

          {/* Reset Dismissed */}
          <button
            type="button"
            onClick={onResetDismissed}
            title="Restore dismissed insights"
            aria-label="Restore dismissed insights"
            className="h-10 px-3 text-xs font-semibold rounded-xl bg-surface-subtle dark:bg-[#242C23] border border-border text-secondary-text hover:text-foreground hover:bg-card hover:border-primary/40 transition-colors shadow-xs flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Pill Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {TYPE_PILLS.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => onTypeChange(pill.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              selectedType === pill.value
                ? 'bg-primary text-[#111711] font-bold shadow-xs'
                : 'bg-card dark:bg-[#1B211B] border border-border text-secondary-text hover:text-foreground hover:border-primary/40 font-medium'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
};
