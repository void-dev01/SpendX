import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountsPage } from '../features/accounts/AccountsPage';
import { useAuthStore } from '../stores/authStore';

describe('SPENDX Accounts Page & Telemetry', () => {
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

  const renderAccounts = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/accounts']}>
          <AccountsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders accounts page header with title and add account CTA', async () => {
    renderAccounts();
    expect(await screen.findByRole('heading', { name: 'My Accounts', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add account/i })).toBeInTheDocument();
  });

  it('renders four summary cards with asset vs liability separation', async () => {
    renderAccounts();
    expect(await screen.findByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('Bank & Savings')).toBeInTheDocument();
    expect(screen.getByText('Cash Balance')).toBeInTheDocument();
    expect(screen.getByText('Credit Card Outstanding')).toBeInTheDocument();
  });

  it('renders accounts search input and type filter dropdown', async () => {
    renderAccounts();
    expect(
      await screen.findByPlaceholderText(/search by account, bank, or card name/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/filter accounts by type/i)).toBeInTheDocument();
  });

  it('filters account list by search keyword', async () => {
    renderAccounts();
    const searchInput = await screen.findByPlaceholderText(
      /search by account, bank, or card name/i
    );

    fireEvent.change(searchInput, { target: { value: 'ICICI' } });

    expect(await screen.findByText('ICICI Sapphiro Credit Card')).toBeInTheDocument();
    expect(screen.queryByText('SBI Savings Vault')).not.toBeInTheDocument();
  });

  it('opens Add Account dialog when Add Account CTA is clicked', async () => {
    renderAccounts();
    const addBtn = await screen.findByRole('button', { name: /add account/i });
    fireEvent.click(addBtn);

    expect(await screen.findByRole('heading', { name: 'Add New Account', level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText(/account name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bank \/ institution/i)).toBeInTheDocument();
  });
});
