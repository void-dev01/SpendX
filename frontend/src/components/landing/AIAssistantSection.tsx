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
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: AI Identity, Heading, Description, Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-secondary uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPENDX Intelligence Core</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-foreground leading-tight">
              Meet Your Personal{' '}
              <span className="text-gradient-ai">
                AI Money Assistant.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Understand your money in natural language. Ask questions, discover patterns,
              and make more informed financial decisions with contextual insights.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
                    Natural language financial queries
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ask questions naturally without writing complex spreadsheet formulas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
                    Proactive spending alerts & trend detection
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Receive context-aware warnings before small expenses breach monthly limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-income/10 text-income flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-foreground">
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
            <div className="bg-surface rounded-3xl p-5 sm:p-7 border border-border shadow-elevated relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center shadow-xs font-bold font-display">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-foreground">SPENDX AI Coach</h3>
                    <p className="text-[10px] text-muted-foreground">Always active • Context Aware</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold border border-secondary/20">
                  Illustrative AI Preview (Demo)
                </span>
              </div>

              {/* Chat Conversation Scroll Stream */}
              <div className="space-y-3.5 py-4 text-xs sm:text-sm">
                {/* User Message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary text-[#111711] font-semibold p-3.5 shadow-xs">
                    Where did most of my money go this month?
                  </div>
                </div>

                {/* AI Response 1 */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-xs bg-surface-elevated border border-border-subtle p-3.5 text-foreground shadow-xs space-y-2">
                    <p>
                      Your highest spending category this month is <strong>Food & Dining</strong>,
                      accounting for <strong className="text-primary tabular-nums">₹6,200</strong> of your
                      total expenses.
                    </p>

                    {/* AI Embedded Insight Badge */}
                    <div className="rounded-xl bg-secondary/10 border border-secondary/20 p-2.5 flex items-center gap-2 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="text-secondary font-medium">
                        Dining expenses increased 12% compared with last month.
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Message 2 */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary text-[#111711] font-semibold p-3.5 shadow-xs">
                    How can I reduce my monthly expenses?
                  </div>
                </div>

                {/* AI Response 2 */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-xs bg-surface-elevated border border-border-subtle p-3.5 text-foreground shadow-xs">
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
                  <div className="w-7 h-7 rounded-xl bg-primary text-[#111711] flex items-center justify-center shrink-0 opacity-90 shadow-sm">
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
