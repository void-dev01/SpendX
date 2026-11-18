import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  X,
  Clock,
} from 'lucide-react';
import { ConversationRecord } from '@/services/aiAssistantService';

interface ConversationSidebarProps {
  conversations: ConversationRecord[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  isOpen,
  onClose,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group conversations by relative time
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const sevenDaysAgoStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  const groups: {
    today: ConversationRecord[];
    yesterday: ConversationRecord[];
    last7Days: ConversationRecord[];
    older: ConversationRecord[];
  } = {
    today: [],
    yesterday: [],
    last7Days: [],
    older: [],
  };

  conversations.forEach((conv) => {
    const time = new Date(conv.updatedAt || conv.createdAt).getTime();
    if (time >= todayStart) {
      groups.today.push(conv);
    } else if (time >= yesterdayStart) {
      groups.yesterday.push(conv);
    } else if (time >= sevenDaysAgoStart) {
      groups.last7Days.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  const renderGroup = (title: string, list: ConversationRecord[]) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
          {title}
        </span>
        {list.map((conv) => {
          const isActive = conv.id === activeId;
          return (
            <div
              key={conv.id}
              className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-spendx-blue-primary/10 text-spendx-blue-primary font-semibold border border-spendx-blue-primary/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5 border border-transparent'
              }`}
              onClick={() => {
                onSelect(conv.id);
                if (window.innerWidth < 768) onClose();
              }}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-spendx-blue-primary transition-colors" />
                <span className="truncate">{conv.title}</span>
              </div>

              {conversations.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 shrink-0"
                  title="Delete conversation"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className="fixed md:static inset-y-0 left-0 z-50 w-[min(288px,85vw)] md:w-64 glass-panel p-4 flex flex-col justify-between shrink-0 rounded-3xl border border-white/80 dark:border-white/10 shadow-xl md:shadow-none animate-in slide-in-from-left duration-200"
        aria-label="Conversation history"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100/60 dark:border-white/10">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-spendx-purple-primary" />
              <span>Conversation History</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-spendx-blue-primary to-spendx-purple-primary text-white shadow-xs hover:shadow transition-all cursor-pointer mb-4"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Conversation</span>
          </button>

          {/* Grouped Conversations */}
          <div className="space-y-4 max-h-[calc(100vh-220px)] md:max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
            {renderGroup('Today', groups.today)}
            {renderGroup('Yesterday', groups.yesterday)}
            {renderGroup('Previous 7 Days', groups.last7Days)}
            {renderGroup('Older', groups.older)}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100/60 dark:border-white/10 text-[10px] text-slate-400 text-center">
          Persisted locally & user-scoped
        </div>

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-xs glass-panel p-5 rounded-2xl shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Delete Conversation?
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                This chat will be permanently removed from your history.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-lg glass-surface border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(deletingId);
                    setDeletingId(null);
                  }}
                  className="px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-rose-600 text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
