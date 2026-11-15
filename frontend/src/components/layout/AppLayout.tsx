import React from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { TopNavbar } from './TopNavbar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMoreDrawer } from './MobileMoreDrawer';
import { GlobalSearchModal } from './GlobalSearchModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen spendx-ambient-bg text-foreground flex overflow-x-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Decorative Ambient Background Radial Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#DDF5FF]/35 dark:bg-[#718FE8]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#EDE4FF]/40 dark:bg-[#8066CC]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Desktop Floating Frosted-Glass Sidebar */}
      <DesktopSidebar />

      {/* 2. Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen px-4 sm:px-6 lg:pr-6 lg:pl-0 pt-4">
        {/* Floating Top Navbar */}
        <TopNavbar />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 pb-28 md:pb-8">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-200">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 3. Mobile Floating Frosted Bottom Navigation */}
      <MobileBottomNav />

      {/* 4. Mobile More Navigation Drawer Sheet */}
      <MobileMoreDrawer />

      {/* 5. Global Search Command Palette Modal */}
      <GlobalSearchModal />
    </div>
  );
};
