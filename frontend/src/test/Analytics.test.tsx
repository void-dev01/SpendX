import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { useAuthStore } from '../stores/authStore';
import { transactionService, INITIAL_DEMO_TRANSACTIONS } from '../services/transactionService';
import { accountService, INITIAL_DEMO_ACCOUNTS } from '../services/accountService';
import { budgetService, INITIAL_DEMO_BUDGETS } from '../services/budgetService';
import { savingsService, INITIAL_DEMO_SAVINGS_GOALS } from '../services/savingsService';

// Mock Recharts ResponsiveContainer for jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="mock-responsive-container" style={{ width: 600, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('SPENDX Financial Analytics Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    useAuthStore.getState().setToken('test-token');
    useAuthStore.getState().setUser({
      id: 'usr_shubham',
      email: 'shubham@spendx.app',
      fullName: 'Shubham',
      currency: 'INR',
    });

    localStorage.clear();
    transactionService.saveStoredTransactions(INITIAL_DEMO_TRANSACTIONS);
    accountService.saveStoredAccounts(INITIAL_DEMO_ACCOUNTS);
    budgetService.saveStoredBudgets(INITIAL_DEMO_BUDGETS);
    savingsService.saveStoredGoals(INITIAL_DEMO_SAVINGS_GOALS);
  });

  const renderAnalytics = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/analytics']}>
          <AnalyticsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders analytics page header with title and subtitle', async () => {
    renderAnalytics();
    expect(
      await screen.findByRole('heading', { name: 'Financial Analytics', level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/understand your money\. discover patterns\. make smarter decisions\./i)
    ).toBeInTheDocument();
  });

  it('renders all four primary financial summary cards', async () => {
    renderAnalytics();
    expect(await screen.findByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getAllByText('Net Cash Flow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Savings Rate').length).toBeGreaterThan(0);
  });

  it('renders Income vs Expenses visualization section and allows view switching', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Income vs Expenses', level: 2 })).toBeInTheDocument();
    const lineBtn = screen.getByRole('button', { name: /line chart view/i });
    fireEvent.click(lineBtn);
    expect(screen.getAllByTestId('mock-responsive-container').length).toBeGreaterThan(0);
  });

  it('renders Where Your Money Goes category breakdown and Income Sources', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Where Your Money Goes', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Income Sources', level: 2 })).toBeInTheDocument();
  });

  it('renders Spending Trends and allows switching metric between expenses, income and net flow', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Spending Trends', level: 2 })).toBeInTheDocument();
    const incomeBtn = screen.getByRole('button', { name: /^income$/i });
    fireEvent.click(incomeBtn);
    expect(screen.getByText('Spending Trends')).toBeInTheDocument();
  });

  it('renders Budget Performance and Savings Performance integrated sections', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Budget Performance', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Savings Performance', level: 2 })).toBeInTheDocument();
  });

  it('renders Top Spending Categories and Largest Transactions with tab switching', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Top Spending Categories', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Largest Transactions', level: 2 })).toBeInTheDocument();

    const highestIncomeTab = screen.getByRole('button', { name: /highest income/i });
    fireEvent.click(highestIncomeTab);
  });

  it('renders Periodic Financial Breakdown table and triggers CSV export', async () => {
    renderAnalytics();
    expect(await screen.findByRole('heading', { name: 'Periodic Financial Breakdown', level: 2 })).toBeInTheDocument();
    const exportBtn = screen.getByRole('button', { name: /export csv/i });
    expect(exportBtn).toBeInTheDocument();
  });
});
