import * as Sentry from '@sentry/react';

/**
 * Initializes Sentry for React with graceful no-op when VITE_SENTRY_DSN is absent.
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || dsn.trim().length === 0) {
    return;
  }

  Sentry.init({
    dsn: dsn.trim(),
    environment: import.meta.env.MODE || 'development',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
  });
}

export { Sentry };
