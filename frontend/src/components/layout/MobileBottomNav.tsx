import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  House,
  ArrowLeftRight,
  Sparkles,
  Wallet,
  Menu,
} from 'lucide-react';
import { useLayoutStore } from '@/stores/layoutStore';

export const MobileBottomNav: React.FC = () => {
  const { toggleMobileDrawer } = useLayoutStore();
  const location = useLocation();

  const isMoreActive = [
    '/budgets',
    '/savings',
    '/recurring',
    '/analytics',
    '/insights',
    '/reports',
    '/notifications',
    '/profile',
    '/settings',
  ].some((path) => location.pathname.startsWith(path));

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 mx-auto max-w-md h-16 rounded-full glass-nav border border-white/80 dark:border-white/15 shadow-[0_12px_36px_-4px_rgba(83,104,162,0.18)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6)] px-2 flex items-center justify-around pb-[env(safe-area-inset-bottom)]"
    >
      {/* 1. Home */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all duration-200 ${
            isActive
              ? 'text-primary font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-primary text-white shadow-sm' : ''
              }`}
            >
              <House className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </>
        )}
      </NavLink>

      {/* 2. Activity / Transactions */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all duration-200 ${
            isActive
              ? 'text-primary font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-primary text-white shadow-sm' : ''
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Activity</span>
          </>
        )}
      </NavLink>

      {/* 3. AI Intelligence */}
      <NavLink
        to="/ai-assistant"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all duration-200 ${
            isActive
              ? 'text-[#8066CC] dark:text-[#B9A4FF] font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-tr from-[#718FE8] to-[#8066CC] text-white shadow-md'
                  : 'text-[#8066CC]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">AI Coach</span>
          </>
        )}
      </NavLink>

      {/* 4. Wallet / Accounts */}
      <NavLink
        to="/accounts"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all duration-200 ${
            isActive
              ? 'text-primary font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-primary text-white shadow-sm' : ''
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Wallet</span>
          </>
        )}
      </NavLink>

      {/* 5. More Drawer Trigger */}
      <button
        type="button"
        onClick={toggleMobileDrawer}
        aria-label="More navigation destinations"
        className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-2xl transition-all duration-200 cursor-pointer ${
          isMoreActive
            ? 'text-primary font-bold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isMoreActive ? 'bg-primary/20 text-primary' : ''
          }`}
        >
          <Menu className="w-4 h-4" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">More</span>
      </button>
    </nav>
  );
};
