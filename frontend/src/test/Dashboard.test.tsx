import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { useAuthStore } from '../stores/authStore';

// Mock Recharts ResponsiveContainer to ensure deterministic DOM rendering in jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="mock-responsive-container" style={{ width: 500, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe('SPENDX Dashboard Page & Telemetry', () => {
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
  });

  const renderDashboard = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders welcome header with personalized user greeting and date', async () => {
    renderDashboard();
    expect(await screen.findByText(/Good (Morning|Afternoon|Evening), Shubham!/i)).toBeInTheDocument();
    expect(screen.getByText(/Here's what's happening with your money today/i)).toBeInTheDocument();
    expect(screen.getByText(/Demo Data/i)).toBeInTheDocument();
  });

  it('renders all four financial overview summary cards with INR formatting', async () => {
    renderDashboard();
    expect(await screen.findByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Available Balance')).toBeInTheDocument();

    // Check formatted values
    expect(screen.getByText('₹1,24,580.00')).toBeInTheDocument();
    expect(screen.getByText('₹45,000.00')).toBeInTheDocument();
    expect(screen.getAllByText('₹18,450.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('₹26,550.00')).toBeInTheDocument();
  });

  it('renders Income vs Expenses and Spending Analytics sections', async () => {
    renderDashboard();
    expect(await screen.findByText('Income vs Expenses')).toBeInTheDocument();
    expect(screen.getByText('Where Your Money Goes')).toBeInTheDocument();
    expect(screen.getByText('View Analytics')).toBeInTheDocument();
  });

  it('renders Budget Overview with spending progress and limits', async () => {
    renderDashboard();
    expect(await screen.findByText('Budget Overview')).toBeInTheDocument();
    expect(screen.getByText('View All Budgets')).toBeInTheDocument();
    expect(screen.getAllByText('Food & Dining').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Shopping').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transport').length).toBeGreaterThan(0);
  });

  it('renders Recent Transactions list with merchant and category details', async () => {
    renderDashboard();
    expect(await screen.findByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('View All Transactions')).toBeInTheDocument();
    expect(screen.getAllByText('Grocery Shopping').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Monthly Salary').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Electricity Bill').length).toBeGreaterThan(0);
  });

  it('renders Savings Goals and AI Financial Insights widgets', async () => {
    renderDashboard();
    expect(await screen.findByText('Your Savings Goals')).toBeInTheDocument();
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    expect(screen.getByText('New Laptop')).toBeInTheDocument();

    expect(screen.getByText('Your AI Money Insights')).toBeInTheDocument();
    expect(screen.getByText(/Dining expenses increased 12%/i)).toBeInTheDocument();
    expect(screen.getByText(/Recurring subscriptions total ₹1,499\/mo/i)).toBeInTheDocument();
  });

  it('renders Upcoming Recurring Payments list', async () => {
    renderDashboard();
    expect(await screen.findByText('Upcoming Payments')).toBeInTheDocument();
    expect(screen.getByText('Internet Fiber Bill')).toBeInTheDocument();
    expect(screen.getByText('Netflix Subscription')).toBeInTheDocument();
  });

  it('allows switching date range filter (This Month -> Last Month)', async () => {
    renderDashboard();
    const lastMonthBtn = await screen.findByRole('button', { name: 'Last Month' });
    expect(lastMonthBtn).toBeInTheDocument();
    fireEvent.click(lastMonthBtn);

    // After switching to Last Month, updated figures for Last Month appear
    expect(await screen.findByText('₹1,14,800.00')).toBeInTheDocument();
  });
});
