import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { BudgetsPage } from '@/features/budgets/BudgetsPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { AiCoachPage } from '@/features/ai-coach/AiCoachPage';
import { SavingsPage } from '@/features/savings/SavingsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { AuthPage } from '@/features/auth/AuthPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="ai-coach" element={<AiCoachPage />} />
        <Route path="savings" element={<SavingsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};
