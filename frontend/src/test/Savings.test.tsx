import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SavingsPage } from '../features/savings/SavingsPage';
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

describe('SPENDX Savings Page & Goals Telemetry', () => {
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

  const renderSavings = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/savings']}>
          <SavingsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders savings page header with title and create goal button', async () => {
    renderSavings();
    expect(await screen.findByRole('heading', { name: 'Savings Goals', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new goal/i })).toBeInTheDocument();
  });

  it('renders four overview summary cards with accurate metric titles', async () => {
    renderSavings();
    expect(await screen.findByText('Total Savings')).toBeInTheDocument();
    expect(screen.getByText('Total Target')).toBeInTheDocument();
    expect(screen.getByText('Remaining to Save')).toBeInTheDocument();
    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
  });

  it('renders demo savings goals cards in the grid', async () => {
    renderSavings();
    expect(await screen.findByRole('heading', { name: 'Emergency Fund', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'New Laptop', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Japan Autumn Trip', level: 3 })).toBeInTheDocument();
  });

  it('opens Create Savings Goal dialog when Create New Goal is clicked', async () => {
    renderSavings();
    const createBtn = await screen.findByRole('button', { name: /create new goal/i });
    fireEvent.click(createBtn);

    expect(await screen.findByRole('heading', { name: 'Create Savings Goal', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText(/goal name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
  });

  it('opens Add Money dialog when Add Money is clicked on a goal card', async () => {
    renderSavings();
    const addMoneyBtns = await screen.findAllByRole('button', { name: /add money/i });
    fireEvent.click(addMoneyBtns[0]);

    expect(await screen.findByRole('heading', { name: 'Add Money to Goal', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText(/contribution amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source account/i)).toBeInTheDocument();
  });

  it('filters savings goals by search keyword', async () => {
    renderSavings();
    // Wait for cards to render
    expect(await screen.findByRole('heading', { name: 'New Laptop', level: 3 })).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search goals.../i);
    fireEvent.change(searchInput, { target: { value: 'Laptop' } });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'New Laptop', level: 3 })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Emergency Fund', level: 3 })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Japan Autumn Trip', level: 3 })).not.toBeInTheDocument();
    });
  });

  it('renders milestone intelligence insights panel', async () => {
    renderSavings();
    expect(await screen.findByText(/SPENDX Milestone Intelligence/i)).toBeInTheDocument();
  });
});
