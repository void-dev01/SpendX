import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import {
  insightsService,
  InsightsOverviewSummary,
} from '@/services/insightsService';

import { InsightsOverviewCards } from '@/components/insights/InsightsOverviewCards';
import { InsightsFilterToolbar } from '@/components/insights/InsightsFilterToolbar';
import { InsightCard } from '@/components/insights/InsightCard';
import { HealthScoreBreakdown } from '@/components/insights/HealthScoreBreakdown';
import { InsightsEmptyState } from '@/components/insights/InsightsEmptyState';

export const InsightsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedImpact, setSelectedImpact] = useState('ALL');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // 1. Fetch insights
  const { data: insights = [] } = useQuery({
    queryKey: ['financial-insights'],
    queryFn: () => insightsService.generateInsights(),
  });

  // 2. Fetch summary & health score
  const { data: summary } = useQuery<InsightsOverviewSummary>({
    queryKey: ['financial-insights-summary'],
    queryFn: () => insightsService.getOverviewSummary(),
  });

  // Filtering
  const filteredInsights = useMemo(() => {
    let result = [...insights];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'ALL') {
      result = result.filter((i) => i.type === selectedType);
    }

    // Impact filter
    if (selectedImpact !== 'ALL') {
      result = result.filter((i) => i.impact === selectedImpact);
    }

    // Bookmarked only
    if (showBookmarkedOnly) {
      result = result.filter((i) => i.isBookmarked);
    }

    return result;
  }, [insights, searchQuery, selectedType, selectedImpact, showBookmarkedOnly]);

  // Actions
  const handleBookmarkToggle = (id: string) => {
    insightsService.toggleBookmark(id);
    queryClient.invalidateQueries({ queryKey: ['financial-insights'] });
  };

  const handleDismiss = (id: string) => {
    insightsService.dismissInsight(id);
    queryClient.invalidateQueries({ queryKey: ['financial-insights'] });
    queryClient.invalidateQueries({ queryKey: ['financial-insights-summary'] });
  };

  const handleResetDismissed = () => {
    insightsService.resetDismissed();
    queryClient.invalidateQueries({ queryKey: ['financial-insights'] });
    queryClient.invalidateQueries({ queryKey: ['financial-insights-summary'] });
  };

  const isFiltering =
    Boolean(searchQuery.trim()) ||
    selectedType !== 'ALL' ||
    selectedImpact !== 'ALL' ||
    showBookmarkedOnly;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedImpact('ALL');
    setShowBookmarkedOnly(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Intelligence Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mt-1 text-foreground">
            Financial Insights & Advisory
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-1 max-w-2xl">
            Proactive financial recommendations, spending pace warnings, subscription audits, and capital growth opportunities.
          </p>
        </div>
      </div>

      {/* 2. Overview Cards */}
      {summary && <InsightsOverviewCards summary={summary} />}

      {/* 3. Health Score Breakdown */}
      {summary?.healthScore && <HealthScoreBreakdown healthScore={summary.healthScore} />}

      {/* 4. Filter Toolbar */}
      <InsightsFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedImpact={selectedImpact}
        onImpactChange={setSelectedImpact}
        showBookmarkedOnly={showBookmarkedOnly}
        onToggleBookmarkedOnly={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
        onResetDismissed={handleResetDismissed}
      />

      {/* 5. Insights Cards Grid */}
      {filteredInsights.length === 0 ? (
        <InsightsEmptyState
          isFiltering={isFiltering}
          onClearFilters={handleClearFilters}
          onResetDismissed={handleResetDismissed}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onBookmarkToggle={handleBookmarkToggle}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
};
