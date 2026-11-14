# SPENDX Local Developer & Environment Setup Guide

## 1. Prerequisites
- Node.js >= 20.0.0 (Tested on Node v26.13.1)
- npm >= 10.0.0 (Tested on npm 11.20.0)
- Git

## 2. Directory Separation
SPENDX maintains strict architectural isolation:
- `SPENDX/frontend`: Client-side single page application built on React, Vite, and Tailwind CSS v4.
- `SPENDX/backend`: RESTful API microservice built on Express.js, Node.js, and TypeScript.

Never link dependencies across frontend and backend; both projects maintain independent `package.json` manifests and `node_modules` trees.

## 3. Initializing Environment Files
Copy example environment templates to activate local settings:

```bash
# Frontend
cd frontend
cp .env.example .env

# Backend
cd ../backend
cp .env.example .env
```

## 4. Running the Development Servers
In two separate terminal sessions:

```bash
# Terminal 1: Backend API (Default Port: 5000)
cd SPENDX/backend
npm run dev

# Terminal 2: Frontend Client (Default Port: 5173)
cd SPENDX/frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 5. Verification Commands
Both workspaces feature strict validation pipelines:

### Frontend
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm run test`

### Backend
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm run test`
