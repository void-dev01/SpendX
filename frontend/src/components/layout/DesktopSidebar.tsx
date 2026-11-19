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
      className={`hidden md:flex flex-col justify-between shrink-0 transition-[width,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-surface rounded-2xl border border-border shadow-card fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] select-none z-30 ${
        isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* 1. Brand Header */}
      <div className={`flex items-center pb-3 border-b border-border ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
        <NavLink
          to="/dashboard"
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl flex items-center justify-center overflow-hidden"
          title="SPENDX Dashboard"
        >
          {isSidebarCollapsed ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <SpendxLogo size="md" iconOnly />
            </div>
          ) : (
            <SpendxLogo size="md" />
          )}
        </NavLink>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={toggleSidebarCollapse}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* 2. Scrollable Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-1 space-y-2 pr-1 pb-6 scrollbar-thin">
        {NAVIGATION_GROUPS.map((group) => {
          const groupItems = NAVIGATION_ITEMS.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="space-y-0.5">
              {/* Group Title (Hidden when collapsed) */}
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 pb-0.5 pt-0.5 block">
                  {group}
                </span>
              )}

              {/* Group Items */}
              <div className="space-y-0.5">
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
                          `flex items-center gap-3 rounded-xl text-xs font-semibold transition-colors duration-200 ease-out active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                            isSidebarCollapsed
                              ? 'justify-center w-10 h-10 mx-auto'
                              : 'px-3 py-2 w-full'
                          } ${
                            isActive
                              ? 'bg-primary/20 text-foreground border border-primary/40 font-bold'
                              : 'text-secondary-text hover:text-foreground hover:bg-surface-elevated'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              weight={isActive ? 'fill' : 'duotone'}
                              className={`shrink-0 transition-transform duration-200 ${
                                isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                              } ${isActive ? 'scale-105 text-foreground' : ''}`}
                            />

                            {!isSidebarCollapsed && (
                              <div className="flex-1 flex items-center justify-between truncate">
                                <span className="truncate">{item.name}</span>
                                {item.badge && (
                                  <span
                                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary text-primary-foreground"
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
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 px-2.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground shadow-elevated whitespace-nowrap animate-in fade-in duration-150 pointer-events-none"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-bold">
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
      <div className="pt-2 border-t border-border space-y-2">
        {/* Quick Add Action & Local Sync Status */}
        {!isSidebarCollapsed && (
          <div className="space-y-1.5">
            <button
              onClick={() => navigate('/transactions')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus weight="bold" className="w-3.5 h-3.5 text-primary-foreground" />
              <span>Record Transaction</span>
            </button>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-elevated text-[10px] text-muted-foreground border border-border-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-income animate-pulse" />
              <span className="font-medium">Local Storage Active</span>
            </div>
          </div>
        )}

        {/* User Capsule — Navigates directly to Settings on click */}
        <div
          className={`flex items-center rounded-2xl p-1 transition-colors hover:bg-surface-elevated ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl cursor-pointer flex-1 group"
            title="Account Settings — Click to update name & email"
            aria-label="Open Account Settings to update name and email"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-[#111711] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              {initials}
            </div>

            {!isSidebarCollapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
              </div>
            )}
          </button>

          {!isSidebarCollapsed && (
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign Out"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-expense hover:bg-expense/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0 ml-1"
            >
              <SignOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
