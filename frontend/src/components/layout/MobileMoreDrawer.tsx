import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  PieChart,
  Target,
  Repeat,
  ChartNoAxesCombined,
  Lightbulb,
  FileText,
  UserRound,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useLayoutStore } from '@/stores/layoutStore';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

const secondaryItems = [
  { name: 'Budgets', path: '/budgets', icon: PieChart, group: 'Money Management' },
  { name: 'Savings Goals', path: '/savings', icon: Target, group: 'Money Management' },
  { name: 'Recurring Charges', path: '/recurring', icon: Repeat, group: 'Money Management' },
  { name: 'Analytics Telemetry', path: '/analytics', icon: ChartNoAxesCombined, group: 'Intelligence' },
  { name: 'Financial Insights', path: '/insights', icon: Lightbulb, group: 'Intelligence' },
  { name: 'Monthly Reports', path: '/reports', icon: FileText, group: 'Reporting' },
  { name: 'Profile', path: '/profile', icon: UserRound, group: 'Personal' },
  { name: 'Settings & Security', path: '/settings', icon: Settings, group: 'Personal' },
];

export const MobileMoreDrawer: React.FC = () => {
  const { isMobileDrawerOpen, closeMobileDrawer } = useLayoutStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Escape key handler and body scroll lock
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMobileDrawer();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileDrawerOpen, closeMobileDrawer]);

  const displayName = user?.fullName || 'SPENDX Member';
  const displayEmail = user?.email || 'member@spendx.app';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SX';

  const handleLogout = async () => {
    closeMobileDrawer();
    await authService.logout();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-50 flex flex-col justify-end md:hidden bg-slate-950/70"
          onClick={closeMobileDrawer}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
            className="bg-surface rounded-t-[32px] border-t border-border p-4 sm:p-6 max-h-[85dvh] overflow-y-auto space-y-4 sm:space-y-5 shadow-elevated pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 rounded-full bg-border mx-auto -mt-1 mb-2" />

        {/* Drawer Header with User Card & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-[#111711] flex items-center justify-center font-bold text-sm shadow-xs">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-foreground leading-tight">{displayName}</h3>
              <p className="text-xs text-secondary-text">{displayEmail}</p>
            </div>
          </div>

          <button
            onClick={closeMobileDrawer}
            aria-label="Close drawer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="space-y-1.5 py-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block px-2">
            Navigation Destinations
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/25 font-bold'
                        : 'text-foreground hover:bg-surface-elevated'
                    }`
                  }
                >
                  <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-income font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Encrypted Session</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-expense hover:bg-expense/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
