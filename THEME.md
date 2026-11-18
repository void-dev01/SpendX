# SPENDX — Professional Theme & Design System Specification (THEME.md)

**Version:** 2.0.0  
**Design Identity:** Premium Obsidian × Electric Indigo FinTech Design  
**Target Platform:** Mobile-First Web Application (PWA / Progressive Web App & Responsive Desktop)  
**Architecture:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion for React, Recharts, Radix UI Primitives, Lucide Icons  
**Authoritative Reference:** Engineering, AI Coding Agents & Product Design  

---

## 1. Executive Summary & Design Migration

### 1.1 The Shift from Glassmorphism to Solid Modern FinTech
SPENDX has completed a visual and architectural transformation, permanently retiring the experimental pastel glassmorphism pattern.

- **Previous Pattern (Discontinued):** Frosted glass, excessive `backdrop-filter: blur()`, floating translucent pastel gradients, ice blue/lavender haze.
- **Current Pattern (Production Standard):** **Premium Obsidian × Electric Indigo**.
  - Crisp, solid surfaces with mathematically defined elevation tokens (`--surface`, `--surface-elevated`).
  - Refined 1px structural borders (`--border`, `--border-subtle`).
  - High-performance, GPU-friendly rendering with zero layout-induced backdrop blur overhead.
  - Distinctive typography pairing: **Manrope** for display numbers, headlines, and KPI highlights; **Inter** for dense financial tables, navigation, and form controls.
  - Strict financial semantic contrast complying with WCAG 2.2 AA.

---

## 2. Core Color Tokens

### 2.1 Light Mode Palette

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#F5F7FB` | Main application canvas, clean calm backdrop |
| `--surface` | `#FFFFFF` | Core card surfaces, modal sheets, table containers |
| `--surface-elevated` | `#F0F3F9` | Secondary cards, pill filters, segmented controls, table headers |
| `--primary` | `#496BDB` | Primary action buttons, active navigation, brand focal points |
| `--primary-hover` | `#3C5CC7` | Interactive hover states for primary controls |
| `--secondary` | `#7256D9` | AI intelligence indicators, secondary metrics, automation accents |
| `--accent` | `#0E9F85` | Growth indicators, telemetry milestones, wealth targets |
| `--text-main` / `--foreground` | `#17243A` | Primary headlines, metric values, high-contrast labels |
| `--text-secondary` | `#627087` | Supporting descriptions, transaction timestamps, table headers |
| `--text-muted` | `#8995A8` | Ghost text, input placeholders, disabled elements |
| `--border` | `#E2E8F0` | Structural card borders, dividers, standard container outlines |
| `--border-subtle` | `#EDF0F5` | Internal list item separators, grid lines |
| `--income` | `#11866D` | Inflows, positive net cash flow, credit alerts |
| `--expense` | `#D95765` | Outflows, negative cash flow, debit alerts |
| `--warning` | `#B7791F` | Budget thresholds, approaching bill due dates |
| `--info` | `#4779C9` | System advisories, sync states, informational banners |

### 2.2 Dark Mode Palette (Obsidian FinTech)

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#101827` | Deep obsidian canvas |
| `--surface` | `#1D293B` | Solid elevated workspace surfaces, ledger cards |
| `--surface-elevated` | `#263449` | Flyout popovers, dropdowns, input elements |
| `--primary` | `#7895FF` | Electric Indigo active states, primary buttons, focal accents |
| `--primary-hover` | `#91A7FF` | Interactive hover states for primary controls |
| `--secondary` | `#A18BFF` | AI intelligence indicators, secondary metrics |
| `--accent` | `#36C6A0` | Growth indicators, wealth targets |
| `--text-main` / `--foreground` | `#F5F7FF` | Crisp high-contrast headlines and values |
| `--text-secondary` | `#A6B1C7` | Supporting descriptions, timestamps |
| `--text-muted` | `#8492AA` | Ghost text, input placeholders |
| `--border` | `#344258` | Structural card borders, dividers |
| `--border-subtle` | `#29364A` | Internal list item separators, grid lines |
| `--income` | `#36C6A0` | Inflows, positive cash flow |
| `--expense` | `#FF7C86` | Outflows, debit alerts |
| `--warning` | `#F4BB58` | Budget thresholds, warnings |
| `--info` | `#8BB7FF` | System notifications, telemetry advisories |

---

## 3. Typography System

### 3.1 Font Stack Pairing
- **Primary Display Font:** `Manrope`, system-ui, sans-serif
  - Usage: Landing headlines, Hero titles, KPI summary cards, section headers, net balance callouts.
  - Character: Geometric yet warm, authoritative, contemporary fintech weight.
- **Secondary Body & UI Font:** `Inter`, system-ui, sans-serif
  - Usage: Navigation items, table data cells, form controls, body copy, descriptions.
  - Character: Maximum legibility at small sizes, optimal tabular figure alignment.

### 3.2 Tabular Numerals for Monetary Values
All financial figures across the application MUST use tabular figures:
```css
font-variant-numeric: tabular-nums;
```
This guarantees alignment across table columns, ledger balances, and real-time streaming counters.

---

## 4. Surface Architecture & Card Guidelines

### 4.1 Card Design Rules
- **Solid Opacity:** Surfaces use 100% opaque `--surface` background color.
- **Borders:** Crisp `1px solid var(--border)` outline.
- **Corner Radii:**
  - Metric / KPI cards: `16px` (`rounded-2xl`)
  - Modals & dialogs: `16px`–`24px` (`rounded-2xl` to `rounded-3xl`)
  - Action buttons & inputs: `12px` (`rounded-xl`)
  - Badges & pills: `9999px` (`rounded-full`)
- **Shadows:** Controlled, crisp micro-shadows:
  - Default card: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`
  - Elevated modal/dropdown: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`
- **Prohibited:** Any form of `backdrop-filter: blur()`, glowing translucent pseudo-elements, or low-contrast washed-out pastel backgrounds.

---

## 5. Chart & Data Visualization Tokens

All Recharts charts and custom SVGs consume CSS variables from `src/styles/chart.css`:

```css
:root {
  --chart-primary: #496BDB;    /* Electric Indigo */
  --chart-secondary: #7256D9;  /* Electric Violet */
  --chart-emerald: #11866D;    /* Income Inflow */
  --chart-rose: #D95765;       /* Expense Outflow */
  --chart-amber: #B7791F;      /* Warning / Budget Cap */
  --chart-grid: #E2E8F0;       /* Axis & Grid Lines */
  --chart-tooltip-bg: #FFFFFF; /* High-contrast card */
}

.dark {
  --chart-primary: #7895FF;
  --chart-secondary: #A18BFF;
  --chart-emerald: #36C6A0;
  --chart-rose: #FF7C86;
  --chart-amber: #F4BB58;
  --chart-grid: #29364A;
  --chart-tooltip-bg: #1D293B;
}
```

---

## 6. Motion & Interactive Guidelines

- **Duration:** Standard micro-interactions are `150ms`–`200ms`.
- **Easing:** Smooth cubic-bezier `ease: [0.16, 1, 0.3, 1]`.
- **Scale:** Subtle feedback scale `active:scale-[0.98]` on buttons and cards.
- **Page Transitions:** Crisp entry animations with opacity and slight vertical translation (`y: 8px`).
- **Performance:** Hardware-accelerated transforms (`transform`, `opacity`) only.

---

## 7. Compliance Checklist

1. [x] **Zero Glassmorphism:** No translucent frosted cards or backdrop blur.
2. [x] **Strict Token Usage:** All colors mapped to CSS variables / Tailwind tokens.
3. [x] **Dual Theme Parity:** Light and Dark mode verified with equivalent contrast.
4. [x] **Typography Alignment:** Manrope for display headings; Inter for UI & body.
5. [x] **Tabular Figures:** Applied to all balances, currency figures, and percentages.
6. [x] **WCAG 2.2 AA:** Text contrast $\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings.
