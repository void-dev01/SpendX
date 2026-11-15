import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ColumnMappingConfig } from '@/services/importService';

interface ImportColumnMapperProps {
  sampleHeaders: string[];
  sampleRow: string[];
  mapping: ColumnMappingConfig;
  onMappingChange: (newMapping: ColumnMappingConfig) => void;
}

export const ImportColumnMapper: React.FC<ImportColumnMapperProps> = ({
  sampleHeaders,
  sampleRow,
  mapping,
  onMappingChange,
}) => {
  const handleSelectCol = (field: keyof ColumnMappingConfig, colIdx: number) => {
    onMappingChange({
      ...mapping,
      [field]: colIdx === -1 ? undefined : colIdx,
    });
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-spendx-blue-primary" />
          <h4 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
            Map Statement Columns
          </h4>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={mapping.hasHeader}
            onChange={(e) => onMappingChange({ ...mapping, hasHeader: e.target.checked })}
            className="rounded border-slate-300 text-spendx-blue-primary focus:ring-spendx-blue-primary"
          />
          <span>First row contains headers</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* Date Column */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Transaction Date *
          </label>
          <select
            value={mapping.dateCol}
            onChange={(e) => handleSelectCol('dateCol', parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple font-medium"
          >
            {sampleHeaders.map((header, idx) => (
              <option key={`date-${idx}`} value={idx}>
                Col {idx + 1}: {header} ({sampleRow[idx] || 'empty'})
              </option>
            ))}
          </select>
        </div>

        {/* Description / Merchant Column */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description / Narration *
          </label>
          <select
            value={mapping.descCol}
            onChange={(e) => handleSelectCol('descCol', parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple font-medium"
          >
            {sampleHeaders.map((header, idx) => (
              <option key={`desc-${idx}`} value={idx}>
                Col {idx + 1}: {header} ({sampleRow[idx] || 'empty'})
              </option>
            ))}
          </select>
        </div>

        {/* Amount Column */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Transaction Amount (₹) *
          </label>
          <select
            value={mapping.amountCol}
            onChange={(e) => handleSelectCol('amountCol', parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple font-medium"
          >
            {sampleHeaders.map((header, idx) => (
              <option key={`amt-${idx}`} value={idx}>
                Col {idx + 1}: {header} ({sampleRow[idx] || 'empty'})
              </option>
            ))}
          </select>
        </div>

        {/* Optional Type Column */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Type / Cr/Dr (Optional)
          </label>
          <select
            value={mapping.typeCol !== undefined ? mapping.typeCol : -1}
            onChange={(e) => handleSelectCol('typeCol', parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple font-medium"
          >
            <option value={-1}>-- Not present (Auto-detect) --</option>
            {sampleHeaders.map((header, idx) => (
              <option key={`type-${idx}`} value={idx}>
                Col {idx + 1}: {header} ({sampleRow[idx] || 'empty'})
              </option>
            ))}
          </select>
        </div>

        {/* Optional Reference Number Column */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Reference / UTR / TxID (Optional)
          </label>
          <select
            value={mapping.refCol !== undefined ? mapping.refCol : -1}
            onChange={(e) => handleSelectCol('refCol', parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 text-spendx-text-primary dark:text-spendx-soft-purple font-medium"
          >
            <option value={-1}>-- None --</option>
            {sampleHeaders.map((header, idx) => (
              <option key={`ref-${idx}`} value={idx}>
                Col {idx + 1}: {header} ({sampleRow[idx] || 'empty'})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
