# SPENDX — AI-Powered Personal Finance Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-black.svg)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-26.x-339933.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/Tests-115%20Passed-success.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 1. Project Overview & Tagline
**SPENDX** — *Your Money. Your Intelligence.*

SPENDX is a production-grade, privacy-centric, AI-powered personal finance management ecosystem. Engineered as two decoupled, independently deployable systems—a reactive Vite/React SPA and a hardened Express/Node API microservice—SPENDX delivers continuous financial awareness, automatic statement ingestion, recurring payment tracking, financial health diagnostics, proactive background alerts, and conversational AI coaching.

---

## 2. Core Functional Modules

| Module | Route | Key Capabilities |
|---|---|---|
| **Executive Dashboard** | `/` | Net worth metrics, cash flow trends, budget health, savings velocity, upcoming bills, AI pulse |
| **Financial Ledger** | `/transactions` | Multi-account ledger, merchant categorization, search, date filters, universal data capture |
| **Automatic Ingestion** | Modal (`/transactions`) | CSV, Excel, PDF Text & Indian Bank SMS parsers, column mapper, 24h deduplication |
| **Account Vault** | `/accounts` | Bank, savings, credit cards, cash accounts, net worth calculation, transfer modal |
| **Budget Discipline** | `/budgets` | Category spending caps, utilization meters, overrun warnings, status indicators |
| **Savings Milestones** | `/savings` | Goal progress tracking, contribution ledger, milestone celebrations (50%, 100%) |
| **Financial Analytics** | `/analytics` | Income vs expense burn rate, category heatmaps, account liquidity distribution |
| **Recurring Commitments** | `/recurring` | Subscription schedules, frequency tracking, upcoming calendar, smart pattern detector |
| **Advisory & Insights** | `/insights` | 4-Pillar Financial Health Score (0-100), high-impact recommendations, bookmarking |
| **Reports & Statements** | `/reports` | Monthly account statements, RFC 4180 CSV export, tax deductions (80D/80E/80GG), print preview |
| **AI Financial Coach** | `/ai-assistant` | Grounded Gemini financial assistant, contextual prompt chips, advice cards |

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React 19 + Vite 6 + TypeScript 5.7
- **Styling**: Tailwind CSS v4, Lucide React, Motion for React
- **Design Tokens**: Ice Blue (`#DDF5FF`), Soft Lavender (`#DCD9FF`), Primary Indigo (`#718FE8`), Deep Slate (`#263653`)
- **State Management**: TanStack Query v5 + Zustand
- **Forms & Validation**: React Hook Form + Zod v3
- **Visualization**: Recharts + Sonner notifications
- **Testing**: Vitest + React Testing Library + JSDOM (14 test suites, 89 passed)

### Backend Architecture
- **Runtime**: Node.js LTS + Express 4.21 + TypeScript 5.7
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
- **AI Integration**: Google Gemini API via official `@google/genai` SDK
- **Security & Reliability**: Helmet, CORS, express-rate-limit, Pino logging
- **Storage**: Secure user-scoped file & receipt uploads with 15-minute signed URLs
- **Background Jobs**: In-memory interval scheduler with graceful shutdown hooks
- **Testing**: Vitest + Supertest (4 test suites, 26 passed)

---

## 4. System Architecture

```mermaid
flowchart TD
    subgraph Client ["SPENDX Web Application (React 19 + Vite)"]
        UI["Frosted-Glass Financial UI"]
        State["Zustand Stores & TanStack Query"]
        Import["Universal Data Ingestion Engine<br/>(CSV, Excel, PDF Text, SMS)"]
    end

    subgraph Backend ["SPENDX Core API (Node.js + Express)"]
        Gateway["Express Router & Helmet CSP"]
        Auth["JWT Auth Middleware & Rate Limiter"]
        Scheduler["Background Jobs Scheduler<br/>(Bills, Budgets, Milestones)"]
        Storage["Storage Service<br/>(Signed URLs, MIME validation)"]
    end

    subgraph Infrastructure ["Cloud Infrastructure"]
        Supabase[("Supabase PostgreSQL<br/>(14 Tables + Strict RLS)")]
        Gemini["Google Gemini AI<br/>(@google/genai)"]
    end

    UI --> State
    State --> Gateway
    Import --> Gateway
    Gateway --> Auth
    Auth --> Scheduler
    Auth --> Storage
    Gateway --> Supabase
    Gateway --> Gemini
```

---

## 5. Database Schema & Migration Execution Order

All database migrations reside in `backend/src/db/migrations/` and must be executed in order:

1. **`001_initial_schema.sql`**:
   - Creates 14 core entities: `profiles`, `accounts`, `categories`, `transactions`, `budgets`, `savings_goals`, `savings_contributions`, `recurring_payments`, `financial_insights`, `capture_events`, `notifications`, `chat_sessions`, `chat_messages`, `reports`.
   - Provisions 11 high-performance B-Tree composite indexes for instant query response times.

2. **`002_row_level_security.sql`**:
   - Enables `ROW LEVEL SECURITY` across all 14 tables.
   - Enforces strict tenant isolation: users can only query and mutate records where `auth.uid() = user_id`.
   - Allows shared read access for system default categories (`is_system = true`).

3. **`003_audit_triggers.sql`**:
   - Provisions `set_updated_at()` trigger for automated modification tracking.
   - Adds unique constraint `uq_transactions_ref_number` on `transactions(user_id, account_id, reference_number)` to prevent duplicate imports.
   - Provisions `handle_new_user()` trigger on `auth.users` to automatically seed user profile and default category dictionary upon registration.

---

## 6. API Reference & Endpoints

### Health & Monitoring
- `GET /api/v1/health` — Service liveness check (200 OK)
- `GET /api/v1/health/ready` — Readiness probe (memory usage, scheduler state, database status)

### Financial Transactions & Capture
- `POST /api/v1/transactions` — Record new transaction (requires JWT, validates amount, deduplicates)

### AI Intelligence & Advisory
- `GET /api/v1/ai/status` — Gemini AI integration readiness
- `GET /api/v1/ai/insights` — Retrieve personalized AI financial recommendations
- `POST /api/v1/ai/coach` — Ask conversational financial coach

### Scheduled Notifications & Background Automation
- `GET /api/v1/notifications` — Retrieve notifications & unread count
- `PATCH /api/v1/notifications/:id/read` — Mark notification as acknowledged

### Secure Financial Document Storage
- `POST /api/v1/storage/upload-url` — Request short-lived signed upload URL (validated MIME & size <= 5MB)
- `POST /api/v1/storage/download-url` — Generate 15-minute signed download URL (cross-tenant protected)
- `POST /api/v1/storage/register` — Register uploaded receipt in user ledger
- `GET /api/v1/storage/documents` — List user stored receipts and statements

---

## 7. Local Development Setup

### Prerequisites
- Node.js >= 20.x (v26 LTS recommended)
- npm >= 10.x
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/void-dev01/SpendX.git
cd SpendX

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Configuration
1. **Frontend**:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. **Backend**:
   ```bash
   cp backend/.env.example backend/.env
   ```

### Running Locally
```bash
# Run backend development server (Port 5000)
cd backend
npm run dev

# In a separate terminal, run frontend development server (Port 5173)
cd frontend
npm run dev
```

### Running Test Suites
```bash
# Run backend test suite (26 tests)
cd backend
npm test

# Run frontend test suite (89 tests)
cd frontend
npm test
```

---

## 8. Production Deployment Guide

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Link your GitHub repository to Vercel or Netlify.
2. Set Root Directory to `frontend`.
3. Set Build Command: `npm run build`.
4. Set Output Directory: `dist`.
5. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-api-domain.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-key`

### Backend Deployment (Render / Railway / Fly.io)
1. Connect repository with Root Directory set to `backend`.
2. Set Build Command: `npm install && npm run build`.
3. Set Start Command: `npm start`.
4. Configure Health Check Endpoint: `/api/v1/health`.
5. Set Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-domain.com`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `GEMINI_API_KEY`: `your-google-gemini-key`

---

## 9. Security & Compliance Architecture

- **Zero-Trust Multi-Tenancy**: Database tables enforce cryptographic tenant isolation via Supabase RLS.
- **Cross-Tenant Storage Protection**: Storage endpoints reject file paths not prefixed with the authenticated `auth.uid()`.
- **Zero-Storage of Raw Credentials**: Bank sync operations do not store banking passwords or net banking PINs.
- **Input Sanitization**: Every API endpoint strictly validates incoming payloads using Zod schemas.
- **Auditing & Non-Repudiation**: Automatic `updated_at` triggers and duplicate transaction reference keys ensure ledger integrity.

---

## 10. License
This project is open-source and licensed under the [MIT License](LICENSE).
