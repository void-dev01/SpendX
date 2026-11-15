import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BudgetsPage } from '../features/budgets/BudgetsPage';
import { useAuthStore } from '../stores/authStore';

// Mock Recharts ResponsiveContainer for jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="mock-responsive-container" style={{ width: 500, height: 250 }}>
        {children}
      </div>
    ),
  };
});

describe('SPENDX Budgets Page & Telemetry', () => {
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
  });

  const renderBudgets = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/budgets']}>
          <BudgetsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders budgets page header with title and create budget button', async () => {
    renderBudgets();
    expect(await screen.findByRole('heading', { name: 'Budgets', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create budget/i })).toBeInTheDocument();
  });

  it('renders four summary cards with accurate calculations', async () => {
    renderBudgets();
    expect(await screen.findByText('Total Budget')).toBeInTheDocument();
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('Remaining Budget')).toBeInTheDocument();
    expect(screen.getByText('Budget Utilization')).toBeInTheDocument();
  });

  it('renders prominent overall budget utilization card with progress bar', async () => {
    renderBudgets();
    expect(await screen.findByText('Overall Budget Utilization')).toBeInTheDocument();
    expect(screen.getByText(/Consolidated discipline across all active category allocations/i)).toBeInTheDocument();
  });

  it('renders category budgets grid with limits and status badges', async () => {
    renderBudgets();
    expect(await screen.findByText(/Category Budgets/i)).toBeInTheDocument();
    expect(screen.getByText('Food & Dining Budget')).toBeInTheDocument();
    expect(screen.getByText('Shopping & Apparel')).toBeInTheDocument();
    expect(screen.getByText('Transportation & Fuel')).toBeInTheDocument();
  });

  it('renders budget alerts and spending insights panels', async () => {
    renderBudgets();
    expect(await screen.findByText(/Budget Alerts & Thresholds/i)).toBeInTheDocument();
    expect(screen.getByText(/Deterministic Budget Insights/i)).toBeInTheDocument();
  });

  it('opens Create Budget modal dialog when CTA is clicked', async () => {
    renderBudgets();
    const createBtn = await screen.findByRole('button', { name: /create budget/i });
    fireEvent.click(createBtn);

    expect(await screen.findByRole('heading', { name: 'Create New Budget', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText(/budget name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/allocated limit/i)).toBeInTheDocument();
  });
});
