import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface rounded-3xl sm:rounded-[36px] p-8 sm:p-14 border border-border shadow-elevated relative overflow-hidden text-center space-y-8">
          {/* Subtle Floating Sparkle */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-subtle text-xs font-semibold text-secondary shadow-xs mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Start Your Intelligent Financial Journey</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-foreground leading-[1.15] max-w-2xl mx-auto">
            Ready to Take Control of{' '}
            <span className="text-gradient-brand">
              Your Money?
            </span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Start building a clearer relationship with your finances using intelligent tools
            designed around you. No spreadsheets. No guesswork. Just clarity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-[#111711] bg-primary hover:bg-primary-hover shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-7 py-4 rounded-full text-base font-medium text-foreground bg-surface-elevated hover:bg-muted transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer border border-border shadow-xs"
            >
              <Compass className="w-4 h-4 text-primary" />
              <span>Explore SPENDX</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-income" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-income" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-income" />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
