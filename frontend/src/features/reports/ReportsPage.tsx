import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import {
  reportsService,
  MonthlyStatementRecord,
  CustomReportOptions,
  GeneratedFinancialReport,
} from '@/services/reportsService';
import { accountService } from '@/services/accountService';

import { ReportsOverviewCards } from '@/components/reports/ReportsOverviewCards';
import { ArchivedStatementsTable } from '@/components/reports/ArchivedStatementsTable';
import { TaxSummarySection } from '@/components/reports/TaxSummarySection';
import { ReportGeneratorModal } from '@/components/reports/ReportGeneratorModal';
import { PrintableStatementModal } from '@/components/reports/PrintableStatementModal';

export const ReportsPage: React.FC = () => {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPrintableOpen, setIsPrintableOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<GeneratedFinancialReport | null>(null);

  // 1. Fetch overview metrics
  const { data: metrics } = useQuery({
    queryKey: ['reports-overview-metrics'],
    queryFn: () => reportsService.getOverviewMetrics(),
  });

  // 2. Fetch monthly statements
  const { data: statements = [] } = useQuery({
    queryKey: ['archived-monthly-statements'],
    queryFn: () => reportsService.getArchivedStatements(),
  });

  // 3. Fetch tax deductible summary
  const { data: taxSummary } = useQuery({
    queryKey: ['tax-deductible-summary'],
    queryFn: () => reportsService.getTaxDeductibleSummary(),
  });

  // 4. Fetch accounts
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAccounts(),
  });

  // Handlers
  const handleGenerateCustomReport = async (options: CustomReportOptions) => {
    const report = await reportsService.generateReport(options);

    if (options.format === 'CSV') {
      reportsService.exportToCSV(report);
    } else if (options.format === 'JSON') {
      reportsService.exportToJSON(report);
    } else {
      setActiveReport(report);
      setIsPrintableOpen(true);
    }
  };

  const handleDownloadCSV = async (statement: MonthlyStatementRecord) => {
    const report = await reportsService.generateReport({
      reportType: 'MONTHLY_STATEMENT',
      startDate: statement.startDate,
      endDate: statement.endDate,
      format: 'CSV',
    });
    reportsService.exportToCSV(report);
  };

  const handlePreviewStatement = async (statement: MonthlyStatementRecord) => {
    const report = await reportsService.generateReport({
      reportType: 'MONTHLY_STATEMENT',
      startDate: statement.startDate,
      endDate: statement.endDate,
      format: 'PRINTABLE',
    });
    setActiveReport(report);
    setIsPrintableOpen(true);
  };

  const handleExportTaxReport = async () => {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString();

    const report = await reportsService.generateReport({
      reportType: 'TAX_AUDIT',
      startDate: yearStart,
      endDate: yearEnd,
      format: 'CSV',
    });
    reportsService.exportToCSV(report);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-spendx-blue-primary bg-spendx-blue-primary/10 px-2.5 py-1 rounded-lg">
              Reporting & Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-spendx-text-primary dark:text-spendx-soft-purple tracking-tight mt-1">
            Financial Reports & Statements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Generated monthly fiscal statements, tax audit schedules, and RFC 4180 verified financial ledger exports.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGeneratorOpen(true)}
          className="btn-spendx-primary flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-2xl shadow-lg shadow-spendx-blue-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Custom Report</span>
        </button>
      </div>

      {/* 2. Overview Metrics Cards */}
      {metrics && <ReportsOverviewCards metrics={metrics} />}

      {/* 3. Tax Optimization & Deduction Section */}
      {taxSummary && (
        <TaxSummarySection
          taxSummary={taxSummary}
          onExportTaxReport={handleExportTaxReport}
        />
      )}

      {/* 4. Archived Monthly Statements Table */}
      <ArchivedStatementsTable
        statements={statements}
        onDownloadCSV={handleDownloadCSV}
        onPreviewStatement={handlePreviewStatement}
      />

      {/* 5. Custom Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        accounts={accounts}
        onGenerateReport={handleGenerateCustomReport}
      />

      {/* 6. Printable Financial Statement Preview Modal */}
      <PrintableStatementModal
        isOpen={isPrintableOpen}
        onClose={() => setIsPrintableOpen(false)}
        report={activeReport}
      />
    </div>
  );
};
