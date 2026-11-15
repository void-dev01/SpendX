import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3.5 my-3 animate-in fade-in duration-200">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-spendx-ai-accent to-spendx-purple-primary text-white flex items-center justify-center shrink-0 shadow-xs">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>

      <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-xs border border-white/80 dark:border-white/10 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          SPENDX AI is thinking
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-spendx-ai-accent animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-spendx-purple-primary animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-spendx-blue-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
};
