import React, { useEffect } from 'react';
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
  const { isSidebarCollapsed, setSidebarCollapsed } = useLayoutStore();

  // Responsive tablet sidebar handling: automatically collapse on small tablet viewports to give main content maximum space
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  return (
    <div className="min-h-screen min-h-dvh bg-background text-foreground flex overflow-x-hidden relative selection:bg-primary/20 selection:text-primary">
      {/* 1. Desktop Sidebar (Fixed) */}
      <DesktopSidebar />

      {/* 2. Main Workspace Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen min-h-dvh px-3 sm:px-6 lg:pr-6 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-28' : 'md:pl-72'
        }`}
      >
        {/* Fixed / Sticky Top Navbar */}
        <TopNavbar />

        {/* Scrollable Page Content Area */}
        <main className="flex-1 pb-24 md:pb-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl 2xl:max-w-[1600px] mx-auto w-full"
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
