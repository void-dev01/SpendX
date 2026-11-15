import React from 'react';
import { X, History, FileCheck, Calendar } from 'lucide-react';
import { importService } from '@/services/importService';

interface ImportHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportHistoryModal: React.FC<ImportHistoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const history = importService.getImportHistory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-white/10 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
                Financial Ingestion History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit trail of historical statement and SMS batch imports
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
                No past imports recorded
              </p>
              <p className="text-xs text-slate-400">
                When you import bank CSVs, Excel files, or SMS transactions, audit logs appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              {history.map((batch) => (
                <div key={batch.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-spendx-text-primary dark:text-spendx-soft-purple text-sm">
                        {batch.fileName || 'Batch Import'}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-spendx-blue-primary/10 text-spendx-blue-primary">
                        {batch.source}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(batch.importDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {batch.importedCount} / {batch.totalParsed} imported
                    </p>
                    {batch.duplicateCount > 0 && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        {batch.duplicateCount} duplicates skipped
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
