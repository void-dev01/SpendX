import React from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  TrendingDown,
  Lightbulb,
  Send,
} from 'lucide-react';

export const AIAssistantSection: React.FC = () => {
  return (
    <section id="ai-assistant" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
      {/* Soft Ambient Aura */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#10B981]/15 to-[#D4AF37]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: AI Identity, Heading, Description, Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPENDX Intelligence Core</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Meet Your Personal{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E2C766] to-[#10B981] bg-clip-text text-transparent">
                AI Money Assistant.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Understand your money in natural language. Ask questions, discover patterns,
              and make more informed financial decisions with contextual insights.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Natural language financial queries
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ask questions naturally without writing complex spreadsheet formulas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Proactive spending alerts & trend detection
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive context-aware warnings before small expenses breach monthly limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Personalized budget optimization
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Get actionable recommendations tailored to your unique financial pace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Chat Interface Showcase */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/80 dark:border-white/15 shadow-2xl relative backdrop-blur-2xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#10B981] text-[#0A0A0C] flex items-center justify-center shadow-sm font-bold">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">SPENDX AI Coach</h3>
                    <p className="text-[10px] text-muted-foreground">Always active • Context Aware</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                  Illustrative AI Preview (Demo)
                </span>
              </div>

              {/* Chat Conversation Scroll Stream */}
              <div className="space-y-3.5 py-4 text-xs sm:text-sm">
                {/* User Message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#D4AF37] to-[#AA8220] text-[#0A0A0C] font-semibold p-3.5 shadow-sm">
                    Where did most of my money go this month?
                  </div>
                </div>

                {/* AI Response 1 */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10B981]/20 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 p-3.5 text-foreground shadow-sm space-y-2">
                    <p>
                      Your highest spending category this month is <strong>Food & Dining</strong>,
                      accounting for <strong className="text-primary tabular-nums">₹6,200</strong> of your
                      total expenses.
                    </p>

                    {/* AI Embedded Insight Badge */}
                    <div className="rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-2.5 flex items-center gap-2 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#D4AF37] font-medium">
                        Dining expenses increased 12% compared with last month.
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Message 2 */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#D4AF37] to-[#AA8220] text-[#0A0A0C] font-semibold p-3.5 shadow-sm">
                    How can I reduce my monthly expenses?
                  </div>
                </div>

                {/* AI Response 2 */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#10B981]/20 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/10 p-3.5 text-foreground shadow-sm">
                    Your recent spending shows opportunities to review dining and subscription expenses.
                    Consider setting category limits to monitor them.
                  </div>
                </div>
              </div>

              {/* Chat Input Field Preview */}
              <div className="pt-2">
                <div className="flex items-center gap-2 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 px-4 py-2.5">
                  <input
                    type="text"
                    disabled
                    placeholder="Ask SPENDX AI anything about your money..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none cursor-not-allowed"
                  />
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8220] text-[#0A0A0C] flex items-center justify-center shrink-0 opacity-90 shadow-sm">
                    <Send className="w-3.5 h-3.5" />
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
