import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Plus, SignOut } from '@phosphor-icons/react';
import { SpendxLogo } from '../landing/SpendxLogo';
import {
  NAVIGATION_GROUPS,
  NAVIGATION_ITEMS,
  NavigationItem,
} from '@/config/navigation';
import { useLayoutStore } from '@/stores/layoutStore';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export const DesktopSidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebarCollapse } = useLayoutStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const displayName = user?.fullName || 'Private Client';
  const displayEmail = user?.email || 'client@spendx.local';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PC';

  return (
    <aside
      aria-label="Desktop Sidebar Navigation"
      className={`hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out glass-panel rounded-3xl border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-2xl fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] select-none z-30 ${
        isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* 1. Brand Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
        <NavLink
          to="/dashboard"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl flex items-center gap-2 overflow-hidden"
          title="SPENDX Dashboard"
        >
          {isSidebarCollapsed ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <SpendxLogo size="sm" />
            </div>
          ) : (
            <SpendxLogo size="md" />
          )}
        </NavLink>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebarCollapse}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 2. Scrollable Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-5 pr-1 no-scrollbar">
        {NAVIGATION_GROUPS.map((group) => {
          const groupItems = NAVIGATION_ITEMS.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-1">
              {/* Group Title (Hidden when collapsed) */}
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 pb-1 block">
                  {group}
                </span>
              )}

              {/* Group Items */}
              <div className="space-y-1">
                {groupItems.map((item: NavigationItem) => {
                  const Icon = item.icon;
                  const isHovered = hoveredItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            isSidebarCollapsed
                              ? 'justify-center w-11 h-11 mx-auto'
                              : 'px-3 py-2.5 w-full'
                          } ${
                            isActive
                              ? item.isAiAccent
                                ? 'bg-gradient-to-r from-[#8066CC]/20 to-[#8B72D6]/20 text-[#8066CC] dark:text-[#B9A4FF] shadow-sm border border-[#8066CC]/30 font-bold'
                                : 'bg-primary/15 text-primary shadow-sm border border-primary/25 font-bold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              weight={isActive ? 'fill' : 'duotone'}
                              className={`shrink-0 transition-transform duration-200 ${
                                isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                              } ${isActive ? 'scale-110' : ''}`}
                            />

                            {!isSidebarCollapsed && (
                              <div className="flex-1 flex items-center justify-between truncate">
                                <span className="truncate">{item.name}</span>
                                {item.badge && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                      item.isAiAccent
                                        ? 'bg-[#8066CC] text-white'
                                        : 'bg-primary text-white'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>

                      {/* Tooltip in Collapsed Mode */}
                      {isSidebarCollapsed && isHovered && (
                        <div
                          role="tooltip"
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-2.5 py-1.5 rounded-xl glass-panel border border-white/80 dark:border-white/15 text-xs font-semibold text-foreground shadow-xl whitespace-nowrap animate-in fade-in duration-150 pointer-events-none"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="text-[9px] px-1 rounded bg-primary text-white">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 3. Sidebar Footer (Quick Action, Data Sync & Profile) */}
      <div className="pt-3 border-t border-black/5 dark:border-white/10 space-y-2.5">
        {/* Quick Add Action & Local Sync Status */}
        {!isSidebarCollapsed && (
          <div className="space-y-2">
            <button
              onClick={() => navigate('/transactions')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus weight="bold" className="w-3.5 h-3.5" />
              <span>Record Transaction</span>
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-[10px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Local Storage Active</span>
            </div>
          </div>
        )}

        {/* User Capsule */}
        <div
          className={`flex items-center rounded-2xl p-1.5 ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {initials}
            </div>

            {!isSidebarCollapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign Out"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
            >
              <SignOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
