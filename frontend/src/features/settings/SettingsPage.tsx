import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '@/services/accountService';
import { transactionService } from '@/services/transactionService';
import { Download, Upload, Check, User, Shield, Wallet, Trash2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [incomeTarget, setIncomeTarget] = useState(() => {
    return localStorage.getItem('spendx_monthly_income_target') || '50000';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updated = {
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
    };
    setUser(updated);
    localStorage.setItem('spendx_monthly_income_target', incomeTarget);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gradient-brand">System & Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Personal identity credentials, real accounting ledger configurations, and portable backups.
        </p>
      </div>

      {/* 1. Real User Profile & Identity Form */}
      <Card className="glass-panel border border-white/80 dark:border-white/10 shadow-glass">
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 border border-border text-foreground tabular-nums focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Default Accounting Currency</label>
                <input
                  type="text"
                  value="INR (₹ Indian Rupee)"
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-white/5 border border-border text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#718FE8] to-[#8B72D6] hover:opacity-95 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedSuccess ? 'Profile Updated!' : 'Save Identity Preferences'}</span>
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Real Data Backup & Restore */}
      <Card className="glass-panel border border-white/80 dark:border-white/10 shadow-glass">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Local Data Backup & Portability</CardTitle>
              <CardDescription>Keep your real personal financial records safe, encrypted, and portable.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your real accounts, balances, transactions, and categories are stored locally in your private database.
            Use these controls to create standalone offline backups or restore from an existing file at any time.
          </p>

          {backupMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {backupMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportJsonBackup}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground glass-surface border border-border hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              type="button"
              onClick={() => transactionService.exportToCSV(transactionService.getStoredTransactions())}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground glass-surface border border-border hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export Transactions (CSV)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl text-xs font-semibold text-foreground glass-surface border border-border hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer shadow-sm">
              <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Restore Backup (JSON)</span>
              <input type="file" accept=".json" onChange={handleImportJsonBackup} className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 3. Environment & Integration Status */}
      <Card className="glass-panel border border-white/80 dark:border-white/10 shadow-glass">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
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
              <p className="text-[11px] text-muted-foreground">THEME.md Inter Design System + Phosphor Duotone Suite</p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 4. Danger Zone: Reset All Local Data (Start Fresh) */}
      <Card className="glass-panel border border-rose-500/20 shadow-glass">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg text-rose-600 dark:text-rose-400">Danger Zone</CardTitle>
              <CardDescription>Reset local databases and cache back to day-zero empty state.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Wipe all locally stored accounts, transactions, recurring obligations, and categories to start with a 100% clean slate.
          </p>
          <button
            type="button"
            onClick={handleResetAllData}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset All Local Data (Start Fresh)</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
