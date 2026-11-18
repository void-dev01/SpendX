import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpendxLogo } from './SpendxLogo';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const [legalModalContent, setLegalModalContent] = useState<{
    title: string;
    text: string;
  } | null>(null);

  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openPrivacyModal = () => {
    setLegalModalContent({
      title: 'Privacy Policy',
      text: 'SPENDX respects your privacy. All financial data synchronized via supported sources is encrypted in transit and at rest. We do not sell your personal data or transaction records to advertisers. You maintain complete ownership and can export or delete your information at any time.',
    });
  };

  const openTermsModal = () => {
    setLegalModalContent({
      title: 'Terms of Service',
      text: 'SPENDX provides intelligent financial telemetry, transaction categorization, and analytical guidance for informational purposes. SPENDX is not an accredited financial advisor or broker. All financial decisions are made at the sole discretion of the user.',
    });
  };

  return (
    <footer className="relative border-t border-black/5 dark:border-white/10 pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand (Span 4) */}
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={() => scrollToSection('hero')}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg text-left"
              aria-label="SPENDX - Scroll to top"
            >
              <SpendxLogo size="md" showTagline />
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your money. Your intelligence. One smarter financial workspace designed to
              give you complete financial clarity and effortless control.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Tracking Guarantee</span>
            </div>
          </div>

          {/* Column 2: Product (Span 2) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => scrollToSection('features')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Features & Tools
                </button>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span>Dashboard Preview</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-semibold">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('ai-assistant')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  AI Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Telemetry & Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('budgets')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Budgets & Goals
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture & Security (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('security')}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Security Standards
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Privacy (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={openPrivacyModal}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={openTermsModal}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tag */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} SPENDX Technologies Inc. All rights reserved.</p>

          <div className="flex items-center gap-1.5">
            <span>Built with precision for intelligent financial clarity</span>
            <Sparkles className="w-3.5 h-3.5 text-[#8066CC] dark:text-[#A78BFA]" />
          </div>
        </div>
      </div>

      {/* Accessible Legal Policy Modal Dialog */}
      {legalModalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in duration-200"
        >
          <div className="bg-surface rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-border shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-foreground">
                {legalModalContent.title}
              </h3>
              <button
                onClick={() => setLegalModalContent(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-secondary-text leading-relaxed">
              {legalModalContent.text}
            </p>
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setLegalModalContent(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
