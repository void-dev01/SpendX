import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';
import { SpendxLogo } from './SpendxLogo';
import { useThemeStore } from '@/stores/themeStore';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-3.5 sm:pt-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between ${
          isScrolled
            ? 'glass-nav shadow-[0_12px_36px_-4px_rgba(83,104,162,0.18)] dark:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.5)] border border-white/80 dark:border-white/15'
            : 'glass-panel shadow-[0_8px_24px_-4px_rgba(83,104,162,0.08)] border border-white/60 dark:border-white/10'
        }`}
      >
        {/* Brand Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg text-left"
          aria-label="SPENDX - Home"
        >
          <SpendxLogo size="md" />
        </button>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => scrollToSection('hero')}
            className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Security
          </button>
        </div>

        {/* Right Desktop CTAs & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            Log In
          </Link>

          <button
            onClick={() => navigate('/signup')}
            className="relative group px-5 py-2.5 text-sm font-bold text-[#0A0A0C] rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA8220] shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle Button */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
            className="w-11 h-11 rounded-full flex items-center justify-center text-foreground hover:bg-white/40 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="pointer-events-auto fixed inset-x-4 top-20 z-50 md:hidden glass-panel rounded-3xl p-5 shadow-2xl border border-white/80 dark:border-white/15 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full text-left px-4 py-3 text-base font-medium rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-4 py-3 text-base font-medium rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left px-4 py-3 text-base font-medium rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="w-full text-left px-4 py-3 text-base font-medium rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
            >
              Security
            </button>

            <div className="pt-3 border-t border-white/40 dark:border-white/10 flex flex-col space-y-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-medium rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-colors text-foreground"
              >
                Log In
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
                className="w-full py-3.5 text-sm font-bold text-[#0A0A0C] rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA8220] shadow-[0_4px_16px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
