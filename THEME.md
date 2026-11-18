# SPENDX — Professional Theme & Design System Specification (THEME.md)

**Version:** 3.0.0  
**Design Identity:** Horizon UI Inspired Premium FinTech Design (Electric Horizon Blue × Soft Neutral)  
**Target Platform:** Mobile-First Web Application (PWA / Progressive Web App & Responsive Desktop)  
**Architecture:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion for React, Recharts, Radix UI Primitives, Lucide Icons  
**Authoritative Reference:** Engineering, AI Coding Agents & Product Design  

---

## 1. Executive Summary & Design Migration

### 1.1 Horizon UI FinTech Aesthetic Principles
SPENDX adopts the visual language and refined composition of the Horizon UI FinTech Admin Dashboard reference:

- **Soft Neutral Canvases:** Soft cool-grey `#F4F7FE` light mode canvas paired with deep navy `#0B1437` dark mode canvas.
- **Pure Solid Surfaces:** High-contrast pure white `#FFFFFF` light cards and `#111C44` dark cards.
- **Signature Circular Icon Badges:** Circular avatar containers with tinted background fills (`w-12 h-12 rounded-full bg-primary/10 text-primary`) establishing quick visual recognition.
- **Generous Rounded Geometry:** Smooth `20px` (`rounded-[20px]`) and `16px` (`rounded-2xl`) corner radii across all card surfaces.
- **Soft Horizon Elevation:** Ambient micro-shadows (`0px 18px 40px rgba(112, 144, 176, 0.12)`) replacing harsh dark drop-shadows.
- **High-Contrast Data Typography:** **Manrope** (`font-display`) for hero metrics, headings, and numbers; **Inter** (`font-sans`) for data tables and controls.
- **Strict Financial Semantics:**
  - Positive Inflow: Mint Green (`#05CD99`)
  - Outflow Expense: Coral Red (`#EE5D50` light / `#FF6B75` dark)
  - Threshold Warning: Warm Amber (`#FFCE20` light / `#FFCE70` dark)
  - Primary Action / Focal Point: Electric Horizon Blue (`#4318FF` light / `#7551FF` dark)
  - Intelligence / AI Voice: Horizon Purple (`#7551E9` light / `#A78BFA` dark)

---

## 2. Core Color Tokens

### 2.1 Light Mode Palette (Horizon Clean FinTech)

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#F4F7FE` | Main application canvas, iconic Horizon soft backdrop |
| `--surface` | `#FFFFFF` | Core card surfaces, modal sheets, table containers |
| `--surface-elevated` | `#F8FAFF` | Secondary cards, pill filters, segmented controls, table headers |
| `--primary` | `#4318FF` | Electric Horizon Blue primary actions, active navigation, brand focal points |
| `--primary-hover` | `#3311CC` | Interactive hover states for primary controls |
| `--secondary` | `#7551E9` | AI intelligence indicators, secondary metrics, automation accents |
| `--secondary-hover` | `#5F3DC4` | Interactive hover states for secondary controls |
| `--accent` | `#3965FF` | Secondary blue, telemetry milestones, chart series |
| `--main-text` / `--foreground` | `#1B2559` | Deep Navy Charcoal primary headlines, metric values, high-contrast labels |
| `--secondary-text` | `#707EAE` | Cool slate supporting descriptions, transaction timestamps, table headers |
| `--muted-text` | `#A3AED0` | Soft periwinkle grey ghost text, input placeholders, disabled elements |
| `--border` | `#E9EDF7` | Delicate structural card borders, dividers, standard container outlines |
| `--border-subtle` | `#F0F4FC` | Internal list item separators, grid lines |
| `--income` | `#05CD99` | Mint Green inflows, positive net cash flow, credit alerts |
| `--expense` | `#EE5D50` | Coral Red outflows, negative cash flow, debit alerts |
| `--warning` | `#FFCE20` | Warm Amber budget thresholds, approaching bill due dates |
| `--info` | `#3965FF` | System advisories, sync states, informational banners |

### 2.2 Dark Mode Palette (Horizon Navy Workspace)

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#0B1437` | Deep navy Horizon canvas |
| `--surface` | `#111C44` | Solid navy card surfaces, ledger cards |
| `--surface-elevated` | `#172554` | Elevated navy surfaces, flyout popovers, dropdowns, input elements |
| `--primary` | `#7551FF` | Electric Blue-Purple active states, primary buttons, focal accents |
| `--primary-hover` | `#8C6DFF` | Interactive hover states for primary controls |
| `--secondary` | `#A78BFA` | Purple accent, AI intelligence indicators, secondary metrics |
| `--accent` | `#5B8CFF` | Secondary blue growth indicators, wealth targets |
| `--main-text` / `--foreground` | `#FFFFFF` | Crisp pure white headlines and values |
| `--secondary-text` | `#A3AED0` | Cool grey supporting descriptions, timestamps |
| `--muted-text` | `#707EAE` | Ghost text, input placeholders |
| `--border` | `#26345E` | Structural card borders, dividers |
| `--border-subtle` | `#1F2C52` | Internal list item separators, grid lines |
| `--income` | `#05CD99` | Mint Green inflows, positive cash flow |
| `--expense` | `#FF6B75` | Coral Red outflows, debit alerts |
| `--warning` | `#FFCE70` | Warm Amber budget thresholds, warnings |
| `--info` | `#5B8CFF` | System notifications, telemetry advisories |

---

## 3. Static Gradient System

Static gradients are used purposefully for visual hierarchy, hero sections, and highlighted financial cards:

- **Brand Gradient:** `linear-gradient(135deg, #4318FF 0%, #7551E9 100%)` (Dark: `linear-gradient(135deg, #7551FF 0%, #A78BFA 100%)`)
- **Soft Blue Gradient:** `linear-gradient(135deg, #EAF0FF 0%, #DCE7FF 100%)` (Dark: `linear-gradient(135deg, #111C44 0%, #172554 100%)`)
- **Purple Accent Gradient:** `linear-gradient(135deg, #F0EAFE 0%, #E2D9FF 100%)`
- **Income Gradient:** `linear-gradient(135deg, #E0F6EF 0%, #C7EDDF 100%)`
- **Expense Gradient:** `linear-gradient(135deg, #FFF0F1 0%, #FFE0E4 100%)`
- **AI Feature Gradient:** `linear-gradient(135deg, #4318FF 0%, #7551E9 55%, #9A72E8 100%)`

---

## 4. Typography System

### 4.1 Font Stack Pairing
- **Primary Display Font:** `Manrope`, system-ui, sans-serif
  - Usage: Landing headlines, Hero titles, KPI summary cards, section headers, net balance callouts.
  - Character: Geometric yet warm, authoritative, contemporary fintech weight.
- **Secondary Body & UI Font:** `Inter`, system-ui, sans-serif
  - Usage: Navigation items, table data cells, form controls, body copy, descriptions.
  - Character: Maximum legibility at small sizes, optimal tabular figure alignment.

### 4.2 Tabular Numerals for Monetary Values
All financial figures across the application MUST use tabular figures:
```css
font-variant-numeric: tabular-nums;
```
This guarantees vertical decimal alignment across table columns, ledger balances, and real-time streaming counters.

---

## 5. Surface Architecture & Card Guidelines

### 5.1 Card Design Rules
- **Solid Opacity:** Surfaces use 100% opaque `--surface` background color.
- **Borders:** Crisp `1px solid var(--border)` outline.
- **Corner Radii:**
  - Metric / KPI cards: `16px–20px` (`rounded-2xl` to `rounded-[20px]`)
  - Modals & dialogs: `20px`–`24px` (`rounded-2xl` to `rounded-3xl`)
  - Action buttons & inputs: `12px` (`rounded-xl`)
  - Badges & pills: `9999px` (`rounded-full`)
- **Shadows:** Controlled, crisp micro-shadows:
  - Default card: `0px 18px 40px rgba(112, 144, 176, 0.12)` (light), `0px 18px 40px rgba(0, 0, 0, 0.35)` (dark)
  - Elevated modal/dropdown: `0px 24px 48px rgba(112, 144, 176, 0.18)`
- **Prohibited:** Any form of `backdrop-filter: blur()`, glowing translucent pseudo-elements, or low-contrast washed-out pastel backgrounds.

---

## 6. Chart & Data Visualization Tokens

All Recharts charts and custom SVGs consume CSS variables from `src/styles/chart.css`:

```css
:root {
  --chart-primary: #4318FF;    /* Electric Horizon Blue */
  --chart-secondary: #7551E9;  /* Horizon Purple */
  --chart-accent: #3965FF;     /* Secondary Blue */
  --chart-emerald: #05CD99;    /* Income Inflow */
  --chart-rose: #EE5D50;       /* Expense Outflow */
  --chart-amber: #FFCE20;      /* Warning / Budget Cap */
  --chart-grid: #E9EDF7;       /* Axis & Grid Lines */
  --chart-tooltip-bg: #FFFFFF; /* High-contrast card */
}

.dark {
  --chart-primary: #7551FF;
  --chart-secondary: #A78BFA;
  --chart-accent: #5B8CFF;
  --chart-emerald: #05CD99;
  --chart-rose: #FF6B75;
  --chart-amber: #FFCE70;
  --chart-grid: #26345E;
  --chart-tooltip-bg: #111C44;
}
```

---

## 7. Compliance Checklist

1. [x] **Zero Glassmorphism:** No translucent frosted cards or backdrop blur.
2. [x] **Strict Token Usage:** All colors mapped to CSS variables / Tailwind tokens.
3. [x] **Dual Theme Parity:** Light and Dark mode verified with equivalent contrast.
4. [x] **Typography Alignment:** Manrope for display headings; Inter for UI & body.
5. [x] **Tabular Figures:** Applied to all balances, currency figures, and percentages.
6. [x] **WCAG 2.2 AA:** Text contrast $\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings.
