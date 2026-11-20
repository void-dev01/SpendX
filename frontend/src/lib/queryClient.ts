import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3, // 3 minutes stale-while-revalidate
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection cache retention
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: 1,
    },
  },
});

export const clearAllQueryCaches = () => {
  try {
    queryClient.clear();
  } catch (err) {
    console.warn('Failed to clear TanStack Query cache', err);
  }
};
