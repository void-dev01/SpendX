import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Sparkles,
  BarChart3,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI Coach', path: '/ai-coach', icon: Sparkles },
  { name: 'Savings Goals', path: '/savings', icon: Target },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border space-x-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-foreground">SPENDX</span>
          <span className="text-[10px] block text-muted-foreground font-mono">FINTECH CORE</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">Gemini Intelligence</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Real-time categorization & financial guidance.
          </p>
        </div>
      </div>
    </aside>
  );
};
