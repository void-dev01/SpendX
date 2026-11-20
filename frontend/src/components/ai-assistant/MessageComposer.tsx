import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Clock } from 'lucide-react';

interface MessageComposerProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  isLimitReached?: boolean;
  onQueueMessage?: (message: string) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  isLoading,
  disabled = false,
  isLimitReached = false,
  onQueueMessage,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading || disabled) return;

    if (isLimitReached) {
      if (onQueueMessage) {
        onQueueMessage(text.trim());
        setText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
      return;
    }

    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      {isLimitReached && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Daily 200 message quota reached. Resets at midnight UTC.</span>
          </div>
          <span className="font-semibold text-[11px] underline cursor-default">
            Queue for Tomorrow Active
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-2 sm:p-2.5 rounded-xl bg-surface-elevated border border-border shadow-xs relative flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={
            isLimitReached
              ? 'Type your inquiry to schedule/queue for tomorrow...'
              : 'Ask about your spending, budgets, savings goals...'
          }
          className="flex-1 max-h-36 resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Message input"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading || disabled}
          className={`h-9 sm:h-10 rounded-xl font-bold flex items-center justify-center shrink-0 shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isLimitReached
              ? 'px-3.5 bg-amber-500 text-black hover:bg-amber-400 gap-1.5 text-xs'
              : 'w-9 sm:w-10 bg-primary text-[#111711] hover:bg-primary-hover'
          }`}
          aria-label={isLimitReached ? 'Queue for tomorrow' : 'Send message'}
          title={isLimitReached ? 'Schedule for tomorrow' : 'Send message'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLimitReached ? (
            <>
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">Queue for Tomorrow</span>
            </>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
