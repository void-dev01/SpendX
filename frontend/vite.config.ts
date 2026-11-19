/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@phosphor-icons')) {
              return 'vendor-phosphor';
            }
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            if (id.includes('motion')) {
              return 'vendor-motion';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@tanstack/react-query') || id.includes('axios') || id.includes('zustand')) {
              return 'vendor-data';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('date-fns') || id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }
            return 'vendor-core';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
