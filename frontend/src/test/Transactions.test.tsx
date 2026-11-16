import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionsPage } from '../features/transactions/TransactionsPage';
import { useAuthStore } from '../stores/authStore';
import { transactionService, INITIAL_DEMO_TRANSACTIONS } from '../services/transactionService';

describe('SPENDX Transactions Page & Ledger Telemetry', () => {
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

    // Reset local cache to initial demo transactions
    localStorage.clear();
    transactionService.saveStoredTransactions(INITIAL_DEMO_TRANSACTIONS);
  });

  const renderTransactions = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/transactions']}>
          <TransactionsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders transactions page header with title, export button and add transaction CTA', async () => {
    renderTransactions();
    expect(await screen.findByRole('heading', { name: 'Transactions', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
  });

  it('renders four summary cards with deterministic metrics', async () => {
    renderTransactions();
    expect(await screen.findByText('Total Transactions')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Cash Flow')).toBeInTheDocument();
  });

  it('renders transaction search input and filter controls', async () => {
    renderTransactions();
    expect(
      await screen.findByPlaceholderText(/search transactions, merchants, or categories/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by transaction type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by category/i)).toBeInTheDocument();
  });

  it('filters transaction ledger by search keyword', async () => {
    renderTransactions();
    const searchInput = await screen.findByPlaceholderText(
      /search transactions, merchants, or categories/i
    );

    // Search for "Netflix"
    fireEvent.change(searchInput, { target: { value: 'Netflix' } });

    // Should display Online Subscription / Netflix
    expect((await screen.findAllByText('Online Subscription')).length).toBeGreaterThanOrEqual(1);
    // Should NOT display unrelated transactions
    expect(screen.queryByText('Fuel Station Fill-up')).not.toBeInTheDocument();
  });

  it('filters transactions by type (e.g. INCOME)', async () => {
    renderTransactions();
    const typeSelect = await screen.findByLabelText(/filter by transaction type/i);

    fireEvent.change(typeSelect, { target: { value: 'INCOME' } });

    expect((await screen.findAllByText('Monthly Salary Credit')).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('Grocery Shopping')).not.toBeInTheDocument();
  });

  it('opens Add Transaction dialog when Add Transaction button is clicked', async () => {
    renderTransactions();
    const addBtn = await screen.findByRole('button', { name: /add transaction/i });
    fireEvent.click(addBtn);

    expect(await screen.findByRole('heading', { name: 'Add New Transaction', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Transaction Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. grocery shopping/i)).toBeInTheDocument();
  });

  it('triggers CSV export when Export button is clicked', async () => {
    const exportSpy = vi.spyOn(transactionService, 'exportToCSV').mockImplementation(() => {});
    renderTransactions();

    const exportBtn = await screen.findByRole('button', { name: /export csv/i });
    fireEvent.click(exportBtn);

    expect(exportSpy).toHaveBeenCalled();
    exportSpy.mockRestore();
  });

  it('allows selecting all items on page and displays bulk actions bar', async () => {
    renderTransactions();
    const selectAllCheckbox = await screen.findByLabelText(/select all transactions/i);
    fireEvent.click(selectAllCheckbox);

    expect(await screen.findByText(/transactions selected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete selected/i })).toBeInTheDocument();
  });
});
