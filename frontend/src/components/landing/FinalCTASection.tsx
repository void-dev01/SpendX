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
      {/* Decorative ambient background glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-[#D4AF37]/20 via-[#10B981]/15 to-[#D4AF37]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="glass-panel rounded-3xl sm:rounded-[36px] p-8 sm:p-14 border border-white/90 dark:border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-center space-y-8">
          {/* Subtle Floating Sparkle */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-xs font-semibold text-[#D4AF37] shadow-sm mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Start Your Intelligent Financial Journey</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] max-w-2xl mx-auto">
            Ready to Take Control of{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E2C766] to-[#10B981] bg-clip-text text-transparent">
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
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-[#0A0A0C] bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#AA8220] shadow-[0_8px_28px_rgba(212,175,55,0.45)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.6)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-7 py-4 rounded-full text-base font-medium text-foreground glass-panel hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center gap-2 cursor-pointer border border-white/80 dark:border-white/15"
            >
              <Compass className="w-4 h-4 text-primary" />
              <span>Explore SPENDX</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
