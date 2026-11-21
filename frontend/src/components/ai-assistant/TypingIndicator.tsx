import React from 'react';
import { Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div data-testid="typing-indicator" aria-label="AI is typing" className="flex items-start gap-2.5 sm:gap-3.5 my-3 animate-in fade-in duration-200">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>

      <div className="bg-surface px-4 py-3 rounded-2xl rounded-tl-xs border border-border shadow-card flex items-center gap-2 text-xs text-secondary-text">
        <span className="font-medium text-foreground">
          SPENDX AI is thinking
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  );
};
