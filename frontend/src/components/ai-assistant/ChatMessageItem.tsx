import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  ArrowUpRight,
  Wallet,
  Target,
  PieChart,
} from 'lucide-react';
import { ChatMessage } from '@/services/aiAssistantService';
import { transactionService } from '@/services/transactionService';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onRetry,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown formatter for bold text, lists, and line breaks
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-[13px] break-words [overflow-wrap:anywhere]">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Check for bullet list
          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            const itemText = line.trim().replace(/^[-•]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>{parseBold(itemText)}</span>
              </div>
            );
          }

          // Check for headings
          if (line.trim().startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold font-display text-sm text-foreground pt-1">
                {line.replace('### ', '')}
              </h4>
            );
          }

          return <p key={idx}>{parseBold(line)}</p>;
        })}
      </div>
    );
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Render structured financial answer card
  const renderAnswerCard = () => {
    if (!message.card) return null;
    const { type, title, data } = message.card;

    switch (type) {
      case 'SPENDING':
        return (
          <div className="mt-3 p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Wallet className="w-3.5 h-3.5 text-primary" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Transactions</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-income/10">
                <span className="text-[10px] text-muted-foreground block">Income</span>
                <span className="font-bold text-income text-xs tabular-nums">
                  {transactionService.formatINR(data.income || 0)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10">
                <span className="text-[10px] text-muted-foreground block">Expenses</span>
                <span className="font-bold text-destructive text-xs tabular-nums">
                  {transactionService.formatINR(data.expenses || 0)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <span className="text-[10px] text-muted-foreground block">Net Flow</span>
                <span className="font-bold text-primary text-xs tabular-nums">
                  {transactionService.formatINR(data.net || 0)}
                </span>
              </div>
            </div>
          </div>
        );

      case 'BUDGET':
        return (
          <div className="mt-3 p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <PieChart className="w-3.5 h-3.5 text-amber-500" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/budgets')}
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Open Budgets</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
              <span className="tabular-nums">Spent: {transactionService.formatINR(data.spent || 0)}</span>
              <span className="font-bold text-primary tabular-nums">{data.utilization || 0}% used</span>
            </div>
          </div>
        );

      case 'SAVINGS':
        return (
          <div className="mt-3 p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Target className="w-3.5 h-3.5 text-income" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/savings')}
                className="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Savings Goal</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
              <span className="tabular-nums">Saved: {transactionService.formatINR(data.totalSaved || data.saved || 0)}</span>
              <span className="font-bold text-income tabular-nums">
                Target: {transactionService.formatINR(data.totalTarget || data.target || 0)}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-start gap-2.5 sm:gap-3.5 my-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all break-words [overflow-wrap:anywhere] min-w-0 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-xs shadow-xs'
            : message.isError
            ? 'bg-destructive/10 border border-destructive/20 text-destructive rounded-tl-xs'
            : 'bg-card dark:bg-[#1B211B] border border-border text-foreground rounded-tl-xs shadow-xs'
        }`}
      >
        {renderFormattedContent(message.content)}
        {!isUser && renderAnswerCard()}

        {/* Action Toolbar on Assistant Messages */}
        {!isUser && (
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border text-[10px] text-muted-foreground">
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Copy response"
                aria-label="Copy response"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-income" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {message.isError && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1 text-destructive hover:underline cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-surface-elevated border border-border text-foreground flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
