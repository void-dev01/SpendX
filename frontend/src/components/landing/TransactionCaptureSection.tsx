import React from 'react';
import {
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Building2,
  FileText,
} from 'lucide-react';

export const TransactionCaptureSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headline, Copy, 3 Benefits, Privacy Note */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-warning uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Capture Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground leading-tight">
              Your Transactions.{' '}
              <span className="text-gradient-brand">
                Captured Intelligently.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Spend less time entering transactions manually. SPENDX helps organize
              financial information from supported sources into a clear, structured
              transaction history.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
                    Less manual data entry
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Eliminate repetitive paperwork and spreadsheet maintenance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
                    Intelligent transaction extraction
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Parses merchant records, amounts, taxes, and timestamps accurately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
                    Organized transaction history
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Categorized, searchable, and audit-ready across all accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy-Conscious Disclaimer Note */}
            <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs flex items-start gap-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-income shrink-0 mt-0.5" />
              <span>
                <strong>Privacy by Design:</strong> Data capture strictly depends on
                supported integrations and user-authorized sources. SPENDX never
                accesses private accounts without explicit permission.
              </span>
            </div>
          </div>

          {/* Right Column: Visual Workflow Pipeline + Demo Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold font-display text-foreground uppercase tracking-wider">
                  Automated Extraction Pipeline
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-mono">
                  State Machine
                </span>
              </div>

              {/* Vertical Workflow Steps */}
              <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-40 -z-0" />

                {/* Node 1 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center shrink-0 border border-warning/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-surface-elevated rounded-xl px-3.5 py-2 border border-border-subtle flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Incoming Transaction Information
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Source Authorized</span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-surface-elevated rounded-xl px-3.5 py-2 border border-border-subtle flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Smart Data Extraction
                    </span>
                    <span className="text-[10px] text-primary font-mono">ML Parser</span>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 border border-secondary/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-surface-elevated rounded-xl px-3.5 py-2 border border-border-subtle flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Transaction Categorization
                    </span>
                    <span className="text-[10px] text-secondary font-mono">Auto-Tagged</span>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="flex items-center gap-3.5 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-income/15 text-income flex items-center justify-center shrink-0 border border-income/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-surface-elevated rounded-xl px-3.5 py-2 border border-border-subtle flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Validation & Review
                    </span>
                    <span className="text-[10px] text-income font-mono">Passed</span>
                  </div>
                </div>
              </div>

              {/* Demo Captured Transaction Card */}
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Extracted Record (Demo Data)</span>
                  <span className="text-[10px] font-mono">UPI / CARD</span>
                </div>
                <div className="rounded-2xl bg-surface-elevated border border-border-subtle p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-[#111711] flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-display text-foreground">Example Store</p>
                      <p className="text-xs text-muted-foreground">Category: Shopping • Instant Sync</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold font-display text-foreground tabular-nums">₹850.00</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-income font-medium">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Processed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
