import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-border/80 dark:bg-[#242C23] rounded-xl" />
          <div className="h-4 w-96 bg-border/50 dark:bg-[#242C23]/60 rounded-lg" />
        </div>
        <div className="h-10 w-72 bg-border/60 dark:bg-[#242C23]/70 rounded-2xl" />
      </div>

      {/* 4 Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card dark:bg-[#1B211B] border border-border p-6 rounded-[22px] h-36 flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-border/70 dark:bg-[#242C23] rounded" />
              <div className="w-8 h-8 rounded-xl bg-border/70 dark:bg-[#242C23]" />
            </div>
            <div className="h-8 w-36 bg-border/80 dark:bg-[#242C23] rounded-lg my-2" />
            <div className="h-3 w-40 bg-border/50 dark:bg-[#242C23] rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card dark:bg-[#1B211B] border border-border p-6 rounded-[22px] h-96 flex flex-col justify-between shadow-xs">
          <div className="h-5 w-48 bg-border/70 dark:bg-[#242C23] rounded" />
          <div className="h-64 bg-border/40 dark:bg-[#242C23]/40 rounded-xl" />
        </div>
        <div className="bg-card dark:bg-[#1B211B] border border-border p-6 rounded-[22px] h-96 flex flex-col justify-between shadow-xs">
          <div className="h-5 w-40 bg-border/70 dark:bg-[#242C23] rounded" />
          <div className="w-40 h-40 mx-auto rounded-full border-8 border-border/60 dark:border-[#242C23]" />
          <div className="space-y-2">
            <div className="h-3 bg-border/60 dark:bg-[#242C23] rounded" />
            <div className="h-3 bg-border/60 dark:bg-[#242C23] rounded" />
          </div>
        </div>
      </div>

      {/* Lower Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card dark:bg-[#1B211B] border border-border p-6 rounded-[22px] h-80 shadow-xs" />
        <div className="bg-card dark:bg-[#1B211B] border border-border p-6 rounded-[22px] h-80 shadow-xs" />
      </div>
    </div>
  );
};
