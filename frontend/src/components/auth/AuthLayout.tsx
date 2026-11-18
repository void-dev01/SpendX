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
    <div className="min-h-screen spendx-ambient-bg text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-[#DDF5FF]/40 dark:bg-[#718FE8]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#EDE4FF]/45 dark:bg-[#8066CC]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Floating Utility Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group px-3 py-1.5 rounded-full hover:bg-white/40 dark:hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        {/* Mobile SPENDX Logo (visible when left panel is hidden) */}
        <div className="lg:hidden">
          <Link to="/">
            <SpendxLogo size="sm" />
          </Link>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground glass-panel hover:bg-white/60 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer border border-white/60 dark:border-white/10"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-warning" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex items-center justify-center px-3.5 sm:px-6 py-4 sm:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 glass-panel rounded-3xl sm:rounded-[36px] border border-white/80 dark:border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden min-h-0 lg:min-h-[640px]">
          {/* Left Panel: Brand Experience (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent border-r border-white/60 dark:border-white/10">
            <AuthBrandPanel />
          </div>

          {/* Right Panel: Authentication Form Area */}
          <div className="lg:col-span-7 flex flex-col justify-center px-4 xs:px-6 sm:px-12 py-6 sm:py-12">
            <div className="w-full max-w-md mx-auto space-y-6">
              {/* Form Heading Header */}
              <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {pageTitle}
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pageSubtitle}
                </p>
              </div>

              {/* Injected Form Body */}
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SPENDX Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
};
