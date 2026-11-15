import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InsightsPage } from '../features/insights/InsightsPage';
import { useAuthStore } from '../stores/authStore';

describe('SPENDX Financial Insights & Intelligence Page', () => {
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

  const renderInsights = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/insights']}>
          <InsightsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders insights page header with title and subtitle', async () => {
    renderInsights();
    expect(
      await screen.findByRole('heading', {
        name: 'Financial Insights & Advisory',
        level: 1,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/proactive financial recommendations/i)).toBeInTheDocument();
  });

  it('renders four overview summary cards with accurate metric titles', async () => {
    renderInsights();
    expect(await screen.findByText('Financial Health')).toBeInTheDocument();
    expect(screen.getByText('Action Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Potential Monthly Savings')).toBeInTheDocument();
    expect(screen.getByText('Critical Alerts')).toBeInTheDocument();
  });

  it('renders financial health pillars breakdown with four scoring sections', async () => {
    renderInsights();
    expect(await screen.findByText('Financial Health Pillars')).toBeInTheDocument();
    expect(screen.getByText('Budget Discipline')).toBeInTheDocument();
    expect(screen.getByText('Savings Velocity')).toBeInTheDocument();
    expect(screen.getByText('Liquidity Cushion')).toBeInTheDocument();
    expect(screen.getByText('Liability Health')).toBeInTheDocument();
  });

  it('renders generated intelligence insight cards', async () => {
    renderInsights();
    // One or more generated insights should appear
    expect(await screen.findByText(/Idle Cash Optimization|Savings Rate|Subscription Audit/i)).toBeInTheDocument();
  });

  it('filters insights by search input', async () => {
    renderInsights();
    await screen.findByText('Financial Health Pillars');

    const searchInput = screen.getByPlaceholderText(/search intelligence, advice/i);
    fireEvent.change(searchInput, { target: { value: 'NonexistentFilterTextXYZ99' } });

    expect(await screen.findByText(/no insights match your active filters/i)).toBeInTheDocument();
  });

  it('filters insights using type category pills', async () => {
    renderInsights();
    await screen.findByText('Financial Health Pillars');

    const savingsPill = screen.getByRole('button', { name: 'Savings Opportunities' });
    fireEvent.click(savingsPill);

    expect(savingsPill).toHaveClass('bg-spendx-blue-primary');
  });

  it('allows user to bookmark an insight card', async () => {
    renderInsights();
    const bookmarkBtns = await screen.findAllByRole('button', { name: /bookmark insight/i });
    expect(bookmarkBtns.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(bookmarkBtns[0]);

    // Saved toggle
    const savedFilter = screen.getByRole('button', { name: /show bookmarked only/i });
    fireEvent.click(savedFilter);

    // Filtered list still has the bookmarked card
    const removeBookmarkBtns = await screen.findAllByRole('button', { name: /remove bookmark/i });
    expect(removeBookmarkBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('allows user to dismiss an insight card', async () => {
    renderInsights();
    const dismissBtns = await screen.findAllByRole('button', { name: /dismiss insight/i });
    expect(dismissBtns.length).toBeGreaterThanOrEqual(1);

    const initialCount = dismissBtns.length;
    fireEvent.click(dismissBtns[0]);

    // Should now have 1 fewer dismiss button or empty state
    await waitFor(() => {
      const remainingDismissBtns = screen.queryAllByRole('button', { name: /dismiss insight/i });
      expect(remainingDismissBtns.length).toBe(initialCount - 1);
    });
  });
});
