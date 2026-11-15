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
    <div className="glass-panel p-4 rounded-3xl flex items-center justify-between gap-3">
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-spendx-ai-accent/20 to-spendx-purple-primary/20 text-spendx-ai-accent flex items-center justify-center shrink-0 shadow-inner">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              Your AI Financial Assistant
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-spendx-ai-accent/10 text-spendx-ai-accent border border-spendx-ai-accent/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 2.5 Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            Your money questions, answered intelligently.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-xs hover:shadow hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl glass-surface border border-white/80 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer ${
            isSidebarOpen ? 'bg-spendx-blue-primary/10 border-spendx-blue-primary/30' : ''
          }`}
          title="Toggle conversation history"
          aria-label="Toggle conversation history"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden md:inline">History</span>
        </button>
      </div>
    </div>
  );
};
