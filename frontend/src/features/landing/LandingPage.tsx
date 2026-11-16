import React, { useEffect } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValueStrip } from '@/components/landing/ValueStrip';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TransactionCaptureSection } from '@/components/landing/TransactionCaptureSection';
import { AIAssistantSection } from '@/components/landing/AIAssistantSection';
import { AnalyticsSection } from '@/components/landing/AnalyticsSection';
import { BudgetSavingsSection } from '@/components/landing/BudgetSavingsSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { FinalCTASection } from '@/components/landing/FinalCTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Dynamic page title and SEO description
    document.title = 'SPENDX — Your Money. Your Intelligence.';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Manage your finances smarter with SPENDX. Track transactions, understand spending patterns, manage budgets, and explore AI-powered financial insights.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen spendx-ambient-bg text-foreground selection:bg-primary/20 selection:text-primary relative selection:rounded">
      {/* Ambient background decoration shapes */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#DDF5FF]/40 dark:bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#E6F4EA]/50 dark:bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Navigation Bar */}
      <LandingNavbar />

      <main>
        {/* 2 & 3. Hero Section (Includes Interactive HeroDashboard Showcase) */}
        <HeroSection />

        {/* 4. Trusted-by / Product Value Strip */}
        <ValueStrip />

        {/* 5. Core Features */}
        <FeaturesSection />

        {/* 6. Automatic Transaction Capture */}
        <TransactionCaptureSection />

        {/* 7. AI Financial Assistant */}
        <AIAssistantSection />

        {/* 8. Smart Analytics */}
        <AnalyticsSection />

        {/* 9. Budget and Savings Management */}
        <BudgetSavingsSection />

        {/* 10. How SPENDX Works */}
        <HowItWorksSection />

        {/* 11. Security and Privacy */}
        <SecuritySection />

        {/* 12. Final Call to Action */}
        <FinalCTASection />
      </main>

      {/* 13. Footer */}
      <LandingFooter />
    </div>
  );
};
