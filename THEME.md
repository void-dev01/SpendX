# SPENDX — Professional Theme & Design System Specification (THEME.md)

**Version:** 3.1.0  
**Design Identity:** Minimal Clean × Neon Lime & Emerald FinTech Design  
**Target Platform:** Mobile-First Web Application (PWA / Progressive Web App & Responsive Desktop)  
**Architecture:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion for React, Recharts, Radix UI Primitives, Lucide & Phosphor Icons  
**Authoritative Reference:** Engineering, AI Coding Agents & Product Design  

---

## 1. Executive Summary & Design System

### 1.1 FinTech Aesthetic Principles
SPENDX adopts a modern, high-clarity FinTech design system centered around financial vitality and growth:

- **Soft Clean Canvases:** Soft crisp canvas `#F5F6F4` light mode paired with deep obsidian `#121612` dark mode canvas.
- **Pure Solid Surfaces:** High-contrast pure white `#FFFFFF` light cards and solid `#1B211B` dark cards.
- **Signature Circular Icon Badges:** Rounded icon containers with tinted background fills (`w-9 h-9 rounded-xl bg-surface-subtle text-primary`) establishing quick visual recognition.
- **Generous Rounded Geometry:** Smooth `22px` (`rounded-[22px]`) and `16px` (`rounded-2xl`) corner radii across card surfaces.
- **Controlled Micro-Shadows:** Delicate, ambient micro-shadows replacing harsh dark drop-shadows.
- **High-Contrast Data Typography:** **Manrope** (`font-display`) for hero metrics, headings, and numbers; **Inter** (`font-sans`) for data tables and controls.
- **Strict Financial Semantics:**
  - Positive Inflow & Income: Emerald Green (`#16A34A` light / `#4ADE80` dark)
  - Outflow Expense: Crimson Red (`#DC2626` light / `#F87171` dark)
  - Threshold Warning: Warm Amber (`#D97706` light / `#FBBF24` dark)
  - Primary Action / Focal Point / Growth: Neon Lime (`#A5F12B` / `#93DE22`)
  - Informational / Telemetry: Mint Green (`#05CD99` light / `#34D399` dark)

---

## 2. Core Color Tokens

### 2.1 Light Mode Palette (Clean Minimal FinTech)

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#F5F6F4` | Main application canvas backdrop |
| `--surface` | `#FFFFFF` | Core card surfaces, modal sheets, table containers |
| `--surface-elevated` | `#F0F2ED` | Secondary cards, pill filters, segmented controls, table headers |
| `--primary` | `#A5F12B` | Neon Lime primary actions, active navigation, brand focal points |
| `--primary-hover` | `#93DE22` | Interactive hover states for primary controls |
| `--primary-foreground` | `#111711` | High-contrast dark charcoal on lime actions |
| `--secondary` | `#202420` | Secondary buttons and dark structural accents |
| `--secondary-hover` | `#111711` | Interactive hover states for secondary controls |
| `--accent` | `#A5F12B` | Growth indicators, badges, highlights |
| `--main-text` / `--foreground` | `#202420` | Charcoal primary headlines, metric values, high-contrast labels |
| `--secondary-text` | `#747B74` | Supporting descriptions, transaction timestamps, table headers |
| `--muted-text` | `#A0A69F` | Soft grey ghost text, input placeholders, disabled elements |
| `--border` | `#E8EBE6` | Delicate structural card borders, dividers, standard container outlines |
| `--border-subtle` | `#F0F2ED` | Internal list item separators, grid lines |
| `--income` | `#16A34A` | Emerald Green inflows, positive net cash flow, credit alerts |
| `--expense` | `#DC2626` | Crimson Red outflows, negative cash flow, debit alerts |
| `--warning` | `#D97706` | Warm Amber budget thresholds, approaching bill due dates |
| `--info` | `#05CD99` | Mint Green system advisories, sync states, informational banners |

### 2.2 Dark Mode Palette (Obsidian Minimal Workspace)

| Semantic Token | HEX Value | Purpose & Architectural Usage |
|---|---|---|
| `--background` | `#121612` | Deep obsidian dark canvas |
| `--surface` | `#1B211B` | Solid dark card surfaces, ledger cards |
| `--surface-elevated` | `#242C23` | Elevated surfaces, flyout popovers, dropdowns, input elements |
| `--primary` | `#A5F12B` | Neon Lime active states, primary buttons, focal accents |
| `--primary-hover` | `#93DE22` | Interactive hover states for primary controls |
| `--secondary` | `#F3F6F0` | Crisp white secondary text and buttons |
| `--accent` | `#A5F12B` | Neon Lime growth indicators, wealth targets |
| `--main-text` / `--foreground` | `#F3F6F0` | Crisp pure off-white headlines and values |
| `--secondary-text` | `#ADB6A8` | Cool grey supporting descriptions, timestamps |
| `--muted-text` | `#747B74` | Ghost text, input placeholders |
| `--border` | `#303A2D` | Structural card borders, dividers |
| `--border-subtle` | `#242C23` | Internal list item separators, grid lines |
| `--income` | `#4ADE80` | Bright Emerald inflows, positive cash flow |
| `--expense` | `#F87171` | Soft Coral outflows, debit alerts |
| `--warning` | `#FBBF24` | Warm Amber budget thresholds, warnings |
| `--info` | `#34D399` | Mint Green system notifications, telemetry advisories |

---

## 3. Static Gradient System

Static gradients are used purposefully for visual hierarchy, hero sections, and highlighted financial cards:

- **Brand Gradient:** `linear-gradient(135deg, #A5F12B 0%, #16A34A 100%)` (Dark: `linear-gradient(135deg, #A5F12B 0%, #4ADE80 100%)`)
- **Soft Green Gradient:** `linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)` (Dark: `linear-gradient(135deg, #142416 0%, #1B2E1D 100%)`)
- **Green Accent Gradient:** `linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)` (Dark: `linear-gradient(135deg, #064E3B 0%, #065F46 100%)`)
- **Income Gradient:** `linear-gradient(135deg, #E0F6EF 0%, #C7EDDF 100%)` (Dark: `linear-gradient(135deg, #064E3B 0%, #065F46 100%)`)
- **Expense Gradient:** `linear-gradient(135deg, #FFF0F1 0%, #FFE0E4 100%)` (Dark: `linear-gradient(135deg, #4C0519 0%, #881337 100%)`)
- **AI Feature Gradient:** `linear-gradient(135deg, #A5F12B 0%, #10B981 55%, #059669 100%)` (Dark: `linear-gradient(135deg, #A5F12B 0%, #34D399 55%, #6EE7B7 100%)`)

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
  - Metric / KPI cards: `22px` (`rounded-[22px]`)
  - Modals & dialogs: `20px`–`24px` (`rounded-2xl` to `rounded-3xl`)
  - Action buttons & inputs: `12px` (`rounded-xl`)
  - Badges & pills: `9999px` (`rounded-full`)
- **Shadows:** Controlled, crisp micro-shadows:
  - Default card: `0 1px 3px 0 rgba(0, 0, 0, 0.04)` (light), `0 1px 3px 0 rgba(0, 0, 0, 0.35)` (dark)
  - Elevated modal/dropdown: `0 10px 25px -5px rgba(0, 0, 0, 0.05)`
- **Prohibited:** Any form of `backdrop-filter: blur()`, glowing translucent pseudo-elements, or low-contrast washed-out pastel backgrounds.

---

## 6. Chart & Data Visualization Tokens

All Recharts charts and custom SVGs consume CSS variables from `src/styles/chart.css`:

```css
:root {
  --chart-primary: #A5F12B;    /* Neon Lime */
  --chart-secondary: #202420;  /* Slate Charcoal */
  --chart-accent: #747B74;     /* Medium Neutral */
  --chart-emerald: #16A34A;    /* Income Inflow */
  --chart-rose: #DC2626;       /* Expense Outflow */
  --chart-amber: #D97706;      /* Warning / Budget Cap */
  --chart-grid: #E8EBE6;       /* Axis & Grid Lines */
  --chart-tooltip-bg: #FFFFFF; /* High-contrast card */
  --chart-tooltip-border: #E8EBE6;
}

.dark {
  --chart-primary: #A5F12B;
  --chart-secondary: #F3F6F0;
  --chart-accent: #ADB6A8;
  --chart-emerald: #4ADE80;
  --chart-rose: #F87171;
  --chart-amber: #FBBF24;
  --chart-grid: #303A2D;
  --chart-tooltip-bg: #1B211B;
  --chart-tooltip-border: #303A2D;
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
