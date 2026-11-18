import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { CustomReportOptions } from '@/services/reportsService';
import { AccountRecord } from '@/services/accountService';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountRecord[];
  onGenerateReport: (options: CustomReportOptions) => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onGenerateReport,
}) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  const [reportType, setReportType] = useState<CustomReportOptions['reportType']>('MONTHLY_STATEMENT');
  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(todayStr);
  const [accountId, setAccountId] = useState('');
  const [format, setFormat] = useState<CustomReportOptions['format']>('CSV');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: 'THIS_MONTH' | 'LAST_MONTH' | 'YTD') => {
    const d = new Date();
    if (preset === 'THIS_MONTH') {
      setStartDate(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]);
      setEndDate(d.toISOString().split('T')[0]);
    } else if (preset === 'LAST_MONTH') {
      const lastMStart = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString().split('T')[0];
      const lastMEnd = new Date(d.getFullYear(), d.getMonth(), 0).toISOString().split('T')[0];
      setStartDate(lastMStart);
      setEndDate(lastMEnd);
    } else if (preset === 'YTD') {
      setStartDate(new Date(d.getFullYear(), 0, 1).toISOString().split('T')[0]);
      setEndDate(d.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateReport({
      reportType,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59').toISOString(),
      accountId: accountId || undefined,
      format,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl p-5 sm:p-7 bg-surface border border-border shadow-elevated relative max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">
              Generate Financial Report
            </h2>
            <p className="text-xs text-secondary-text mt-0.5">
              Build custom statements, tax audit exports, or ledger downloads.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Report Type */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { type: 'MONTHLY_STATEMENT', label: 'Financial Statement' },
                { type: 'TAX_AUDIT', label: 'Tax Deductions' },
                { type: 'CATEGORY_DEEP_DIVE', label: 'Category Audit' },
                { type: 'NET_WORTH_STATEMENT', label: 'Balance Sheet' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setReportType(item.type as any)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all shadow-xs ${
                    reportType === item.type
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface-elevated border-border text-foreground hover:bg-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground">
                Period Range
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('THIS_MONTH')}
                  className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-primary hover:bg-surface transition-colors"
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('LAST_MONTH')}
                  className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-primary hover:bg-surface transition-colors"
                >
                  Last Month
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('YTD')}
                  className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-primary hover:bg-surface transition-colors"
                >
                  Year to Date
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-muted-foreground block mb-1">From</span>
                <input
                  type="date"
                  value={startDate}
                  aria-label="Start date"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block mb-1">To</span>
                <input
                  type="date"
                  value={endDate}
                  aria-label="End date"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Account Filter */}
          <div>
            <label htmlFor="rep-acc" className="block text-xs font-semibold text-foreground mb-1">
              Account Filter
            </label>
            <select
              id="rep-acc"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer shadow-xs"
            >
              <option value="">All Accounts Consolidated</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Export Output Format */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { format: 'CSV', label: 'CSV Ledger' },
                { format: 'PRINTABLE', label: 'Print / PDF' },
                { format: 'JSON', label: 'JSON Audit' },
              ].map((item) => (
                <button
                  key={item.format}
                  type="button"
                  onClick={() => setFormat(item.format as any)}
                  className={`py-2 rounded-xl border text-center font-semibold transition-all shadow-xs ${
                    format === item.format
                      ? 'bg-secondary text-secondary-foreground border-secondary'
                      : 'bg-surface-elevated border-border text-foreground hover:bg-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-secondary-text hover:text-foreground hover:bg-surface-elevated rounded-xl transition-colors text-center min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Generate & Export</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
