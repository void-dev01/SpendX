# SPENDX System Architecture Overview

## 1. High-Level Topology

SPENDX is designed around a decoupled, service-oriented architecture ensuring high scalability, data privacy, and maintainability.

```mermaid
flowchart TD
    Client["SPENDX Frontend (React + Vite + Tailwind v4)"]
    API["SPENDX Backend API (Express.js + TypeScript)"]
    Supabase["Supabase (PostgreSQL + RLS + GoTrue Auth)"]
    Gemini["Google Gemini API (@google/genai)"]

    Client -->|HTTPS / REST| API
    Client -.->|Direct Auth Session (Anon Key)| Supabase
    API -->|Data Persistence & Service Role Queries| Supabase
    API -->|Financial Insights & Intelligence| Gemini
```

## 2. Core Architectural Principles
- **Decoupled Applications**: Frontend and backend run independently with separate dependency manifests and lifecycles.
- **Zero Frontend Secret Exposure**: No Gemini API keys or Supabase service role keys are bundled in client assets.
- **Strict Row-Level Security (RLS)**: PostgreSQL enforces user-level tenant isolation natively.
- **Centralized Validation**: Zod schemas validate data ingress at every API boundary.
