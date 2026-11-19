import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { SpendxLogo } from '../landing/SpendxLogo';
import { AuthBrandPanel } from './AuthBrandPanel';
import { useThemeStore } from '@/stores/themeStore';

interface AuthLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="h-screen max-h-screen w-full bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Top Utility Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-text hover:text-foreground transition-colors group px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-elevated shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Mobile SPENDX Logo */}
        <div className="lg:hidden">
          <Link to="/">
            <SpendxLogo size="sm" />
          </Link>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-secondary-text hover:text-foreground bg-surface border border-border hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-warning" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
        </button>
      </header>

      {/* Main Container - Fit to single screen without scroll */}
      <main className="flex-1 flex items-center justify-center px-3.5 sm:px-6 py-1 sm:py-2 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-surface rounded-2xl border border-border shadow-elevated overflow-hidden max-h-full">
          {/* Left Panel: Brand Experience (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 border-r border-border">
            <AuthBrandPanel />
          </div>

          {/* Right Panel: Authentication Form Area */}
          <div className="lg:col-span-7 flex flex-col justify-center px-4 xs:px-6 sm:px-10 py-5 sm:py-6 bg-surface overflow-y-auto no-scrollbar">
            <div className="w-full max-w-md mx-auto space-y-3.5">
              {/* Form Heading Header */}
              <div className="space-y-1 text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-foreground">
                  {pageTitle}
                </h1>
                <p className="text-xs text-secondary-text">
                  {pageSubtitle}
                </p>
              </div>

              {/* Injected Form Body */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-2 text-center text-[10px] sm:text-[11px] text-muted-foreground shrink-0">
        © {new Date().getFullYear()} SPENDX Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
};
