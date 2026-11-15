import React from 'react';
import { FileSpreadsheet, FileText, MessageSquareCode, FileCode } from 'lucide-react';
import { ImportSourceType } from '@/services/importService';

interface ImportSourceSelectorProps {
  selectedSource: ImportSourceType;
  onSelectSource: (source: ImportSourceType) => void;
}

export const ImportSourceSelector: React.FC<ImportSourceSelectorProps> = ({
  selectedSource,
  onSelectSource,
}) => {
  const sources: {
    id: ImportSourceType;
    title: string;
    description: string;
    icon: React.ElementType;
    badge: string;
  }[] = [
    {
      id: 'CSV',
      title: 'CSV Statement',
      description: 'Standard bank, wallet & UPI transaction exports (.csv)',
      icon: FileSpreadsheet,
      badge: 'Popular',
    },
    {
      id: 'EXCEL',
      title: 'Excel Workbook',
      description: 'Spreadsheets (.xlsx, .xls) with multi-column financial ledgers',
      icon: FileCode,
      badge: 'Supported',
    },
    {
      id: 'PDF_TEXT',
      title: 'PDF Bank Statement',
      description: 'Structured text extracts from major Indian & global banks',
      icon: FileText,
      badge: 'Automatic',
    },
    {
      id: 'SMS_TEXT',
      title: 'Bank SMS Text',
      description: 'Paste transaction alert SMS from HDFC, SBI, ICICI, Axis, UPI',
      icon: MessageSquareCode,
      badge: 'Zero-File',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {sources.map((src) => {
        const Icon = src.icon;
        const isSelected = selectedSource === src.id;

        return (
          <button
            key={src.id}
            type="button"
            onClick={() => onSelectSource(src.id)}
            className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between group ${
              isSelected
                ? 'bg-spendx-blue-primary/10 border-spendx-blue-primary shadow-sm ring-2 ring-spendx-blue-primary/20'
                : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/80 dark:border-white/10 hover:border-spendx-blue-primary/40'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-spendx-blue-primary text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 group-hover:text-spendx-blue-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-spendx-blue-primary text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                }`}
              >
                {src.badge}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
                {src.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {src.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
