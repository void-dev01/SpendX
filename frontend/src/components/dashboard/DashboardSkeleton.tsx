import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200/70 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200/50 dark:bg-slate-800/60 rounded-lg" />
        </div>
        <div className="h-10 w-72 bg-slate-200/60 dark:bg-slate-800/70 rounded-2xl" />
      </div>

      {/* 4 Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-panel p-5 rounded-2xl h-36 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200/70 dark:bg-slate-800 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-36 bg-slate-200/80 dark:bg-slate-700 rounded-lg my-2" />
            <div className="h-3 w-40 bg-slate-200/50 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl h-96 flex flex-col justify-between">
          <div className="h-5 w-48 bg-slate-200/70 dark:bg-slate-800 rounded" />
          <div className="h-64 bg-slate-200/40 dark:bg-slate-800/40 rounded-xl" />
        </div>
        <div className="glass-panel p-6 rounded-2xl h-96 flex flex-col justify-between">
          <div className="h-5 w-40 bg-slate-200/70 dark:bg-slate-800 rounded" />
          <div className="w-40 h-40 mx-auto rounded-full border-8 border-slate-200/60 dark:border-slate-800" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200/60 dark:bg-slate-800 rounded" />
            <div className="h-3 bg-slate-200/60 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>

      {/* Lower Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl h-80" />
        <div className="glass-panel p-6 rounded-2xl h-80" />
      </div>
    </div>
  );
};
