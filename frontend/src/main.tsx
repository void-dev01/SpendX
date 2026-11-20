import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSentry } from './lib/sentry';

// Initialize Sentry error monitoring (graceful no-op if VITE_SENTRY_DSN is unset)
initSentry();

// Register PWA Service Worker in production/supporting environments
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SPENDX PWA] Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('[SPENDX PWA] Service Worker registration failed:', error);
      });
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
