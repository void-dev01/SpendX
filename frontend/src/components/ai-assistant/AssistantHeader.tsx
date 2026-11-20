import React from 'react';
import { Plus, History, Bot, Clock, Sparkles } from 'lucide-react';
import { DailyQuotaInfo } from '@/services/aiAssistantService';
import { cn } from '@/lib/utils';

interface AssistantHeaderProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  quota?: DailyQuotaInfo;
  queuedCount?: number;
  onOpenQueuedModal?: () => void;
  className?: string;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  onNewChat,
  onToggleSidebar,
  isSidebarOpen,
  quota,
  queuedCount = 0,
  onOpenQueuedModal,
  className,
}) => {
  const remaining = quota ? quota.remaining : 200;

  return (
    <div
      className={cn(
        'p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-surface-elevated/40',
        className
      )}
    >
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold font-display text-foreground">
              Your AI Financial Assistant
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-income animate-pulse" />
              Gemini 2.5 Active
            </span>
          </div>
          <p className="text-xs text-secondary-text line-clamp-1">
            Your money questions, answered intelligently.
          </p>
        </div>
      </div>

      {/* Action Buttons & Quota Pill */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Remaining Quota Badge */}
        <div
          title={`Daily limit: 200 messages/day. Resets at midnight UTC.`}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold border shadow-xs ${
            remaining <= 10
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              : 'bg-surface-elevated text-foreground border-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>
            {remaining}/200 left
          </span>
        </div>

        {/* Queued Messages Modal Trigger */}
        {onOpenQueuedModal && (
          <button
            type="button"
            onClick={onOpenQueuedModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shadow-xs ${
              queuedCount > 0
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25'
                : 'bg-surface-elevated border-border text-secondary-text hover:text-foreground hover:bg-surface'
            }`}
            title="View scheduled questions for tomorrow"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Queued</span>
            {queuedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center">
                {queuedCount}
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-[#111711] hover:bg-primary-hover shadow-xs transition-colors cursor-pointer min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-surface-elevated border border-border text-foreground hover:bg-surface transition-colors cursor-pointer min-h-[36px] shadow-xs ${
            isSidebarOpen ? 'border-primary/40 bg-primary/10 text-primary' : ''
          }`}
          title="Toggle conversation history"
          aria-label="Toggle conversation history"
        >
          <History className="w-3.5 h-3.5 text-secondary-text" />
          <span className="hidden md:inline">History</span>
        </button>
      </div>
    </div>
  );
};
