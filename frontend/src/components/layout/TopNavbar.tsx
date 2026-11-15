import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { getRouteMetadata } from '@/config/navigation';
import { useLayoutStore } from '@/stores/layoutStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export const TopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openMobileDrawer, setGlobalSearchOpen } = useLayoutStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Dynamic route metadata (title, category, breadcrumbs)
  const metadata = getRouteMetadata(location.pathname);

  // Close profile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await authService.logout();
    navigate('/login');
  };

  const displayName = user?.fullName || 'SPENDX Member';
  const displayEmail = user?.email || 'member@spendx.app';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SX';

  return (
    <header className="sticky top-4 z-20 mb-4 sm:mb-6">
      <nav
        aria-label="Top Navigation"
        className="glass-panel rounded-2xl border border-white/80 dark:border-white/15 shadow-xl backdrop-blur-2xl px-4 sm:px-6 h-[68px] sm:h-[72px] flex items-center justify-between gap-4"
      >
        {/* Left: Mobile Menu Trigger + Dynamic Page Title & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={openMobileDrawer}
            aria-label="Open navigation menu"
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              {metadata.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/60" />}
                  <span
                    className={
                      idx === metadata.breadcrumbs.length - 1
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Dynamic Page Title */}
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {metadata.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop only) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/15 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Search transactions, accounts, insights...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle, Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Button */}
          <Link
            to="/notifications"
            aria-label="View notifications"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#DC5579] animate-pulse" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="User account menu"
              aria-expanded={isProfileMenuOpen}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#718FE8] to-[#8B72D6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {initials}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-bold text-foreground leading-none">{displayName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">SPENDX Pro</p>
              </div>
            </button>

            {/* Profile Flyout Dropdown */}
            {isProfileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-panel border border-white/80 dark:border-white/15 shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 backdrop-blur-2xl"
              >
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-black/5 dark:border-white/10 space-y-0.5">
                  <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
                  <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Session</span>
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>User Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    role="menuitem"
                  >
                    <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                    <span>Settings & Security</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-black/5 dark:border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
