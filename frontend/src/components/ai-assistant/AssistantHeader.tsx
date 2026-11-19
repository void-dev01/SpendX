import React from 'react';
import { Plus, History, Bot } from 'lucide-react';

interface AssistantHeaderProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({
  onNewChat,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div className="rounded-2xl bg-surface border border-border p-4 flex items-center justify-between gap-3 shadow-card">
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
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
