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
                <span className="w-1.5 h-1.5 rounded-full bg-spendx-blue-primary shrink-0 mt-1.5" />
                <span>{parseBold(itemText)}</span>
              </div>
            );
          }

          // Check for headings
          if (line.trim().startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-sm text-slate-800 dark:text-slate-100 pt-1">
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
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
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
          <div className="mt-3 p-3.5 rounded-2xl glass-surface border border-white/80 dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <Wallet className="w-3.5 h-3.5 text-spendx-blue-primary" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/transactions')}
                className="text-[11px] text-spendx-blue-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Transactions</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-[10px] text-slate-400 block">Income</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  {transactionService.formatINR(data.income || 0)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20">
                <span className="text-[10px] text-slate-400 block">Expenses</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                  {transactionService.formatINR(data.expenses || 0)}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-spendx-blue-primary/10">
                <span className="text-[10px] text-slate-400 block">Net Flow</span>
                <span className="font-bold text-spendx-blue-primary text-xs">
                  {transactionService.formatINR(data.net || 0)}
                </span>
              </div>
            </div>
          </div>
        );

      case 'BUDGET':
        return (
          <div className="mt-3 p-3.5 rounded-2xl glass-surface border border-white/80 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <PieChart className="w-3.5 h-3.5 text-amber-500" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/budgets')}
                className="text-[11px] text-spendx-blue-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Open Budgets</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
              <span>Spent: {transactionService.formatINR(data.spent || 0)}</span>
              <span className="font-bold text-spendx-blue-primary">{data.utilization || 0}% used</span>
            </div>
          </div>
        );

      case 'SAVINGS':
        return (
          <div className="mt-3 p-3.5 rounded-2xl glass-surface border border-white/80 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                {title}
              </span>
              <button
                type="button"
                onClick={() => navigate('/savings')}
                className="text-[11px] text-spendx-blue-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Savings Goal</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
              <span>Saved: {transactionService.formatINR(data.totalSaved || data.saved || 0)}</span>
              <span className="font-bold text-emerald-600">
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
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-spendx-ai-accent to-spendx-purple-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[90%] xs:max-w-[85%] sm:max-w-[75%] rounded-3xl p-3.5 sm:p-5 shadow-xs transition-all break-words [overflow-wrap:anywhere] min-w-0 ${
          isUser
            ? 'bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white rounded-tr-xs'
            : message.isError
            ? 'bg-rose-50/80 dark:bg-rose-950/20 border border-rose-500/30 text-rose-800 dark:text-rose-200 rounded-tl-xs'
            : 'glass-panel border border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-tl-xs'
        }`}
      >
        {renderFormattedContent(message.content)}
        {!isUser && renderAnswerCard()}

        {/* Action Toolbar on Assistant Messages */}
        {!isUser && (
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100/60 dark:border-white/10 text-[10px] text-slate-400">
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
                className="p-1 rounded-md hover:bg-white/40 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Copy response"
                aria-label="Copy response"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {message.isError && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center gap-1 text-rose-600 hover:underline cursor-pointer font-medium"
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
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
