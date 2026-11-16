import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Sleek Route Loading Fallback Indicator
export const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-10 h-10 border-3 border-spendx-blue-primary/20 border-t-spendx-blue-primary rounded-full animate-spin" />
    <span className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
      Loading SPENDX...
    </span>
  </div>
);

// 1. Public Pages (Instant Entrypoint)
import { LandingPage } from '@/features/landing/LandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';

// 2. Authenticated Application Pages (Lazy Loaded for Granular Bundles)
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const TransactionsPage = lazy(() => import('@/features/transactions/TransactionsPage').then((m) => ({ default: m.TransactionsPage })));
const TransactionDetailPage = lazy(() => import('@/features/transactions/TransactionDetailPage').then((m) => ({ default: m.TransactionDetailPage })));
const AccountsPage = lazy(() => import('@/features/accounts/AccountsPage').then((m) => ({ default: m.AccountsPage })));
const AccountDetailPage = lazy(() => import('@/features/accounts/AccountDetailPage').then((m) => ({ default: m.AccountDetailPage })));
const BudgetsPage = lazy(() => import('@/features/budgets/BudgetsPage').then((m) => ({ default: m.BudgetsPage })));
const BudgetDetailPage = lazy(() => import('@/features/budgets/BudgetDetailPage').then((m) => ({ default: m.BudgetDetailPage })));
const SavingsPage = lazy(() => import('@/features/savings/SavingsPage').then((m) => ({ default: m.SavingsPage })));
const SavingsDetailPage = lazy(() => import('@/features/savings/SavingsDetailPage').then((m) => ({ default: m.SavingsDetailPage })));
const RecurringPage = lazy(() => import('@/features/recurring/RecurringPage').then((m) => ({ default: m.RecurringPage })));
const RecurringDetailPage = lazy(() => import('@/features/recurring/RecurringDetailPage').then((m) => ({ default: m.RecurringDetailPage })));
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const AiAssistantPage = lazy(() => import('@/features/ai-assistant/AiAssistantPage').then((m) => ({ default: m.AiAssistantPage })));
const InsightsPage = lazy(() => import('@/features/insights/InsightsPage').then((m) => ({ default: m.InsightsPage })));
const ReportsPage = lazy(() => import('@/features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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
    </Suspense>
  );
};
