import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReportsPage } from '../features/reports/ReportsPage';
import { reportsService } from '../services/reportsService';
import { useAuthStore } from '../stores/authStore';
import { transactionService, INITIAL_DEMO_TRANSACTIONS } from '../services/transactionService';
import { accountService, INITIAL_DEMO_ACCOUNTS } from '../services/accountService';

describe('SPENDX Financial Reports & Statements Page', () => {
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
  });

  const renderReports = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/reports']}>
          <ReportsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders reports page header with title and custom report CTA button', async () => {
    renderReports();
    expect(
      await screen.findByRole('heading', {
        name: 'Financial Reports & Statements',
        level: 1,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom report/i })).toBeInTheDocument();
  });

  it('renders four overview summary cards with accurate metric titles', async () => {
    renderReports();
    expect(await screen.findByText('Available Statements')).toBeInTheDocument();
    expect(screen.getByText('Latest Statement')).toBeInTheDocument();
    expect(screen.getByText('Tax Deductible Expenses')).toBeInTheDocument();
    expect(screen.getByText('Average Savings Rate')).toBeInTheDocument();
  });

  it('renders tax optimization & deductions section with export CTA', async () => {
    renderReports();
    expect(await screen.findByText(/tax optimization & deductions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export tax schedule/i })).toBeInTheDocument();
  });

  it('renders monthly financial statements table with column headers', async () => {
    renderReports();
    expect(await screen.findByText('Monthly Financial Statements')).toBeInTheDocument();
    expect(screen.getByText('Statement Cycle')).toBeInTheDocument();
    expect(screen.getByText('Total Inflows')).toBeInTheDocument();
    expect(screen.getByText('Total Outflows')).toBeInTheDocument();
    expect(screen.getByText('Net Cash Flow')).toBeInTheDocument();
  });

  it('opens custom report generator modal on CTA button click', async () => {
    renderReports();
    const customReportBtn = await screen.findByRole('button', { name: /custom report/i });
    fireEvent.click(customReportBtn);

    expect(await screen.findByRole('heading', { name: 'Generate Financial Report' })).toBeInTheDocument();
    expect(screen.getByText('Period Range')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate & export/i })).toBeInTheDocument();

    // Cancel modal
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Generate Financial Report' })).not.toBeInTheDocument();
    });
  });

  it('opens printable statement modal preview on printer icon click', async () => {
    renderReports();
    const previewBtns = await screen.findAllByTitle(/view printable statement/i);
    expect(previewBtns.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(previewBtns[0]);

    expect(await screen.findByText('Statement Preview')).toBeInTheDocument();
    expect(screen.getByText(/itemized transaction journal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print \/ save pdf/i })).toBeInTheDocument();

    // Close preview
    const closeBtn = screen.getByRole('button', { name: /close preview/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Statement Preview')).not.toBeInTheDocument();
    });
  });

  it('triggers CSV download when export button is clicked', async () => {
    const exportSpy = vi.spyOn(reportsService, 'exportToCSV').mockImplementation(() => {});

    renderReports();
    const downloadBtns = await screen.findAllByTitle(/download csv ledger/i);
    expect(downloadBtns.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(downloadBtns[0]);

    await waitFor(() => {
      expect(exportSpy).toHaveBeenCalled();
    });

    exportSpy.mockRestore();
  });
});
