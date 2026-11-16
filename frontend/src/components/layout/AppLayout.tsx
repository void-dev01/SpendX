import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLayoutStore } from '@/stores/layoutStore';
import { DesktopSidebar } from './DesktopSidebar';
import { TopNavbar } from './TopNavbar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileMoreDrawer } from './MobileMoreDrawer';
import { GlobalSearchModal } from './GlobalSearchModal';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="min-h-screen spendx-ambient-bg text-foreground flex overflow-x-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* Subtle Ambient Background Lighting */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[650px] bg-[#B9DEFF]/25 dark:bg-[#4F75E8]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[650px] h-[650px] bg-[#E2D2FF]/25 dark:bg-[#7E57C2]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 1. Desktop Floating Frosted-Glass Sidebar (Fixed) */}
      <DesktopSidebar />

      {/* 2. Main Workspace Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen px-4 sm:px-6 lg:pr-6 pt-4 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-28' : 'md:pl-72'
        }`}
      >
        {/* Floating Top Navbar */}
        <TopNavbar />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 pb-28 md:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto w-full"
          >
            <Outlet />
          </motion.div>
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
