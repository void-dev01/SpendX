import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  History,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  importService,
  ImportSourceType,
  NormalizedImportTransaction,
  RawParsedTransaction,
  ColumnMappingConfig,
} from '@/services/importService';
import { AccountRecord } from '@/services/accountService';
import { TransactionRecord, EXPENSE_CATEGORIES } from '@/services/transactionService';

import { ImportSourceSelector } from './ImportSourceSelector';
import { ImportColumnMapper } from './ImportColumnMapper';
import { ImportPreviewTable } from './ImportPreviewTable';
import { ImportHistoryModal } from './ImportHistoryModal';

interface UniversalImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountRecord[];
  existingTransactions: TransactionRecord[];
  onImportComplete: () => void;
}

const SAMPLE_BANKING_SMS = `Dear SBI User, your A/c ending 8114 debited by Rs.1,250.00 on 14-Nov-26 by UPI/Swiggy/ref 432190. Bal: Rs.26,680.00

Dear HDFC Bank Customer, Rs.450.00 has been debited from account **4092 on 13-Nov-26 to UBER INDIA. Ref 901238.

Salary credited: Rs.85,000.00 to HDFC Bank A/c ending 4092 on 01-Nov-26 by EMPLOYER PAYROLL. Ref CMS890123.`;

export const UniversalImportDialog: React.FC<UniversalImportDialogProps> = ({
  isOpen,
  onClose,
  accounts,
  existingTransactions,
  onImportComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [source, setSource] = useState<ImportSourceType>('CSV');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [smsInputText, setSmsInputText] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // CSV parsing state
  const [rawCSVRows, setRawCSVRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMappingConfig>({
    dateCol: 0,
    descCol: 1,
    amountCol: 2,
    hasHeader: true,
  });

  // Normalized preview transactions
  const [normalizedTransactions, setNormalizedTransactions] = useState<
    NormalizedImportTransaction[]
  >([]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  if (!isOpen) return null;

  const targetAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Auto-read CSV
      if (source === 'CSV' || selectedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const rows = importService.parseCSVText(text);
          setRawCSVRows(rows);
          if (rows.length > 0) {
            const detected = importService.detectColumnMapping(rows[0]);
            setColumnMapping(detected);
          }
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleLoadSampleSMS = () => {
    setSmsInputText(SAMPLE_BANKING_SMS);
  };

  // Move from Step 1 to Step 2/3
  const handleProceedFromStep1 = async () => {
    if (!targetAccount) {
      toast.error('Please select a destination account');
      return;
    }

    if (source === 'SMS_TEXT') {
      if (!smsInputText.trim()) {
        toast.error('Please paste at least one banking SMS message');
        return;
      }

      setIsProcessing(true);
      try {
        const rawSMS = importService.parseSMSText(smsInputText);
        if (rawSMS.length === 0) {
          toast.error('No financial transactions could be parsed from the SMS text.');
          return;
        }

        const normalized = await importService.normalizeTransactions(
          rawSMS,
          targetAccount,
          existingTransactions
        );
        setNormalizedTransactions(normalized);
        setStep(3); // Jump directly to preview for SMS
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (source === 'PDF_TEXT') {
      // PDF statement text parser
      if (!smsInputText.trim() && !file) {
        toast.error('Please paste PDF text or upload a statement text file');
        return;
      }

      setIsProcessing(true);
      try {
        let textToParse = smsInputText.trim();
        if (file && (file.name.endsWith('.pdf') || file.type === 'application/pdf')) {
          const buffer = await file.arrayBuffer();
          const extracted = await importService.extractTextFromPDF(buffer);
          if (extracted.trim()) {
            textToParse = extracted;
          }
        } else if (!textToParse && rawCSVRows.length > 0) {
          textToParse = rawCSVRows.map((r) => r.join(' ')).join('\n');
        }

        const rawPDF = importService.parseBankStatementText(textToParse);
        if (rawPDF.length === 0) {
          toast.error('No statement lines matched standard bank table formats.');
          return;
        }
        const normalized = await importService.normalizeTransactions(
          rawPDF,
          targetAccount,
          existingTransactions
        );
        setNormalizedTransactions(normalized);
        setStep(3);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // CSV or Excel
    if (rawCSVRows.length === 0) {
      toast.error('Please select a valid statement file');
      return;
    }

    setStep(2); // Go to Column Mapping
  };

  // Move from Step 2 to Step 3 (Column mapping to preview)
  const handleProceedFromStep2 = async () => {
    if (!targetAccount) return;

    setIsProcessing(true);
    try {
      const startRow = columnMapping.hasHeader ? 1 : 0;
      const dataRows = rawCSVRows.slice(startRow);

      const rawItems: RawParsedTransaction[] = dataRows.map((row, idx) => ({
        id: `csv_${idx}_${Date.now()}`,
        rawDate: row[columnMapping.dateCol] || '',
        rawDescription: row[columnMapping.descCol] || '',
        rawAmount: row[columnMapping.amountCol] || '',
        rawType: columnMapping.typeCol !== undefined ? row[columnMapping.typeCol] : undefined,
        rawCategory: columnMapping.categoryCol !== undefined ? row[columnMapping.categoryCol] : undefined,
        rawReference: columnMapping.refCol !== undefined ? row[columnMapping.refCol] : undefined,
      }));

      const normalized = await importService.normalizeTransactions(
        rawItems,
        targetAccount,
        existingTransactions
      );
      setNormalizedTransactions(normalized);
      setStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  // Final Step 3: Commit import
  const handleConfirmImport = async () => {
    if (!targetAccount) return;

    const selectedToImport = normalizedTransactions.filter((t) => t.isSelected);
    if (selectedToImport.length === 0) {
      toast.error('No valid transactions selected for import');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await importService.commitImportBatch(
        normalizedTransactions,
        source,
        file?.name,
        targetAccount
      );

      toast.success(
        `Successfully imported ${result.successCount} transaction${
          result.successCount === 1 ? '' : 's'
        } into ${targetAccount.name}!`
      );
      onImportComplete();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to complete import');
    } finally {
      setIsProcessing(false);
    }
  };

  // Preview table interactive updates
  const handleToggleSelect = (id: string) => {
    setNormalizedTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isSelected: !t.isSelected } : t))
    );
  };

  const handleToggleSelectAll = (select: boolean) => {
    setNormalizedTransactions((prev) =>
      prev.map((t) => ({
        ...t,
        isSelected: select && t.validationErrors.length === 0,
      }))
    );
  };

  const handleChangeCategory = (id: string, category: string) => {
    setNormalizedTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, category } : t))
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 animate-fadeIn">
        <div className="bg-surface w-full max-w-4xl rounded-2xl p-4 sm:p-8 shadow-elevated border border-border relative max-h-[92dvh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Step {step} of 3
                </span>
                <span className="text-xs text-secondary-text">
                  {step === 1
                    ? 'Select Source & Destination'
                    : step === 2
                    ? 'Verify Column Mapping'
                    : 'Preview & Reconcile'}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-foreground mt-1">
                Automatic Financial Data Capture
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-elevated border border-border text-foreground hover:bg-surface-elevated/80 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>Audit History</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="mt-5 flex-1 overflow-y-auto space-y-6">
            {/* STEP 1: Select Source, File, Account */}
            {step === 1 && (
              <div className="space-y-5">
                {/* 1. Source Selector */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">
                    1. Choose Ingestion Source
                  </label>
                  <ImportSourceSelector selectedSource={source} onSelectSource={setSource} />
                </div>

                {/* 2. Destination Account */}
                <div>
                  <label htmlFor="import-dest-acc" className="block text-xs font-medium text-foreground mb-1.5">
                    2. Reconcile Into Account *
                  </label>
                  <select
                    id="import-dest-acc"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-elevated border border-border text-xs text-foreground font-medium cursor-pointer shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type}) — Current Balance: ₹{acc.balance.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Input Zone: File Upload or SMS Text */}
                {source === 'SMS_TEXT' ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-foreground">
                        3. Paste Banking SMS Alerts
                      </label>
                      <button
                        type="button"
                        onClick={handleLoadSampleSMS}
                        className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Load Sample SMS</span>
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={smsInputText}
                      onChange={(e) => setSmsInputText(e.target.value)}
                      placeholder="Paste your bank or UPI transaction SMS notifications here..."
                      className="w-full p-3 text-xs rounded-xl bg-surface-elevated border border-border text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      3. Upload Statement File ({source === 'CSV' ? '.csv' : source === 'EXCEL' ? '.xlsx, .xls, .csv' : '.pdf, .txt'})
                    </label>
                    <label className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors bg-surface-elevated group">
                      <input
                        type="file"
                        accept={source === 'CSV' ? '.csv' : source === 'EXCEL' ? '.csv,.xlsx,.xls' : '.pdf,.txt,.csv'}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="mt-3 text-xs font-semibold text-foreground">
                        {file ? file.name : 'Click to select or drag and drop statement file'}
                      </p>
                      <p className="text-[11px] text-secondary-text mt-1">
                        Encrypted in transit • No permanent unverified storage
                      </p>
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Column Mapping (CSV & Excel) */}
            {step === 2 && (
              <div className="space-y-4">
                <ImportColumnMapper
                  sampleHeaders={rawCSVRows[0] || []}
                  sampleRow={rawCSVRows[1] || []}
                  mapping={columnMapping}
                  onMappingChange={setColumnMapping}
                />
              </div>
            )}

            {/* STEP 3: Preview & Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <ImportPreviewTable
                  transactions={normalizedTransactions}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  onChangeCategory={handleChangeCategory}
                  categories={EXPENSE_CATEGORIES}
                />
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-border shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev === 3 && source === 'SMS_TEXT' ? 1 : ((prev - 1) as any)))}
                className="w-full sm:w-auto justify-center px-4 py-2.5 text-xs font-medium text-foreground hover:bg-surface-elevated border border-border rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto justify-center px-4 py-2.5 text-xs font-medium text-foreground hover:bg-surface-elevated border border-border rounded-xl transition-colors min-h-[44px] cursor-pointer shadow-xs"
              >
                Cancel
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleProceedFromStep1}
                disabled={isProcessing}
                className="w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-1.5 disabled:opacity-50 min-h-[44px] cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleProceedFromStep2}
                disabled={isProcessing}
                className="w-full sm:w-auto justify-center px-5 py-2.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-1.5 disabled:opacity-50 min-h-[44px] cursor-pointer shadow-xs"
              >
                <span>Preview Transactions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isProcessing || normalizedTransactions.filter((t) => t.isSelected).length === 0}
                className="w-full sm:w-auto justify-center px-6 py-2.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-1.5 disabled:opacity-50 min-h-[44px] cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Confirm & Import ({normalizedTransactions.filter((t) => t.isSelected).length} Records)
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Import History Modal */}
      <ImportHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </>
  );
};
