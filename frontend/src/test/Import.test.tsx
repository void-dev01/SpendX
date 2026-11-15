import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { importService } from '../services/importService';
import { TransactionsPage } from '../features/transactions/TransactionsPage';
import { useAuthStore } from '../stores/authStore';

describe('SPENDX Automatic Financial Data Capture & Import Engine', () => {
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

  const renderTransactions = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/transactions']}>
          <TransactionsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  describe('Parser & Normalization Utilities', () => {
    it('parses CSV statements with custom delimiters and quotes', () => {
      const csv = `Date,Description,Amount,Type\n"2026-11-14","Swiggy Order #401",640.50,EXPENSE\n"2026-11-13","Salary Payroll",85000,INCOME`;
      const rows = importService.parseCSVText(csv);
      expect(rows.length).toBe(3);
      expect(rows[1][0]).toBe('2026-11-14');
      expect(rows[1][1]).toBe('Swiggy Order #401');
      expect(rows[1][2]).toBe('640.50');
      expect(rows[2][2]).toBe('85000');
    });

    it('automatically detects standard column mappings from header names', () => {
      const headers = ['Txn Date', 'Particulars / Narration', 'Debit Amount', 'UTR / Ref No'];
      const mapping = importService.detectColumnMapping(headers);
      expect(mapping.dateCol).toBe(0);
      expect(mapping.descCol).toBe(1);
      expect(mapping.amountCol).toBe(2);
      expect(mapping.refCol).toBe(3);
    });

    it('parses Indian banking SMS alerts with amount, merchant, and reference', () => {
      const sms = `Dear SBI User, your A/c ending 8114 debited by Rs.1,250.00 on 14-Nov-26 by UPI/Swiggy/ref 432190. Bal: Rs.26,680.00`;
      const parsed = importService.parseSMSText(sms);
      expect(parsed.length).toBe(1);
      expect(parsed[0].rawAmount).toBe('1250.00');
      expect(parsed[0].rawType).toBe('EXPENSE');
      expect(parsed[0].rawReference).toBe('432190');
      expect(parsed[0].rawAccountMask).toBe('8114');
    });

    it('deterministically categorizes merchants with high confidence', () => {
      const swiggy = importService.inferCategoryAndMerchant('UPI/Swiggy/Order123');
      expect(swiggy.category).toBe('Food & Dining');
      expect(swiggy.confidence).toBeGreaterThanOrEqual(90);

      const uber = importService.inferCategoryAndMerchant('UBER INDIA TRIP #9012');
      expect(uber.category).toBe('Transport');
      expect(uber.confidence).toBeGreaterThanOrEqual(90);

      const netflix = importService.inferCategoryAndMerchant('Netflix Entertainment Monthly');
      expect(netflix.category).toBe('Entertainment');
      expect(netflix.confidence).toBeGreaterThanOrEqual(90);
    });

    it('detects duplicates when reference number or 24h amount/merchant match', async () => {
      const targetAccount = {
        id: 'acc-hdfc-01',
        userId: 'usr_shubham',
        name: 'HDFC Bank',
        institution: 'HDFC Bank',
        type: 'BANK' as const,
        balance: 50000,
        currency: 'INR',
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingTxs = [
        {
          id: 'txn-1',
          userId: 'usr_shubham',
          accountId: 'acc-hdfc-01',
          accountName: 'HDFC Bank',
          amount: 649,
          type: 'EXPENSE' as const,
          category: 'Entertainment',
          description: 'Netflix Premium 4K',
          date: new Date().toISOString(),
          paymentMethod: 'UPI' as const,
          status: 'COMPLETED' as const,
          notes: 'Ref 998877',
          isRecurring: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const rawRows = [
        {
          id: 'row-1',
          rawDate: new Date().toISOString(),
          rawAmount: '649.00',
          rawDescription: 'Netflix Premium 4K',
          rawReference: '998877',
        },
        {
          id: 'row-2',
          rawDate: new Date().toISOString(),
          rawAmount: '120.00',
          rawDescription: 'Chai Point Tea',
        },
      ];

      const normalized = await importService.normalizeTransactions(rawRows, targetAccount, existingTxs);
      expect(normalized[0].duplicateStatus).toBe('EXACT_DUPLICATE');
      expect(normalized[0].isSelected).toBe(false);

      expect(normalized[1].duplicateStatus).toBe('NEW');
      expect(normalized[1].isSelected).toBe(true);
    });
  });

  describe('Import UI Modal Workflow', () => {
    it('renders the Import CTA button in TransactionsPage and opens the import dialog', async () => {
      renderTransactions();
      const importBtn = await screen.findByRole('button', { name: /import/i });
      expect(importBtn).toBeInTheDocument();

      fireEvent.click(importBtn);

      expect(
        await screen.findByRole('heading', {
          name: 'Automatic Financial Data Capture',
        })
      ).toBeInTheDocument();
      expect(screen.getByText('1. Choose Ingestion Source')).toBeInTheDocument();
      expect(screen.getByText('Bank SMS Text')).toBeInTheDocument();
    });

    it('switches to SMS source, loads sample SMS, and proceeds to transaction preview', async () => {
      renderTransactions();
      const importBtn = await screen.findByRole('button', { name: /import/i });
      fireEvent.click(importBtn);

      // Select SMS Source
      const smsSourceBtn = await screen.findByRole('button', { name: /bank sms text/i });
      fireEvent.click(smsSourceBtn);

      // Load sample SMS
      const loadSampleBtn = screen.getByRole('button', { name: /load sample sms/i });
      fireEvent.click(loadSampleBtn);

      // Click Continue to step 3 preview
      const continueBtn = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(continueBtn);

      // Expect preview table with extracted transactions
      expect(await screen.findByText(/Transactions Extracted/i)).toBeInTheDocument();
      expect(screen.getByText(/ready to import/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm & import/i })).toBeInTheDocument();
    });
  });
});
