import React from 'react';
import { Moon, Sun, Bell, ShieldCheck } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Enterprise Security Active
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
        </Button>

        <Button variant="outline" size="icon" aria-label="Notifications" className="rounded-full">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </Button>

        <div className="flex items-center space-x-3 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary text-xs">
            SX
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">SPENDX User</p>
            <p className="text-xs text-muted-foreground">Standard Tier</p>
          </div>
        </div>
      </div>
    </header>
  );
};
