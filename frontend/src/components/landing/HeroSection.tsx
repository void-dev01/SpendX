import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, ArrowLeftRight, Sparkles, ShieldCheck } from 'lucide-react';
import { HeroDashboard } from './HeroDashboard';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Ambient Gradient Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] bg-gradient-to-tr from-[#C9E5FF]/40 via-[#DCD9FF]/40 to-[#EDE4FF]/50 blur-3xl rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-48 -left-32 w-72 h-72 bg-[#718FE8]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 -right-32 w-72 h-72 bg-[#8B72D6]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, CTAs, Trust Indicators */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Intelligent Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/80 dark:border-white/15 text-xs font-medium text-foreground shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span className="font-semibold text-primary">Next-Gen Fintech</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Automated Financial Intelligence</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Your Money.{' '}
              <span className="bg-gradient-to-r from-[#718FE8] via-[#8B72D6] to-[#8066CC] bg-clip-text text-transparent block sm:inline">
                Your Intelligence.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Manage your money smarter with AI-powered tracking, automated transactions,
              and personalized financial insights — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-2">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#718FE8] via-[#8B72D6] to-[#8066CC] shadow-[0_8px_24px_rgba(113,143,232,0.4)] hover:shadow-[0_12px_28px_rgba(113,143,232,0.55)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-base font-medium text-foreground glass-panel hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer border border-white/80 dark:border-white/15"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Explore Features</span>
              </button>
            </div>

            {/* Supporting Trust Indicators */}
            <div className="pt-4 border-t border-black/5 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-3 h-3" />
                </div>
                <span>Smart Transaction Tracking</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-[#8066CC]/10 text-[#8066CC] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>AI-Powered Insights</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <span>Complete Financial Overview</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Dashboard Showcase */}
          <div className="lg:col-span-6 w-full pt-4 lg:pt-0">
            <HeroDashboard />
          </div>
        </div>
      </div>
    </section>
  );
};
