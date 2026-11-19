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
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
              isSelected
                ? 'bg-primary/10 border-primary ring-1 ring-primary/30 shadow-xs'
                : 'bg-surface-elevated border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-primary text-[#111711] shadow-xs'
                    : 'bg-surface border border-border text-secondary-text group-hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-primary text-[#111711]'
                    : 'bg-surface border border-border text-secondary-text'
                }`}
              >
                {src.badge}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {src.title}
              </h4>
              <p className="text-[11px] text-secondary-text mt-1 line-clamp-2">
                {src.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
