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
    <div className="bg-surface p-6 rounded-2xl border border-secondary/30 shadow-card relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-xl bg-secondary/15 text-secondary">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-display font-bold text-foreground">
          SPENDX AI Detection: Recurring Charges Found
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold">
          {detectedItems.length} Detected
        </span>
      </div>

      <p className="text-xs text-secondary-text mb-4 max-w-2xl">
        We analyzed your recent transactions and detected repeating charge patterns. Confirm them to automatically track renewal dates and monthly commitments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {detectedItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-surface-elevated border border-border flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground truncate">
                  {item.merchant}
                </span>
                <span className="text-[10px] text-secondary font-medium capitalize">
                  {item.suggestedFrequency.toLowerCase()}
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5 truncate">
                {item.reason}
              </p>
              <div className="mt-2 text-base font-display font-bold text-foreground tabular-nums">
                {recurringService.formatINR(item.estimatedAmount)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="px-2.5 py-1 text-xs text-secondary-text hover:text-foreground rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
              <button
                type="button"
                onClick={() => onConfirm(item)}
                className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
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
