import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { DetectedRecurringItem, recurringService } from '@/services/recurringService';

interface RecurringDetectionCardProps {
  detectedItems: DetectedRecurringItem[];
  onConfirm: (item: DetectedRecurringItem) => void;
  onDismiss: (id: string) => void;
}

export const RecurringDetectionCard: React.FC<RecurringDetectionCardProps> = ({
  detectedItems,
  onConfirm,
  onDismiss,
}) => {
  if (detectedItems.length === 0) return null;

  return (
    <div className="glass-card p-6 rounded-3xl border border-spendx-purple-primary/30 bg-gradient-to-r from-spendx-soft-lavender/30 via-spendx-pale-purple/20 to-white/40 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-slate-900/40 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-xl bg-spendx-purple-primary/20 text-spendx-purple-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
          SPENDX AI Detection: Recurring Charges Found
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-spendx-purple-primary/20 text-spendx-purple-primary font-semibold">
          {detectedItems.length} Detected
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 max-w-2xl">
        We analyzed your recent transactions and detected repeating charge patterns. Confirm them to automatically track renewal dates and monthly commitments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {detectedItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-spendx-text-primary dark:text-spendx-soft-purple truncate">
                  {item.merchant}
                </span>
                <span className="text-[10px] text-spendx-purple-primary font-medium capitalize">
                  {item.suggestedFrequency.toLowerCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.reason}
              </p>
              <div className="mt-2 text-base font-bold text-spendx-indigo dark:text-spendx-soft-purple">
                {recurringService.formatINR(item.estimatedAmount)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
              <button
                type="button"
                onClick={() => onConfirm(item)}
                className="px-3 py-1 text-xs font-semibold bg-spendx-purple-primary text-white rounded-lg hover:bg-spendx-purple-primary/90 transition-all shadow-sm flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
