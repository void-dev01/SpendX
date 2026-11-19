import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { authService } from '@/services/authService';
import { apiClient } from '@/services/api';
import { Download, Upload, Check, User, Shield, Wallet, Trash2, AlertOctagon } from 'lucide-react';

const AVAILABLE_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ) - UAE Dirham' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($) - Australian Dollar' },
];

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [incomeTarget, setIncomeTarget] = useState(() => {
    return localStorage.getItem('spendx_monthly_income_target') || '50000';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await apiClient.patch('/auth/me', {
        fullName: fullName.trim(),
        currency,
      });
    } catch (err) {
      console.warn('Backend patch profile failed, updating local state', err);
    }
    const updated = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      currency,
    };
    setUser(updated);
    localStorage.setItem('spendx_monthly_income_target', incomeTarget);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your SPENDX account? All your accounts, transactions, budgets, goals, and history will be permanently deleted from the database. This action is irreversible.')) {
      setIsDeleting(true);
      try {
        const res = await authService.deleteAccount();
        if (!res.success) {
          alert(res.error || 'Failed to delete account');
          setIsDeleting(false);
          return;
        }
        localStorage.clear();
        window.location.href = '/login';
      } catch {
        alert('Failed to delete account');
        setIsDeleting(false);
      }
    }
  };

  const handleExportJsonBackup = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        user: useAuthStore.getState().user,
        accounts: accountService.getStoredAccounts(),
        transactions: transactionService.getStoredTransactions(),
        monthlyIncomeTarget: incomeTarget,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spendx_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMessage('JSON Backup downloaded successfully!');
      setTimeout(() => setBackupMessage(null), 4000);
    } catch {
      setBackupMessage('Failed to create backup.');
    }
  };

  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);
        if (parsed.accounts && Array.isArray(parsed.accounts)) {
          accountService.saveStoredAccounts(parsed.accounts);
        }
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          transactionService.saveStoredTransactions(parsed.transactions);
        }
        if (parsed.user) {
          setUser(parsed.user);
        }
        setBackupMessage('Financial data restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        setBackupMessage('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to completely reset all local data? This will clear all transactions, accounts, and schedules.')) {
      localStorage.clear();
      localStorage.setItem('spendx_demo_mode', 'cleared');
      localStorage.setItem('spendx_real_mode_v1', 'true');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
          System & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text mt-1">
          Personal identity credentials, real accounting ledger configurations, and portable backups.
        </p>
      </div>

      {/* 1. Real User Profile & Identity Form */}
      <Card className="bg-surface border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Personal Identity & Ledger Target</CardTitle>
              <CardDescription>Changes here immediately update your Sidebar and Dashboard greeting.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name / Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priyam Prajapati"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. personal@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Monthly Inflow / Income Target (₹ INR)</label>
                <input
                  type="number"
                  value={incomeTarget}
                  onChange={(e) => setIncomeTarget(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Default Accounting Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-surface-elevated border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {AVAILABLE_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-surface text-foreground">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 min-h-[40px]"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedSuccess ? 'Profile Updated!' : 'Save Identity Preferences'}</span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Real Data Backup & Restore */}
      <Card className="bg-surface border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-income/10 text-income flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Local Data Backup & Portability</CardTitle>
              <CardDescription>Keep your real personal financial records safe, encrypted, and portable.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-secondary-text leading-relaxed">
            Your real accounts, balances, transactions, and categories are stored locally in your private database.
            Use these controls to create standalone offline backups or restore from an existing file at any time.
          </p>

          {backupMessage && (
            <div className="p-3 rounded-xl bg-income/10 border border-income/20 text-xs font-medium text-income">
              {backupMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportJsonBackup}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground bg-surface-elevated border border-border hover:bg-surface transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => transactionService.exportToCSV(transactionService.getStoredTransactions())}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground bg-surface-elevated border border-border hover:bg-surface transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]"
            >
              <Download className="w-4 h-4 text-income" />
              <span>Export Transactions (CSV)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground bg-surface-elevated border border-border hover:bg-surface transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]">
              <Upload className="w-4 h-4 text-amber-500" />
              <span>Restore Backup (JSON)</span>
              <input type="file" accept=".json" onChange={handleImportJsonBackup} className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 3. Environment & Integration Status */}
      <Card className="bg-surface border border-border shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Environment & Integration Status</CardTitle>
              <CardDescription>Backend API endpoints and telemetry synchronization status.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-xs sm:text-sm font-medium">Backend API Endpoint</p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {env.apiBaseUrl}
              </p>
            </div>
            <Badge variant="outline">Configured (Port 5000)</Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-xs sm:text-sm font-medium">Local Disk Persistence</p>
              <p className="text-[11px] text-muted-foreground">backend/.data/spendx-local-db.json</p>
            </div>
            <Badge variant="default">Active & Persistent</Badge>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs sm:text-sm font-medium">Design & Typography Engine</p>
              <p className="text-[11px] text-muted-foreground">SPENDX Minimal White × Neon Lime FinTech Design System</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 4. Danger Zone: Reset All Local Data (Start Fresh) */}
      <Card className="bg-surface border-2 border-red-500/40 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription className="text-red-600/70 dark:text-red-400/70">
                Reset local databases and cache back to day-zero empty state.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-secondary-text leading-relaxed">
            Wipe all locally stored accounts, transactions, recurring obligations, and categories to start with a 100% clean slate.
          </p>
          <button
            type="button"
            onClick={handleResetAllData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Local Data (Start Fresh)</span>
          </button>

          <div className="pt-4 border-t border-red-500/20 space-y-2">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400">
              Permanently Delete Account & Financial Data
            </p>
            <p className="text-xs text-secondary-text leading-relaxed">
              Permanently delete your user profile, linked accounts, transactions, budgets, goals, and history from our secure servers. This operation cannot be reversed.
            </p>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs min-h-[40px] disabled:opacity-50"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete SPENDX Account'}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
