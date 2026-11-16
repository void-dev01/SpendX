import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '../stores/authStore';

describe('SPENDX App Shell & Navigation Layout', () => {
  beforeEach(() => {
    useAuthStore.getState().setToken('test-token');
    useAuthStore.getState().setUser({
      id: 'usr_test',
      email: 'alex@spendx.app',
      fullName: 'Alex Morgan',
      currency: 'INR',
    });
  });

  it('renders Desktop Sidebar with primary navigation groups', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    const sidebar = screen.getByLabelText(/desktop sidebar navigation/i);
    expect(sidebar).toBeInTheDocument();
    expect(within(sidebar).getByText('Dashboard')).toBeInTheDocument();
    expect(within(sidebar).getByText('Transactions')).toBeInTheDocument();
    expect(within(sidebar).getByText('Accounts')).toBeInTheDocument();
    expect(within(sidebar).getByText('Budgets')).toBeInTheDocument();
    expect(within(sidebar).getByText('Savings Goals')).toBeInTheDocument();
    expect(within(sidebar).getByText('AI Assistant')).toBeInTheDocument();
    expect(within(sidebar).getByText('Reports & Tax')).toBeInTheDocument();
    expect(within(sidebar).getByText('Settings')).toBeInTheDocument();
  });

  it('renders Top Navbar with dynamic page title and search bar', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/top navigation/i)).toBeInTheDocument();
    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
    expect(screen.getByText(/search transactions, accounts, insights/i)).toBeInTheDocument();
  });

  it('renders Mobile Bottom Navigation with 5 destinations', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/mobile bottom navigation/i)).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('AI Coach')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('toggles desktop sidebar collapsed state', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByLabelText(/collapse sidebar/i);
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByLabelText(/expand sidebar/i)).toBeInTheDocument();

    // Toggle back
    fireEvent.click(screen.getByLabelText(/expand sidebar/i));
    expect(screen.getByLabelText(/collapse sidebar/i)).toBeInTheDocument();
  });

  it('opens and closes global search modal', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppLayout />
      </MemoryRouter>
    );

    const searchTrigger = screen.getByText(/search transactions, accounts, insights/i);
    fireEvent.click(searchTrigger);

    expect(screen.getByLabelText(/global search command palette/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search pages, ledgers, intelligence tools/i)).toBeInTheDocument();
  });
});
