import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2,
  AlertCircle,
  Info,
  CheckCheck,
} from 'lucide-react';
import { getRouteMetadata } from '@/config/navigation';
import { useLayoutStore } from '@/stores/layoutStore';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { authService } from '@/services/authService';

export const TopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openMobileDrawer, setGlobalSearchOpen } = useLayoutStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll: clearAllNotifications,
  } = useNotificationStore();

  // Dynamic route metadata (title, category, breadcrumbs)
  const metadata = getRouteMetadata(location.pathname);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsNotificationsOpen(false);
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

  const displayName = user?.fullName || (user?.email ? user.email.split('@')[0] : 'Private Client');
  const displayEmail = user?.email || 'client@spendx.local';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'PC';

  return (
    <header className="sticky top-0 z-30 pt-3 sm:pt-4 pb-3 sm:pb-4 mb-2 sm:mb-4 bg-background/95 backdrop-blur-md transition-all duration-200">
      <nav
        aria-label="Top Navigation"
        className="bg-surface rounded-[20px] border border-border shadow-card px-3 sm:px-6 h-[64px] sm:h-[72px] flex items-center justify-between gap-2 sm:gap-4"
      >
        {/* Left: Mobile Menu Trigger + Dynamic Page Title & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={openMobileDrawer}
            aria-label="Open navigation menu"
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 max-w-[140px] xs:max-w-[220px] sm:max-w-none">
            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              {metadata.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/60" />}
                  <span
                    className={
                      idx === metadata.breadcrumbs.length - 1
                        ? 'text-foreground font-semibold'
                        : 'text-secondary-text hover:text-foreground'
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Dynamic Page Title */}
            <h1 className="text-sm xs:text-base sm:text-lg font-display font-bold tracking-tight text-foreground truncate">
              {metadata.title}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar (Desktop only) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-xs text-secondary-text hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Search transactions, accounts, insights...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-surface border border-border text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme Toggle, Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Button (< lg) */}
          <button
            type="button"
            onClick={() => setGlobalSearchOpen(true)}
            aria-label="Open search command palette"
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Flyout Popup */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileMenuOpen(false);
              }}
              aria-label="View notifications"
              aria-expanded={isNotificationsOpen}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer active:scale-95"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 rounded-full bg-expense animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  role="region"
                  aria-label="Notifications panel"
                  className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-[20px] bg-surface border border-border shadow-elevated p-3 sm:p-4 z-50 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-display font-bold text-foreground">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto no-scrollbar space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-secondary-text space-y-1">
                        <CheckCheck className="w-7 h-7 mx-auto text-income/70" />
                        <p className="font-semibold text-foreground">All caught up!</p>
                        <p className="text-[11px]">No active notifications</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markAsRead(item.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            item.unread
                              ? 'bg-primary/10 border-primary/25 hover:border-primary/40'
                              : 'bg-surface-elevated border-border-subtle hover:border-border opacity-75'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              item.type === 'success'
                                ? 'bg-income/15 text-income'
                                : item.type === 'warning'
                                ? 'bg-warning/15 text-warning'
                                : 'bg-primary/15 text-primary'
                            }`}
                          >
                            {item.type === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : item.type === 'warning' ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Info className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs truncate ${item.unread ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-secondary-text line-clamp-2 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                    <Link
                      to="/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      View all in ledger →
                    </Link>
                    <button
                      onClick={clearAllNotifications}
                      className="text-muted-foreground hover:text-foreground cursor-pointer text-[10px]"
                    >
                      Clear all
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
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
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
                {initials}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-bold text-foreground leading-none">{displayName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">SPENDX Pro</p>
              </div>
            </button>

            {/* Profile Flyout Dropdown */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-[20px] bg-surface border border-border shadow-elevated p-2 space-y-1 z-50"
                >
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-border space-y-0.5">
                    <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
                    <div className="inline-flex items-center gap-1 text-[9px] font-semibold text-income pt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Session</span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 text-primary" />
                      <span>User Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors"
                      role="menuitem"
                    >
                      <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                      <span>Settings & Security</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-expense hover:bg-expense/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};
