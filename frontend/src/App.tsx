import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppRoutes } from './routes';
import { useThemeStore } from './stores/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // 1-time migration for Real Mode: Wipe old seed/demo data from browser localStorage
    const REAL_MODE_KEY = 'spendx_real_mode_v1';
    if (typeof window !== 'undefined' && !localStorage.getItem(REAL_MODE_KEY)) {
      const keysToClear = [
        'spendx_transactions_store_v1',
        'spendx_accounts_store_v1',
        'spendx_recurring_payments_v1',
        'spendx_budgets_store_v1',
        'spendx_savings_goals_v1',
        'spendx_savings_contribs_v1',
      ];
      const existingTx = localStorage.getItem('spendx_transactions_store_v1');
      if (existingTx && (existingTx.includes('Acme Corp') || existingTx.includes('Nature Basket') || existingTx.includes('Netflix'))) {
        keysToClear.forEach((key) => localStorage.removeItem(key));
      }
      localStorage.setItem('spendx_demo_mode', 'cleared');
      localStorage.setItem(REAL_MODE_KEY, 'true');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors theme={theme} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
