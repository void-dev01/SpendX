import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { authService } from '../services/authService';

describe('SPENDX Authentication Pages', () => {
  it('renders LoginPage with all required form controls', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it('renders SignupPage with full name, password strength, and terms checkbox', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^create password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  it('validates empty login form and shows field errors', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    });
  });

  it('validates signup form and requires password matching and terms agreement', async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility when eye button is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText(/show password/i);
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('rejects login when user has not created an account', async () => {
    localStorage.clear();
    const result = await authService.login('unregistered@spendx.local', 'Password123');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/no account found/i);
  });

  it('registers a new user, rejects wrong password, and logs in with correct password', async () => {
    localStorage.clear();
    const signupRes = await authService.signup('Priyam Test', 'priyam@test.local', 'Secret123!');
    expect(signupRes.success).toBe(true);
    expect(signupRes.user?.email).toBe('priyam@test.local');

    // Reject wrong password
    const wrongPassRes = await authService.login('priyam@test.local', 'WrongPass999!');
    expect(wrongPassRes.success).toBe(false);
    expect(wrongPassRes.error).toMatch(/invalid password/i);

    // Reject duplicate signup
    const dupSignupRes = await authService.signup('Priyam Other', 'priyam@test.local', 'AnotherPass123!');
    expect(dupSignupRes.success).toBe(false);
    expect(dupSignupRes.error).toMatch(/already exists/i);

    // Succeed with correct password
    const successLoginRes = await authService.login('priyam@test.local', 'Secret123!');
    expect(successLoginRes.success).toBe(true);
    expect(successLoginRes.user?.fullName).toBe('Priyam Test');
  });
});
