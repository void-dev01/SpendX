import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { RoutePlaceholder } from '@/components/common/RoutePlaceholder';
import { Button } from '@/components/ui/button';

const monthlyStatements = [
  { month: 'October 2026', generated: 'Nov 01, 2026', size: '1.4 MB', transactionsCount: 68 },
  { month: 'September 2026', generated: 'Oct 01, 2026', size: '1.2 MB', transactionsCount: 74 },
  { month: 'August 2026', generated: 'Sep 01, 2026', size: '1.1 MB', transactionsCount: 59 },
  { month: 'July 2026', generated: 'Aug 01, 2026', size: '1.3 MB', transactionsCount: 81 },
];

export const ReportsPage: React.FC = () => {
  return (
    <RoutePlaceholder
      title="Monthly Financial Reports"
      description="Generated fiscal summaries, tax ledger exports, and periodic net worth telemetry."
      routeId="/reports"
      icon={FileText}
      badge="Reporting"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-white/80 dark:border-white/15">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Custom Date Range Audit Export</h3>
            <p className="text-xs text-muted-foreground">
              Generate PDF statement or raw CSV transaction ledger for your tax records.
            </p>
          </div>
          <Button size="sm" className="rounded-xl shadow-sm self-start sm:self-auto cursor-pointer">
            <Download className="w-4 h-4 mr-1.5" /> Export Ledger (CSV)
          </Button>
        </div>

        {/* Statements Feed */}
        <div className="glass-panel rounded-3xl p-5 border border-white/80 dark:border-white/15 shadow-xl space-y-3">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block pb-2 border-b border-black/5 dark:border-white/10">
            Archived Monthly Statements
          </span>

          <div className="space-y-2.5">
            {monthlyStatements.map((doc) => (
              <div
                key={doc.month}
                className="rounded-2xl bg-white/40 dark:bg-white/5 p-4 border border-white/60 dark:border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{doc.month} Statement</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Generated {doc.generated} • {doc.transactionsCount} records ({doc.size})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoutePlaceholder>
  );
};
