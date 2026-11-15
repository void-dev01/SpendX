import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecurringPage } from '../features/recurring/RecurringPage';
import { useAuthStore } from '../stores/authStore';

describe('SPENDX Recurring Payments & Subscriptions Page', () => {
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
      id: 'demo-user-id',
      email: 'shubham@spendx.app',
      fullName: 'Shubham',
      currency: 'INR',
    });

    localStorage.clear();
  });

  const renderRecurring = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/recurring']}>
          <RecurringPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders recurring page header with title and new schedule CTA button', async () => {
    renderRecurring();
    expect(
      await screen.findByRole('heading', {
        name: 'Recurring Payments & Subscriptions',
        level: 1,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new schedule/i })).toBeInTheDocument();
  });

  it('renders four overview summary cards with accurate metric titles', async () => {
    renderRecurring();
    expect(await screen.findByText('Monthly Commitment')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Payments')).toBeInTheDocument();
    expect(screen.getByText('Paid This Month')).toBeInTheDocument();
    expect(screen.getByText('Active Schedules')).toBeInTheDocument();
  });

  it('renders demo recurring payment cards including Netflix', async () => {
    renderRecurring();
    const netflixItems = await screen.findAllByText('Netflix Premium 4K');
    expect(netflixItems.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Netflix Entertainment Ltd')[0]).toBeInTheDocument();
  });

  it('filters recurring items by search input', async () => {
    renderRecurring();
    const netflixItems = await screen.findAllByText('Netflix Premium 4K');
    expect(netflixItems.length).toBeGreaterThanOrEqual(1);

    const searchInput = screen.getByPlaceholderText(/search subscriptions, rent, bills/i);
    fireEvent.change(searchInput, { target: { value: 'Netflix' } });

    expect(screen.getAllByText('Netflix Premium 4K').length).toBeGreaterThanOrEqual(1);

    fireEvent.change(searchInput, { target: { value: 'NonexistentService1234' } });
    expect(await screen.findByText(/no recurring payments match your filters/i)).toBeInTheDocument();
  });

  it('opens new schedule modal on CTA button click and validates inputs', async () => {
    renderRecurring();
    const newBtn = await screen.findByRole('button', { name: /new schedule/i });
    fireEvent.click(newBtn);

    expect(await screen.findByRole('heading', { name: 'New Recurring Schedule' })).toBeInTheDocument();
    expect(screen.getByLabelText(/plan \/ service name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/merchant \/ payee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/billing cycle/i)).toBeInTheDocument();

    // Cancel dialog
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'New Recurring Schedule' })).not.toBeInTheDocument();
    });
  });

  it('toggles between list view and calendar view', async () => {
    renderRecurring();
    const calendarToggle = await screen.findByRole('button', { name: /calendar view/i });
    fireEvent.click(calendarToggle);

    expect(await screen.findByText(/visual payment roadmap/i)).toBeInTheDocument();

    const listToggle = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listToggle);

    const backToList = await screen.findAllByText('Netflix Premium 4K');
    expect(backToList.length).toBeGreaterThanOrEqual(1);
  });

  it('renders upcoming schedule timeline section', async () => {
    renderRecurring();
    expect(await screen.findByText('Upcoming Schedule Timeline')).toBeInTheDocument();
  });

  it('renders recurring intelligence & projections panel', async () => {
    renderRecurring();
    expect(await screen.findByText('Recurring Intelligence & Projections')).toBeInTheDocument();
    expect(screen.getByText('Projected Annual Outflow')).toBeInTheDocument();
  });
});
