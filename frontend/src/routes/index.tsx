import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Public Pages
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';

// Authenticated Application Pages
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { TransactionDetailPage } from '@/features/transactions/TransactionDetailPage';
import { AccountsPage } from '@/features/accounts/AccountsPage';
import { AccountDetailPage } from '@/features/accounts/AccountDetailPage';
import { BudgetsPage } from '@/features/budgets/BudgetsPage';
import { BudgetDetailPage } from '@/features/budgets/BudgetDetailPage';
import { SavingsPage } from '@/features/savings/SavingsPage';
import { SavingsDetailPage } from '@/features/savings/SavingsDetailPage';
import { RecurringPage } from '@/features/recurring/RecurringPage';
import { RecurringDetailPage } from '@/features/recurring/RecurringDetailPage';
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage';
import { AiAssistantPage } from '@/features/ai-assistant/AiAssistantPage';
import { InsightsPage } from '@/features/insights/InsightsPage';
import { ReportsPage } from '@/features/reports/ReportsPage';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { SettingsPage } from '@/features/settings/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />

      {/* 2. Authenticated Application Shell (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* GROUP 1 — OVERVIEW */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* GROUP 2 — MONEY MANAGEMENT */}
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:id" element={<AccountDetailPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/budgets/:id" element={<BudgetDetailPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/savings/:id" element={<SavingsDetailPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/recurring/:id" element={<RecurringDetailPage />} />

          {/* GROUP 3 — INTELLIGENCE */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/ai-coach" element={<AiAssistantPage />} />
          <Route path="/insights" element={<InsightsPage />} />

          {/* GROUP 4 — REPORTING */}
          <Route path="/reports" element={<ReportsPage />} />

          {/* GROUP 5 — PERSONAL */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 3. Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
