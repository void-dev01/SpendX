import React, { useState } from 'react';
import { X, Clock, Trash2, Edit2, Check, Calendar } from 'lucide-react';
import { QueuedMessageRecord } from '@/services/aiAssistantService';

interface QueuedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  queuedMessages: QueuedMessageRecord[];
  onUpdateMessage: (id: string, newText: string) => Promise<void>;
  onCancelMessage: (id: string) => Promise<void>;
}

export const QueuedMessagesModal: React.FC<QueuedMessagesModalProps> = ({
  isOpen,
  onClose,
  queuedMessages,
  onUpdateMessage,
  onCancelMessage,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (msg: QueuedMessageRecord) => {
    setEditingId(msg.id);
    setEditText(msg.query);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdateMessage(id, editText.trim());
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-lg rounded-2xl p-5 sm:p-6 border border-border shadow-elevated space-y-4 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="queued-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 id="queued-modal-title" className="text-sm sm:text-base font-display font-bold text-foreground">
                Queued AI Inquiries
              </h3>
              <p className="text-[11px] text-secondary-text">
                Scheduled for automatic delivery when your daily 200-message quota resets at midnight.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {queuedMessages.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-surface-elevated text-muted-foreground flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-foreground">No queued messages</p>
            <p className="text-[11px] text-secondary-text max-w-xs mx-auto">
              When your 200 daily message limit is reached, inquiries you schedule for tomorrow will appear here.
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
            {queuedMessages.map((msg) => {
              const isEditing = editingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl bg-surface-elevated border border-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-secondary-text">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-amber-500" />
                      Scheduled for tomorrow (12:00 AM)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold uppercase tracking-wider text-[9px]">
                      Queued
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        className="w-full p-2 text-xs rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded-md text-[11px] text-secondary-text hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(msg.id)}
                          disabled={isSubmitting || !editText.trim()}
                          className="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground text-xs leading-relaxed font-medium">
                      {msg.query}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(msg)}
                        className="flex items-center gap-1 text-[11px] text-secondary-text hover:text-foreground p-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelMessage(msg.id)}
                        className="flex items-center gap-1 text-[11px] text-red-500 hover:text-white hover:bg-red-600 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 border-t border-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
