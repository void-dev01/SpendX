# SPENDX — Professional Theme & Design System Specification (THEME.md)

**Version:** 1.0.0  
**Target Platform:** Mobile-First Web Application (PWA / Progressive Web App & Responsive Desktop)  
**Architecture:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion for React, Recharts, Radix UI Primitives, Lucide Icons  
**Authoritative Reference:** Engineering, AI Coding Agents & Product Design  

---

## 1. Document Overview

This document establishes the canonical design system, visual identity, component styling tokens, responsive behaviors, and interaction standards for **SPENDX** — an AI-powered personal finance management platform.

Every frontend engineer, AI coding agent, and designer working on SPENDX must adhere strictly to the rules, measurements, tokens, and constraints documented herein. Arbitrary color selection, ad-hoc glassmorphism treatments, non-tokenized spacing, and uncalibrated animations are strictly prohibited.

### 1.1 Core Objectives
1. **Single Source of Truth:** Eliminate visual ambiguity across mobile, tablet, and desktop viewports.
2. **Deterministic Implementation:** Provide copy-pasteable CSS, Tailwind v4 design tokens, Motion for React configurations, and component recipes.
3. **Accessibility-First (WCAG 2.2 AA):** Guarantee high-contrast text ratios, clear focus rings, touch target safety, and non-color-dependent financial semantics.
4. **Mobile Performance:** Balance sophisticated frosted glassmorphism with GPU fill-rate limits, 60fps/120fps frame rates, and safe-area constraints.
5. **Fintech Dignity:** Deliver a premium, futuristic, and friendly product that instills financial trust without feeling like an administrative spreadsheet.

---

## 2. Brand Identity

SPENDX is an AI-powered personal financial intelligence platform designed to replace manual budgeting with proactive, automated, and context-aware wealth management.

### 2.1 Core Capabilities
- **Personal Finance Management:** Comprehensive net worth aggregation, cash flow telemetry, and account tracking.
- **Income & Expense Tracking:** Real-time ledger entries, automated debit/credit reconciliation, and multi-currency support.
- **Automatic Transaction Capture:** Bank feed ingestion, receipt parsing, and recurring charge detection.
- **AI Financial Coach:** Conversational intelligence providing spending post-mortems, predictive runway analysis, and actionable savings nudges.
- **Smart Budgeting:** Dynamic category caps that flex according to recurring obligations and seasonal spending trends.
- **Financial Analytics:** Net cash flow analysis, merchant breakdown, subscription audit, and capital allocation trends.
- **Savings Goals:** Multi-tier goal tracking with milestone forecasting and automated round-ups.
- **Financial Insights:** Context-aware alerts (unusual charges, impending subscription renewals, surplus cash flags).
- **Transaction Categorization:** Intelligent auto-tagging across standard and custom expense envelopes.
- **Monthly Financial Reports:** Automated visual digest of monthly savings velocity, budget adherence, and net worth progress.

### 2.2 Brand Personality Matrix
| Trait | Meaning in SPENDX | Visual & Interaction Manifestation |
|---|---|---|
| **Premium** | Elite institutional quality with consumer warmth | Translucent surfaces, hairline borders, refined typography, generous negative space |
| **Intelligent** | Predictive, context-aware, and analytical | Distinct soft purple and lavender accents denoting AI insights, clean charts, concise metric callouts |
| **Trustworthy** | Bank-grade security and uncompromising accuracy | Clear financial status indicators, high-contrast text, tabular financial numerals |
| **Minimal** | Clutter-free clarity; zero administrative fatigue | Floating cards, uncluttered card hierarchies, progressive disclosure of deep ledgers |
| **Modern** | Contemporary fintech elegance (e.g., Apple Health, Linear, Revolut) | Ice blue and lavender ambient backdrop, pill navigation, subtle physics-based motion |
| **Friendly** | Approachable, non-judgmental financial guidance | Warm neutral secondary copy, rounded card corners (16–24px), uplifting micro-copy |
| **Futuristic** | Forward-thinking, next-generation personal finance | Layered glassmorphism, multi-stop directional gradients, glowing active badges |
| **Professional** | Reliable, robust, and mathematically sound | Rigid 4px grid alignment, systematic responsive states, deterministic data tables |

---

## 3. Design Philosophy

### 3.1 Content-First Glassmorphism
Glassmorphism in SPENDX is a functional mechanism to express structural hierarchy and spatial depth—it is never merely decorative. Floating frosted surfaces allow the ambient background gradient to breathe through the interface, establishing an organic relationship between the canvas and interactive panels while keeping text legibility paramount.

### 3.2 Mobile-First Sovereignty
Over 80% of personal financial check-ins occur on mobile viewports while users are on the move. Every interface element is conceived for one-handed thumb reachability, touch target dimensions ($\ge 44\times 44\text{px}$), and safe-area compliance before being progressively enhanced for tablet and desktop viewports.

### 3.3 Visual Calm vs. Financial Alertness
Personal finance can trigger user anxiety. SPENDX uses calming ice blue, sky blue, and lavender tones to induce composure. Vibrant colors are reserved exclusively for critical transactional state (Income green, Expense rose, Alert amber).

---

## 4. Visual Direction

The visual direction is anchored in **Ice Blue + Sky Blue + Soft Lavender + Pale Purple + Frosted Glassmorphism**.

```
[ Ambient Directional Gradient: Ice Blue -> Sky Blue -> Lavender -> Pale Purple ]
         │
         ├── [ Layer 0: Background Canvas with Soft Radial AI Sheen ]
         ├── [ Layer 1: Frosted Glass Floating Panels (Cards, Lists, Widgets) ]
         ├── [ Layer 2: Fixed Glass Controls (Floating Bottom Nav, Topbar, Sidebar) ]
         └── [ Layer 3: Modal / Sheet Overlays (Dialogs, Quick Actions, Toast Feed) ]
```

### Strict Visual Guardrails:
- **NO** flat edge-to-edge dark grey or grey-900 admin dashboard tables.
- **NO** harsh primary neon colors (`#00FF00`, `#FF00FF`, `#00FFFF`).
- **NO** over-saturated purple or violet gradients that create visual strain.
- **NO** heavy pitch-black drop shadows (`rgba(0,0,0,0.5)`). Shadows must be tinted indigo/slate.
- **NO** stacking more than two blurred glass layers on top of each other.
- **NO** complex glass effects on tiny iconography or individual list bullet points.
- **NO** sacrifice of text contrast for decorative glass opacity.

---

## 5. Color System

### 5.1 Primary Brand Colors
The core brand palette provides structural balance between cool stability (Blues) and innovative intelligence (Purples).

| Name | Token Name | HEX | RGB | Purpose & Architectural Usage |
|---|---|---|---|---|
| **Primary Blue** | `--color-brand-primary` | `#718FE8` | `rgb(113, 143, 232)` | Primary call-to-action buttons, active navigation states, primary chart series, interactive focus rings |
| **Secondary Purple** | `--color-brand-secondary` | `#8B72D6` | `rgb(139, 114, 214)` | Secondary brand actions, secondary chart series, interactive tags, category chips |
| **AI Accent** | `--color-brand-ai` | `#8066CC` | `rgb(128, 102, 204)` | AI Assistant badges, prompt suggestions, predictive cards, AI chat bubbles, assistant sparkles |
| **Ice Blue** | `--color-brand-ice` | `#DDF5FF` | `rgb(221, 245, 255)` | Gradient start anchor, subtle badge backgrounds, high-light card fills |
| **Sky Blue** | `--color-brand-sky` | `#C9E5FF` | `rgb(201, 229, 255)` | Gradient mid-stop, selected radio backgrounds, info badge fills |
| **Lavender** | `--color-brand-lavender` | `#DCD9FF` | `rgb(220, 217, 255)` | Ambient gradient transition stop, AI card borders, secondary chip outlines |
| **Soft Purple** | `--color-brand-soft-purple` | `#EDE4FF` | `rgb(237, 228, 255)` | Ambient gradient end-stop, AI assistant container fills, input hover fills |
| **Deep Indigo** | `--color-brand-deep-indigo` | `#5368A2` | `rgb(83, 104, 162)` | High-contrast iconography, secondary active states, border accents, drop shadow tint |

---

### 5.2 Typography Colors
Text colors are formulated to deliver pristine legibility against frosted white surfaces in light mode and elevated dark surfaces in dark mode.

| Purpose | Token Name | Light HEX | Dark HEX | Contrast Ratio (Light Surface) | Target Usage Scope |
|---|---|---|---|---|---|
| **Primary Text** | `--color-text-primary` | `#263653` | `#F1F5FF` | **10.8:1** (Exceeds AAA) | Primary headings, account balances, transaction titles, modal titles |
| **Secondary Text** | `--color-text-secondary` | `#64748B` | `#A8B5CC` | **4.9:1** (Exceeds AA) | Subtitles, category tags, timestamps, axis labels, form labels |
| **Muted Text** | `--color-text-muted` | `#94A3B8` | `#71829E` | **3.2:1** (AA for $\ge 18\text{px}$) | Placeholder text, disabled hints, table headers, breadcrumbs |
| **Disabled Text** | `--color-text-disabled` | `#A8B3C7` | `#4B5975` | N/A (Disabled state) | Inactive controls, locked account alerts, disabled buttons |
| **Inverse Text** | `--color-text-inverse` | `#FFFFFF` | `#101827` | High Contrast | Text placed over solid Primary Blue buttons, active badge text |

---

### 5.3 Financial Status Colors
Financial status colors must be universally consistent across all ledgers, widgets, badges, and alerts.

> [!IMPORTANT]
> **Accessibility Mandate:** Never communicate financial status through color alone. Every credit, debit, warning, or error must pair its status color with an explicit semantic icon (`ArrowDownLeft`, `ArrowUpRight`, `AlertTriangle`, `CheckCircle2`) and a localized text label.

| Status | HEX | Light Tint Fill (Light Mode) | Dark Tint Fill (Dark Mode) | Border Color | Semantic Meaning & UI Application |
|---|---|---|---|---|---|
| **Income** | `#12866E` | `rgba(18, 134, 110, 0.10)` | `rgba(52, 211, 153, 0.14)` | `rgba(18, 134, 110, 0.25)` | Deposits, payroll, investment returns, cashback, balance additions |
| **Expense** | `#DC5579` | `rgba(220, 85, 121, 0.10)` | `rgba(251, 113, 133, 0.14)` | `rgba(220, 85, 121, 0.25)` | Purchases, bill payments, account deductions, negative budget variances |
| **Warning** | `#C48620` | `rgba(196, 134, 32, 0.10)` | `rgba(245, 158, 11, 0.14)` | `rgba(196, 134, 32, 0.25)` | Approaching budget limits (80-99%), overdue payment reminders |
| **Information**| `#4779C9` | `rgba(71, 121, 201, 0.10)` | `rgba(165, 191, 255, 0.14)` | `rgba(71, 121, 201, 0.25)` | Neutral bank notifications, system tips, scheduled statement alerts |
| **Success** | `#168B83` | `rgba(22, 139, 131, 0.10)` | `rgba(52, 211, 153, 0.14)` | `rgba(22, 139, 131, 0.25)` | Budget goals achieved, debts paid off, recurring transfers scheduled |
| **Error** | `#D94B65` | `rgba(217, 75, 101, 0.10)` | `rgba(244, 63, 94, 0.14)` | `rgba(217, 75, 101, 0.25)` | Failed transactions, account synchronization errors, overdraft alerts |

---

### 5.4 Dual-Mode Fintech Palette & Two-Color Gradient Typography

#### 1. Dual-Mode Surface Architecture
- **Light Mode Surface:** Crisp Pearl base (`#F8FAFC`), Frosted White cards (`rgba(255, 255, 255, 0.78)` with subtle hairline border `rgba(99, 102, 241, 0.14)`), Deep Slate body text (`#0F172A`).
- **Dark Mode Surface:** Deep Obsidian Navy base (`#070B14`), Smoked Glass cards (`rgba(15, 23, 42, 0.72)` with luminous cyan border `rgba(56, 189, 248, 0.16)`), Crisp Ice text (`#F1F5F9`).

#### 2. Reusable Two-Color Gradient Typography Utilities
All gradient typography classes are implemented in `frontend/src/index.css` using `-webkit-background-clip: text`, `background-clip: text`, and `-webkit-text-fill-color: transparent`. To prevent text clipping across font render engines, each utility enforces `display: inline-block`, `padding-bottom: 0.08em`, and `line-height: 1.15`.

- **`.text-gradient-brand`**: Electric Indigo &rarr; Cyber Cyan (`linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)` in Light; `#818CF8 -> #22D3EE` in Dark). Applied to Hero headlines, SPENDX Brand logo, and primary page titles.
- **`.text-gradient-wealth`**: Wealth Emerald &rarr; Cyber Cyan (`linear-gradient(135deg, #059669 0%, #06B6D4 100%)` in Light; `#34D399 -> #22D3EE` in Dark). Applied to Net Worth metrics, Total Balance, and positive cash flow cards.
- **`.text-gradient-ai`**: Royal Violet &rarr; Sky Cyan (`linear-gradient(135deg, #7C3AED 0%, #0284C7 100%)` in Light; `#A78BFA -> #38BDF8` in Dark). Applied to AI Financial Assistant, Gemini badges, and Proactive Advisory titles.

---

---

## 6. Background Gradient System

### 6.1 Light Mode Canvas Gradient
The default SPENDX background is an atmospheric four-stop linear gradient oriented at $135^\circ$. It establishes a calm, airy, and futuristic aesthetic while maintaining pure color fidelity.

```css
/* Canonical Canvas Gradient */
background: linear-gradient(
  135deg,
  #DDF5FF 0%,
  #C9E5FF 38%,
  #DCD9FF 72%,
  #EDE4FF 100%
);
background-attachment: fixed;
```

#### Gradient Specification:
- **Direction:** $135^\circ$ (top-left to bottom-right).
- **Color Stops:**
  - `0%`: Ice Blue (`#DDF5FF`)
  - `38%`: Sky Blue (`#C9E5FF`)
  - `72%`: Soft Lavender (`#DCD9FF`)
  - `100%`: Pale Purple (`#EDE4FF`)
- **Usage:** Applied to the root `body` element and full-screen view containers.
- **Layering:** Sits at Layer 0 (the foundation beneath floating glass panels).

#### Optional Subtle Radial Highlights (Canvas Sheen):
To simulate dynamic depth beneath floating glass cards without GPU overhead:
```css
/* Background Canvas with Non-Animated Subtle Radial Highlights */
.bg-ambient-sheen {
  background-image: 
    radial-gradient(circle at 15% 20%, rgba(201, 229, 255, 0.45) 0%, transparent 45%),
    radial-gradient(circle at 85% 75%, rgba(237, 228, 255, 0.50) 0%, transparent 50%),
    linear-gradient(135deg, #DDF5FF 0%, #C9E5FF 38%, #DCD9FF 72%, #EDE4FF 100%);
  background-attachment: fixed;
}
```

### 6.2 Dark Mode Canvas Gradient
Dark mode replaces the pastel gradient with a deep, cosmic navy-to-midnight gradient that protects eyes in low-light environments without degrading into lifeless monochrome black.

```css
/* Dark Mode Canvas Gradient */
.dark body {
  background: linear-gradient(
    145deg,
    #101827 0%,
    #131E33 45%,
    #17243C 100%
  );
  background-attachment: fixed;
}
```

### 6.3 Performance Considerations
1. **Fixed Attachment:** Set `background-attachment: fixed` on the root container so viewport scrolling does not trigger continuous background gradient redraws.
2. **Zero Animated Gradients on Canvas:** The global canvas gradient must remain static. Animated gradient loops trigger continuous GPU composite passes that throttle mobile battery life.

---

## 7. Glassmorphism System

The SPENDX glass system creates physical hierarchy through translucent white planes, hairline borders, and indigo-tinted soft drop shadows.

```
┌────────────────────────────────────────────────────────┐
│  Glass Border: rgba(255, 255, 255, 0.80) [Hairline 1px]│
│  ┌──────────────────────────────────────────────────┐  │
│  │ Glass Surface: rgba(255, 255, 255, 0.62)          │  │
│  │ Filter: backdrop-blur(20px)                      │  │
│  │ Shadow: 0 10px 32px 0 rgba(83, 104, 162, 0.08)   │  │
│  │ Inner Glow: inset 0 1px 1px 0 rgba(255,255,255,0.9)│
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 7.1 Standard Glass Panel Specification
| Property | Light Mode Specification | Dark Mode Specification |
|---|---|---|
| **Background Fill** | `rgba(255, 255, 255, 0.62)` | `rgba(255, 255, 255, 0.08)` |
| **Backdrop Filter** | `blur(20px) saturate(160%)` | `blur(20px) saturate(140%)` |
| **Border** | `1px solid rgba(255, 255, 255, 0.80)` | `1px solid rgba(255, 255, 255, 0.14)` |
| **Border Radius** | `20px` (`rounded-2xl` or `rounded-[20px]`) | `20px` (`rounded-2xl` or `rounded-[20px]`) |
| **Box Shadow** | `0 10px 32px -4px rgba(83, 104, 162, 0.08), 0 4px 12px -2px rgba(83, 104, 162, 0.04)` | `0 10px 32px -4px rgba(0, 0, 0, 0.40), 0 4px 12px -2px rgba(0, 0, 0, 0.25)` |
| **Specular Highlight** | `inset 0 1px 1px 0 rgba(255, 255, 255, 0.85)` | `inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)` |

---

### 7.2 Glass Variants Matrix

Every surface in SPENDX belongs to one of the following 8 standard glass variants:

| Variant | Purpose & Scope | Bg Opacity | Border Opacity | Blur | Shadow | Hover State | Active State | Disabled State |
|---|---|---|---|---|---|---|---|---|
| **1. Glass Primary** | Standard cards, balances, stats | `0.62` (`rgba(255,255,255,0.62)`) | `0.80` (`rgba(255,255,255,0.80)`) | `20px` | `shadow-glass-base` | Static / No change | Static / No change | Opacity `0.5`, no shadow |
| **2. Glass Secondary** | Nested cards, category breakdowns | `0.45` (`rgba(255,255,255,0.45)`) | `0.65` (`rgba(255,255,255,0.65)`) | `16px` | `shadow-glass-sm` | Static / No change | Static / No change | Opacity `0.5`, no shadow |
| **3. Glass Elevated** | Floating popovers, tooltips, flyouts | `0.82` (`rgba(255,255,255,0.82)`) | `0.95` (`rgba(255,255,255,0.95)`) | `24px` | `shadow-glass-lg` | Static | Static | N/A |
| **4. Glass Subtle** | Filter chips, metadata tags, table headers | `0.30` (`rgba(255,255,255,0.30)`) | `0.50` (`rgba(255,255,255,0.50)`) | `12px` | None | Bg `0.50`, border `0.70` | Bg `0.65`, border `#718FE8` | Cursor not-allowed, opacity `0.4` |
| **5. Glass Interactive** | Clickable list rows, goal cards, buttons | `0.58` (`rgba(255,255,255,0.58)`) | `0.75` (`rgba(255,255,255,0.75)`) | `18px` | `shadow-glass-base` | `y: -2px`, bg `0.75`, shadow elevated | `scale: 0.98`, bg `0.85` | Opacity `0.45`, pointer-events none |
| **6. Glass Navigation** | Mobile bottom nav, desktop sidebar, topbar | `0.70` (`rgba(255,255,255,0.70)`) | `0.85` (`rgba(255,255,255,0.85)`) | `24px` | `shadow-glass-nav` | Nav item hover: bg white/40 | Nav item active: bg `#718FE8`, text white | N/A |
| **7. Glass Modal** | Dialog popups, bottom sheet containers | `0.88` (`rgba(255,255,255,0.88)`) | `1.00` (`rgba(255,255,255,1.00)`) | `28px` | `shadow-glass-modal` | Static | Static | N/A |
| **8. Glass Input** | Text inputs, search fields, amount inputs | `0.50` (`rgba(255,255,255,0.50)`) | `0.80` (`rgba(255,255,255,0.80)`) | `14px` | `inset 0 1px 2px rgba(0,0,0,0.02)` | Bg `0.65`, border `#718FE8`/50 | Focus: bg `0.85`, ring `2px #718FE8` | Bg `0.25`, text muted, not-allowed |

---

### 7.3 Glass Design & Accessibility Rules
1. **Maintain Text Contrast:** Black text on a standard glass card must use `--color-text-primary` (`#263653`), guaranteeing an APCA/WCAG ratio $> 10:1$.
2. **Never Stack Blurs:** Never place a blurred card inside a blurred container over a blurred modal. Stacking `backdrop-filter: blur(...)` creates extreme GPU fillrate degradation on mobile devices and causes severe visual fringing.
3. **Avoid Heavy Blur on Large Mobile Surfaces:** Keep blur radii $\le 20\text{px}$ on mobile screens.
4. **Data Grid Exemption:** Dense financial audit tables with $> 20$ rows must use an opaque surface (`rgba(255, 255, 255, 0.94)` in light mode, `#17243C` in dark mode) to eliminate visual noise behind financial numerals.
5. **Consistent Border Treatment:** All borders are hairline ($1\text{px}$) with higher opacity than their underlying background to create a defined glass edge.
6. **Hardware Fallback Mandate:** All glass classes must implement a `@supports not (backdrop-filter: blur(20px))` fallback that falls back gracefully to a solid tinted fill.

---

### 7.4 Glass Component Hierarchy
Surface hierarchy maps directly to visual elevation and cognitive importance:

| Hierarchy Level | Treatment Type | Blur Radius | Components Assigned | Rationale |
|---|---|---|---|---|
| **Level 4 (Top Overlays)** | **Strong Glass** | `28px` | Dialogs, Confirmation Modals, Mobile Bottom Sheets | Must isolate content from background activity |
| **Level 3 (Fixed Controls)** | **Navigation Glass** | `24px` | Mobile Bottom Nav, Desktop Sidebar, Topbar | Persistent anchors floating over scrolling content |
| **Level 2 (Content Panels)** | **Medium Glass** | `18–20px` | Dashboard Cards, Balance Hero, Budget Widgets, Goal Cards | Standard readable canvas for primary financial stats |
| **Level 1 (Sub-Elements)** | **Subtle Glass** | `12–14px` | Form inputs, search fields, filter chips, category badges | Blends softly into parent card containers |
| **Level 0 (Dense Data)** | **Solid Surface** | None (`0px`) | Dense transaction tables, CSV audit grids, bank connect iframes | Zero transparency ensures 100% numerical legibility |

---

## 8. Light Theme Architecture

Light theme is the hero experience of SPENDX, radiating a crystal-clear, clean, and optimistic fintech atmosphere.

```css
:root {
  /* Canvas & Base */
  --bg-gradient: linear-gradient(135deg, #DDF5FF 0%, #C9E5FF 38%, #DCD9FF 72%, #EDE4FF 100%);
  --bg-canvas: #EBF3FC;
  
  /* Text */
  --text-primary: #263653;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --text-disabled: #A8B3C7;
  --text-inverse: #FFFFFF;

  /* Surfaces & Glass */
  --glass-bg-primary: rgba(255, 255, 255, 0.62);
  --glass-border-primary: rgba(255, 255, 255, 0.80);
  --glass-bg-secondary: rgba(255, 255, 255, 0.45);
  --glass-border-secondary: rgba(255, 255, 255, 0.65);
  --glass-bg-elevated: rgba(255, 255, 255, 0.82);
  --glass-border-elevated: rgba(255, 255, 255, 0.95);
  --glass-bg-subtle: rgba(255, 255, 255, 0.30);
  --glass-border-subtle: rgba(255, 255, 255, 0.50);
  --glass-bg-nav: rgba(255, 255, 255, 0.70);
  --glass-border-nav: rgba(255, 255, 255, 0.85);
  --glass-bg-modal: rgba(255, 255, 255, 0.88);
  --glass-border-modal: rgba(255, 255, 255, 1.00);
  --glass-bg-input: rgba(255, 255, 255, 0.50);
  --glass-border-input: rgba(255, 255, 255, 0.80);

  /* Actions & Brand */
  --action-primary: #718FE8;
  --action-primary-hover: #5E7CD5;
  --action-primary-active: #4F6DC6;
  --action-secondary: #8B72D6;
  --action-secondary-hover: #7A61C5;
  --action-ai: #8066CC;
  --action-ai-hover: #6E54BC;

  /* Financial Semantics */
  --status-income: #12866E;
  --status-income-tint: rgba(18, 134, 110, 0.10);
  --status-expense: #DC5579;
  --status-expense-tint: rgba(220, 85, 121, 0.10);
  --status-warning: #C48620;
  --status-warning-tint: rgba(196, 134, 32, 0.10);
  --status-info: #4779C9;
  --status-info-tint: rgba(71, 121, 201, 0.10);
  --status-success: #168B83;
  --status-success-tint: rgba(22, 139, 131, 0.10);
  --status-error: #D94B65;
  --status-error-tint: rgba(217, 75, 101, 0.10);

  /* Shadows */
  --shadow-glass-sm: 0 4px 16px -2px rgba(83, 104, 162, 0.06);
  --shadow-glass-base: 0 10px 32px -4px rgba(83, 104, 162, 0.08), 0 4px 12px -2px rgba(83, 104, 162, 0.04);
  --shadow-glass-lg: 0 16px 40px -6px rgba(83, 104, 162, 0.14), 0 6px 16px -3px rgba(83, 104, 162, 0.08);
  --shadow-glass-nav: 0 12px 36px -4px rgba(83, 104, 162, 0.12), 0 2px 8px -1px rgba(83, 104, 162, 0.06);
  --shadow-glass-modal: 0 24px 64px -12px rgba(83, 104, 162, 0.22);
}
```

---

## 9. Dark Theme Architecture

Dark theme maintains the SPENDX visual identity using a deep navy foundation (`#101827`), secondary background (`#17243C`), elevated surface (`#1E293B`), soft glowing accents, and high-translucency glass panels (`rgba(255, 255, 255, 0.08)`).

### 9.1 Dark Mode Token System
| Purpose | HEX / RGBA Value | Role in Dark Mode |
|---|---|---|
| **Main Background** | `#101827` | Global canvas foundation |
| **Secondary Background** | `#17243C` | Outer shell, sidebar, table containers |
| **Elevated Surface** | `#1E293B` | Popovers, dropdown menus, card fallbacks |
| **Primary Text** | `#F1F5FF` | High contrast headings and numbers (AAA) |
| **Secondary Text** | `#A8B5CC` | Subtitles, labels, timestamps |
| **Muted Text** | `#71829E` | Secondary captions, placeholders |
| **Primary Accent** | `#A5BFFF` | Primary buttons, active tab indicators |
| **Purple Accent** | `#B9A4FF` | AI insights, category chips |
| **Income** | `#34D399` | Inflow transactions, green charts |
| **Expense** | `#FB7185` | Outflow transactions, debit alerts |
| **Glass Background** | `rgba(255, 255, 255, 0.08)` | Standard dark glass panel |
| **Glass Border** | `rgba(255, 255, 255, 0.14)` | Hairline translucent border |
| **Glass Blur** | `20px` | Backdrop filter blur |

```css
.dark {
  /* Canvas & Base */
  --bg-gradient: linear-gradient(145deg, #101827 0%, #131E33 45%, #17243C 100%);
  --bg-canvas: #101827;
  
  /* Text */
  --text-primary: #F1F5FF;
  --text-secondary: #A8B5CC;
  --text-muted: #71829E;
  --text-disabled: #4B5975;
  --text-inverse: #101827;

  /* Surfaces & Glass */
  --glass-bg-primary: rgba(255, 255, 255, 0.08);
  --glass-border-primary: rgba(255, 255, 255, 0.14);
  --glass-bg-secondary: rgba(255, 255, 255, 0.05);
  --glass-border-secondary: rgba(255, 255, 255, 0.10);
  --glass-bg-elevated: #1E293B;
  --glass-border-elevated: rgba(255, 255, 255, 0.18);
  --glass-bg-subtle: rgba(255, 255, 255, 0.04);
  --glass-border-subtle: rgba(255, 255, 255, 0.08);
  --glass-bg-nav: rgba(23, 36, 60, 0.85);
  --glass-border-nav: rgba(255, 255, 255, 0.16);
  --glass-bg-modal: rgba(23, 36, 60, 0.94);
  --glass-border-modal: rgba(255, 255, 255, 0.20);
  --glass-bg-input: rgba(255, 255, 255, 0.06);
  --glass-border-input: rgba(255, 255, 255, 0.16);

  /* Actions & Brand */
  --action-primary: #A5BFFF;
  --action-primary-hover: #BFD2FF;
  --action-primary-active: #8EA8E8;
  --action-secondary: #B9A4FF;
  --action-ai: #A285FF;
  --action-ai-hover: #B79EFF;

  /* Financial Semantics */
  --status-income: #34D399;
  --status-income-tint: rgba(52, 211, 153, 0.15);
  --status-expense: #FB7185;
  --status-expense-tint: rgba(251, 113, 133, 0.15);
  --status-warning: #FBBF24;
  --status-warning-tint: rgba(251, 191, 36, 0.15);
  --status-info: #60A5FA;
  --status-info-tint: rgba(96, 165, 250, 0.15);
  --status-success: #34D399;
  --status-success-tint: rgba(52, 211, 153, 0.15);
  --status-error: #FB7185;
  --status-error-tint: rgba(251, 113, 133, 0.15);

  /* Shadows */
  --shadow-glass-sm: 0 4px 16px -2px rgba(0, 0, 0, 0.35);
  --shadow-glass-base: 0 10px 32px -4px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.25);
  --shadow-glass-lg: 0 16px 40px -6px rgba(0, 0, 0, 0.65), 0 6px 16px -3px rgba(0, 0, 0, 0.35);
  --shadow-glass-nav: 0 12px 36px -4px rgba(0, 0, 0, 0.50), 0 2px 8px -1px rgba(0, 0, 0, 0.30);
  --shadow-glass-modal: 0 24px 64px -12px rgba(0, 0, 0, 0.80);
}
```

---

### 9.2 Dark Mode Component Adaptations
| Component | Light Mode Appearance | Dark Mode Appearance |
|---|---|---|
| **Standard Card** | `rgba(255,255,255,0.62)`, white border, soft indigo shadow | `rgba(255,255,255,0.08)`, border `white/14`, deep black shadow |
| **Floating Bottom Nav** | `rgba(255,255,255,0.70)`, border `white/85` | `rgba(23,36,60,0.85)`, border `white/16` |
| **Floating Sidebar** | `rgba(255,255,255,0.70)`, border `white/85` | `rgba(23,36,60,0.85)`, border `white/16` |
| **Topbar** | `rgba(255,255,255,0.70)`, border `white/85` | `rgba(23,36,60,0.85)`, border `white/16` |
| **Inputs** | `rgba(255,255,255,0.50)`, border `white/80`, text `#263653` | `rgba(255,255,255,0.06)`, border `white/16`, text `#F1F5FF` |
| **Modals / Sheets** | `rgba(255,255,255,0.88)`, border `white` | `rgba(23,36,60,0.94)`, border `white/20` |
| **Transaction Rows**| Hover: white/75 | Hover: white/12 |
| **Primary Button** | `#718FE8` solid, white text | `#A5BFFF` solid, text `#101827` |
| **AI Assistant Bubble**| White fill with lavender border | `#1E293B` fill with lavender border (`rgba(162,133,255,0.3)`) |

---

### 9.3 Theme Switching & Anti-Flash Engine
SPENDX supports three distinct theme modes: `'light'`, `'dark'`, and `'system'`.

```
User Preference Resolution:
 ├── 1. Check localStorage key: 'spendx_theme'
 ├── 2. If 'light' or 'dark' ──> Apply explicit class to documentElement
 └── 3. If 'system' or null ──> Listen to window.matchMedia('(prefers-color-scheme: dark)')
```

#### Zero-Flash Initialization Script (Injected in `index.html` `<head>`):
```html
<script>
  (function() {
    try {
      const stored = localStorage.getItem('spendx_theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark) || (stored === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  })();
</script>
```

---

## 10. Typography System

The primary typeface for SPENDX is **Inter** (`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).

### 10.1 Typography Hierarchy & Scale
| Level | Font Size (Mobile) | Font Size (Desktop) | Line Height | Weight | Letter Spacing | Token / Tailwind Class | Intended Purpose |
|---|---|---|---|---|---|---|---|
| **Display Heading** | `28px (1.75rem)` | `36px (2.25rem)` | `1.15` | Bold (700) | `-0.025em` | `text-display` | Total Net Worth, Hero Balance |
| **Page Heading** | `22px (1.375rem)` | `26px (1.625rem)` | `1.20` | SemiBold (600) | `-0.020em` | `text-page-title` | Page Headers ("Analytics", "AI Coach") |
| **Section Heading**| `18px (1.125rem)` | `20px (1.25rem)` | `1.30` | SemiBold (600) | `-0.015em` | `text-section-title` | Card Group Titles, Month Dividers |
| **Card Heading** | `15px (0.9375rem)`| `16px (1.0rem)` | `1.35` | Medium (500) | `-0.010em` | `text-card-title` | Individual Widget Titles, Budget Names |
| **Body Primary** | `14px (0.875rem)` | `15px (0.9375rem)`| `1.50` | Regular (400) | `0em` | `text-body` | Explanatory copy, AI Coach messages |
| **Body Secondary**| `13px (0.8125rem)`| `13px (0.8125rem)`| `1.45` | Regular (400) | `+0.005em` | `text-body-sm` | Transaction categories, timestamps |
| **Caption / Meta** | `11px (0.6875rem)`| `12px (0.75rem)` | `1.40` | Medium (500) | `+0.015em` | `text-caption` | Pill badges, table column headers |
| **Button Text** | `14px (0.875rem)` | `14px (0.875rem)` | `1.0` | SemiBold (600) | `+0.005em` | `text-button` | Interactive buttons, navigation links |

---

### 10.2 Tabular Numerals for Financial Data
All monetary amounts, account numbers, percentages, and ledger columns **must** activate tabular lining figures:
```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1, "cv01" 1;
}
```
This guarantees identical column character widths so decimal points align vertically in transaction lists.

### 10.3 Hero Balance Treatment
Large balance amounts must look prominent without overwhelming the interface:
- **Font Size:** `28px` on mobile, `36px` on desktop.
- **Font Weight:** SemiBold (`600`) or Bold (`700`).
- **Currency Symbol:** `text-lg font-medium text-slate-500` positioned baseline-aligned.
- **Decimal Portion:** `text-lg font-medium text-slate-400` slightly de-emphasized compared to whole numbers.

---

## 11. Spacing System

SPENDX adheres to a strict 4-point spacing grid.

### 11.1 Spacing Token Scale
| Token | Pixel Equivalent | Rem Value | Common Use Case |
|---|---|---|---|
| `--space-1` | `4px` | `0.25rem` | Icon-to-label inner gap, hairline dividers |
| `--space-2` | `8px` | `0.50rem` | Button icon gap, badge padding, compact chip gap |
| `--space-3` | `12px` | `0.75rem` | Form field interior padding, list row inner spacing |
| `--space-4` | `16px` | `1.00rem` | Standard mobile card padding, grid row gutter |
| `--space-5` | `20px` | `1.25rem` | Floating panel outer separation, dialog interior padding |
| `--space-6` | `24px` | `1.50rem` | Desktop card padding, section separator |
| `--space-8` | `32px` | `2.00rem` | Dashboard widget vertical spacing, page header bottom margin |
| `--space-10`| `40px` | `2.50rem` | Major dashboard grid gap, modal vertical margins |
| `--space-12`| `48px` | `3.00rem` | Hero balance section vertical padding |
| `--space-16`| `64px` | `4.00rem` | Desktop page bottom clearance, marketing section spacing |

---

### 11.2 Panel Separation Standards
Floating glass panels must maintain visible separation from each other to prevent blurring boundaries:
- **Mobile (`< 768px`):** Minimum `12px` gap (`gap-3`) between vertically stacked cards. Page padding: `px-4 pt-4 pb-28`.
- **Tablet / Desktop (`>= 768px`):** Minimum `20px` gap (`gap-5`) between grid cards. Page padding: `px-8 pt-8 pb-12`.
- **Floating Nav Clearance:** Bottom container requires `pb-28` on mobile so the floating navigation bar never obscures content.
- **Form Spacing:** Vertical gap of `16px` (`gap-4`) between standard form fields; `24px` (`gap-6`) between field groups.

---

## 12. Layout System

### 12.1 Container & Max Widths
To prevent wide displays from stretching financial widgets into unreadable horizontal strips, content is bound to defined container widths:
- **Mobile Container:** `100%` width with `px-4` outer gutters.
- **Tablet Container:** `max-w-3xl` (`768px`) centered.
- **Desktop Main Workspace:** `max-w-6xl` (`1152px`).
- **Ultra-Wide Limit:** `max-w-7xl` (`1280px` centered with `mx-auto`).

---

## 13. Responsive Breakpoints

SPENDX is designed **Mobile-First**. Every component is constructed for narrow touchscreens and progressively enhanced as screen real estate increases.

| Breakpoint Key | Min Width | Max Width | Primary Target Devices | Responsive Strategy |
|---|---|---|---|---|
| `mobile-sm` | `320px` | `374px` | iPhone SE (1st/2nd/3rd gen), Galaxy A10 | Single-column cards, reduced horizontal padding (`px-3`), icon-only subheaders, compact stat cards |
| `mobile-std` | `375px` | `430px` | iPhone 14/15/16, Pixel 8, Galaxy S24 | Hero balance card, stacked stat cards, floating bottom navigation, full touch targets |
| `mobile-lg` | `431px` | `767px` | iPhone Plus/Pro Max, Pixel Pro, Foldables | 2-column stat cards, enriched transaction row metadata, horizontal action pills |
| `tablet` | `768px` | `1023px` | iPad 10th gen, iPad Air, Galaxy Tab S9 | 2-column dashboard grid, compact sidebar rail (`w-20`), floating topbar |
| `desktop` | `1024px` | `1439px` | MacBook Air, 14-inch laptops, 1080p monitors | Full floating sidebar (`w-64`), floating topbar, 3-column dashboard widgets |
| `desktop-lg` | `1440px` | `∞` | 27-inch Studio Display, 4K monitors | Centered fixed workspace (`max-w-7xl`), auxiliary AI insight drawer |

---

## 14. Navigation Design

```
MOBILE NAVIGATION LAYOUT:
┌────────────────────────────────────────────────────────┐
│  [ Topbar: Logo / Notification Pill / Profile Avatar ] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [ Scrollable Main Content Workspace ]                 │
│                                                        │
├────────────────────────────────────────────────────────┤
│  [ Floating Frosted Glass Bottom Nav: 5 Tabs ]         │
│  Safe-Area Padding: env(safe-area-inset-bottom)        │
└────────────────────────────────────────────────────────┘

DESKTOP NAVIGATION LAYOUT:
┌──────────────┬─────────────────────────────────────────┐
│ [ Floating   │ [ Floating Glass Topbar: Search & Tools]│
│   Glass      ├─────────────────────────────────────────┤
│   Sidebar:   │                                         │
│   Logo       │ [ Main Content Workspace: Grid Layout ] │
│   Nav Groups │                                         │
│   Profile ]  │                                         │
└──────────────┴─────────────────────────────────────────┘
```

### 14.1 Mobile Navigation (Floating Frosted Bottom Bar)
The mobile navigation bar is the central touchpoint on handheld devices.

```html
<!-- Floating Glass Bottom Bar Container -->
<nav class="fixed bottom-3 inset-x-3 z-50 mx-auto max-w-md h-16 rounded-full 
            bg-white/70 dark:bg-[#17243C]/85 backdrop-blur-xl 
            border border-white/80 dark:border-white/15 
            shadow-[0_12px_36px_-4px_rgba(83,104,162,0.18)] 
            px-3 flex items-center justify-around 
            pb-[env(safe-area-inset-bottom)]">
  <!-- 5 Navigation Items -->
</nav>
```

#### The 5 Primary Mobile Tabs:
1. **Home (`/dashboard`):** Icon `LayoutDashboard` — Financial overview, total balance, rapid actions.
2. **Activity (`/transactions`):** Icon `ReceiptText` — Full ledger, categorization, search.
3. **AI (`/ai-coach`):** Icon `Sparkles` — AI Coach conversation with glowing lavender badge indicator.
4. **Wallet (`/budgets`):** Icon `PieChart` — Budgets, accounts, cards, spending envelopes.
5. **More (`/settings`):** Icon `Menu` — Savings goals, analytics, reports, security, profile.

#### Mobile Nav Specifications:
- **Touch Target:** At least **$48\times 48\text{px}$** hit target for each tab item.
- **Active State:** Animated pill indicator (`layoutId="activeTabPill"`) with background `#718FE8` and white icon/label.
- **Inactive State:** `--color-text-secondary` (`#64748B`) with smooth opacity transitions.
- **Safe Area Inset:** Strict inclusion of `env(safe-area-inset-bottom)`.
- **More Menu:** Tapping "More" triggers an animated bottom sheet with secondary destinations (Savings, Analytics, Reports, Settings).

---

### 14.2 Desktop Navigation (Floating Glass Sidebar & Topbar)
On desktop screens ($\ge 1024\text{px}$), navigation transitions to a dual floating system:

1. **Floating Sidebar (`w-64 fixed left-5 top-5 bottom-5 z-40`):**
   - **Container:** Glass Navigation (`bg-white/70 dark:bg-[#17243C]/85 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-glass-nav`).
   - **Brand Block:** SPENDX logo with subtle AI crystal shimmer.
   - **Navigation Groups:**
     - *Overview:* Dashboard, Transactions.
     - *Planning:* Budgets, Savings Goals, Analytics.
     - *Intelligence:* AI Financial Coach (highlighted with purple badge).
   - **Collapsible Mode:** Can be collapsed to an icon-only rail (`w-20`) to maximize data workspace.
   - **User Profile Area:** Avatar, tier status ("SPENDX Pro"), and logout trigger.
2. **Floating Topbar (`fixed top-5 left-72 right-5 h-16 z-30`):**
   - **Container:** Glass Navigation with `rounded-2xl px-6 flex items-center justify-between`.
   - **Page Title & Breadcrumb:** Current location indicator.
   - **Global Search:** Glass input field (`⌘K` shortcut trigger).
   - **Quick Actions:** Notification Bell with unread counter, Theme Switcher toggle, "+ Quick Add" CTA button.

---

### 14.3 Tablet Navigation (Adaptive Rail)
On tablet screens (`768px – 1023px`), navigation adapts to the screen width:
- **Sidebar:** Defaults to an icon-only rail (`w-20`) with tooltips on hover/tap.
- **Topbar:** Spans from `left-28` to `right-5`.
- **Content Grid:** 2-column adaptive layout with touch-friendly spacing.

---

## 15. Component Design Rules

### 15.1 Buttons
Buttons must feel tactile, responsive, and legible.

| Variant | Height / Padding | Radius | Typography | Background Fill | Border | Hover State | Active / Press | Focus State | Disabled State | Loading State |
|---|---|---|---|---|---|---|---|---|---|---|
| **Primary** | `44px` / `px-5` | `rounded-xl` (`12px`) | `14px` SemiBold | `#718FE8` | None | Bg `#5E7CD5`, shadow `0 4px 14px rgba(113,143,232,0.4)` | `scale: 0.98`, bg `#4F6DC6` | Ring `2px #718FE8`, offset `2px` | Opacity `0.45`, not-allowed, no shadow | Spinner replaces icon, label dimmed |
| **Secondary**| `44px` / `px-5` | `rounded-xl` (`12px`) | `14px` SemiBold | `rgba(255,255,255,0.70)` | `1px solid rgba(255,255,255,0.9)` | Bg `rgba(255,255,255,0.95)`, shadow glass | `scale: 0.98` | Ring `2px #718FE8`, offset `2px` | Opacity `0.45`, not-allowed | Spinner replaces icon |
| **AI Action**| `44px` / `px-5` | `rounded-xl` (`12px`) | `14px` SemiBold | `linear-gradient(135deg, #718FE8, #8B72D6)` | `1px solid rgba(255,255,255,0.4)` | Shadow `0 4px 16px rgba(139,114,214,0.45)` | `scale: 0.98` | Ring `2px #8066CC`, offset `2px` | Opacity `0.45`, not-allowed | Shimmer pulse animation |
| **Outline** | `44px` / `px-5` | `rounded-xl` (`12px`) | `14px` SemiBold | `transparent` | `1.5px solid #718FE8` | Bg `rgba(113,143,232,0.08)` | `scale: 0.98` | Ring `2px #718FE8` | Opacity `0.40`, border muted | Spinner with outline color |
| **Ghost** | `40px` / `px-3` | `rounded-lg` (`8px`) | `14px` Medium | `transparent` | None | Bg `rgba(255,255,255,0.50)`, text `#263653` | `scale: 0.98` | Ring `2px #718FE8` | Opacity `0.40` | Spinner replaces icon |
| **Destructive**| `44px` / `px-5` | `rounded-xl` (`12px`) | `14px` SemiBold | `#DC5579` | None | Bg `#C43F62`, shadow `0 4px 14px rgba(220,85,121,0.35)` | `scale: 0.98` | Ring `2px #DC5579` | Opacity `0.45` | Spinner replaces icon |
| **Icon Button**| `44x44px` square| `rounded-xl` (`12px`) | N/A | `rgba(255,255,255,0.60)` | `1px solid rgba(255,255,255,0.8)` | `scale: 1.05`, bg `rgba(255,255,255,0.85)` | `scale: 0.95` | Ring `2px #718FE8` | Opacity `0.40` | Spinner inside square |
| **FAB (Mobile)**| `56x56px` square| `rounded-full` | N/A | `linear-gradient(135deg, #718FE8, #8B72D6)` | `1px solid rgba(255,255,255,0.4)` | Scale `1.05`, shadow `0 10px 28px rgba(113,143,232,0.6)`| `scale: 0.95` | Ring `3px #718FE8` | Hidden | Spinner inside FAB |

---

### 15.2 Cards
Cards represent distinct financial data domains and must always use the standard glass specification.

1. **Standard Glass Card:** Base container for metric groupings. Padding: `p-4` (mobile) / `p-6` (desktop). Rounded corners: `rounded-2xl` (`20px`).
2. **Financial Stat Card:** Displays balance metrics (Income, Expense, Net Flow). Houses semantic icon badge (Income green, Expense rose), value in tabular figures, and percentage delta indicator.
3. **AI Insight Card:** Highlighted with a lavender-tinted top border (`2px solid #8066CC`) and a gentle AI sparkle badge. Features concise recommendations with quick-action buttons.
4. **Chart Card:** Container for Recharts visualizations. Features chart header, time-window segmented controls, custom glass tooltips, and fixed mobile chart heights (`180–220px`).
5. **Transaction Card / Row:** Clickable list item (`min-h-[64px]`) featuring category icon in circle badge, title, subtitle timestamp, and right-aligned tabular amount with `+` or `-` indicator.
6. **Budget Card:** Contains budget category title, spent vs total amount, and a multi-stage animated progress bar (Green $\le 79\%$, Warning $80–99\%$, Rose $\ge 100\%$).
7. **Savings Goal Card:** Visualizes target milestone with circular or horizontal progress bar, accumulated round-ups, and forecasted completion date.

---

### 15.3 Forms
Forms require strong visual affordance so users clearly identify active inputs.

- **Text Inputs:** Height `44px`, padding `px-4`, font size `14px`, surface fill `rgba(255, 255, 255, 0.50)` (Light) / `rgba(255, 255, 255, 0.06)` (Dark), border `1px solid rgba(255, 255, 255, 0.80)`.
- **Search Inputs:** Left-aligned `Search` icon (`size-4 text-slate-400`), right-aligned clear (`X`) button, placeholder *"Search transactions, merchants, categories..."*.
- **Amount Inputs:** Specialized financial input with currency prefix (`$`), oversized typography (`28px` to `36px`), bold tabular numbers, and dynamic font auto-scaling.
- **Select Fields & Dropdowns:** Trigger styled as a glass button with right-aligned `ChevronDown`, popover rendered in Glass Elevated (`blur-24px`, shadow-lg).
- **Date Pickers:** Calendar popup in Glass Elevated with highlighted selected range using Primary Blue (`#718FE8`).
- **Checkboxes & Radio Buttons:** Minimum hit target `44x44px` on mobile, active indicator `#718FE8` with white checkmark.
- **Textareas:** Minimum height `96px`, padding `p-3`, rounded `12px`, auto-resize support.

#### Form Validation States:
| State | Border Styling | Ring / Focus | Helper Text / Icon |
|---|---|---|---|
| **Normal** | `1px solid rgba(255,255,255,0.80)` | None | Neutral secondary text |
| **Focus** | `1px solid #718FE8` | `ring-2 ring-[#718FE8]/30` | Neutral secondary text |
| **Error** | `1px solid #D94B65` | `ring-2 ring-[#D94B65]/30` | Red text + `AlertCircle` icon below input |
| **Success** | `1px solid #168B83` | `ring-2 ring-[#168B83]/30` | Green text + `Check` icon |
| **Disabled** | `1px solid rgba(255,255,255,0.30)` | None | Dimmed muted text, cursor `not-allowed` |

---

### 15.4 Data Components
- **Transaction Lists:** Clean vertical list with hairline dividers (`border-b border-slate-200/40 dark:border-white/5`).
- **Data Tables:** Dense ledgers with sticky headers in Glass Subtle, row hover highlighting, and full tabular numerals.
- **Progress Bars:** Height `8px`, track background `rgba(0,0,0,0.06)` (Light) / `rgba(255,255,255,0.10)` (Dark), animated fill bar with rounded ends.
- **Budget Indicators:** Pill badges displaying percentage burned (e.g., `74% Used`), changing color dynamically based on threshold.
- **Badges:** Height `24px`, padding `px-2.5`, text `11px font-semibold`, pill shape (`rounded-full`), available in Primary, AI, Income, Expense, Warning, and Info variants.
- **Tooltips:** Custom glassmorphic tooltip card with `backdrop-blur-md`, subtle border, and high-contrast text.
- **Empty States:** Centered glass card containing illustrated icon in soft purple circle, friendly title, concise explanation, and primary CTA button.
- **Loading Skeletons:** Animated shimmering gradient (`bg-slate-200/60 dark:bg-slate-700/50 animate-pulse rounded-xl`) matching exact dimensions of final loaded components to prevent layout shift.

---

### 15.5 Overlays & Modals
- **Modal Dialog:** Centered glass modal (`max-w-lg mx-auto rounded-3xl p-6`).
- **Mobile Bottom Sheet:** On screens `< 768px`, modals automatically transform into swipeable bottom sheets with a top grab handle (`w-12 h-1.5 rounded-full bg-slate-300 mx-auto my-2`).
- **Drawer:** Slide-out right-aligned glass panel on desktop for transaction details or AI insight expanded view.
- **Popover:** Glass Elevated surface with `rounded-xl` and shadow-lg, aligned with triggering control.
- **Toast Notifications (Sonner):** Floating pill toasts positioned top-center on mobile, bottom-right on desktop, with glassmorphic styling and semantic icon badge.
- **Confirmation Dialogs:** High-urgency overlay with destructive action button in rose (`#DC5579`) and clear cancel trigger.

---

## 16. Page-Specific Design Guidelines

Every SPENDX page adheres to a standardized structural blueprint:

### 16.1 Login
- **Page Background:** Atmospheric Ice Blue/Lavender gradient with central soft radial AI glow.
- **Header:** Minimal top bar with SPENDX brand mark.
- **Main Panels:** Centered floating Glass Primary card (`max-w-md w-full mx-auto p-6 sm:p-8 rounded-3xl shadow-glass-modal`).
- **Card Styles:** Single elevated glass container with hairline white border.
- **Typography Hierarchy:** Page title `24px` SemiBold (*"Welcome Back to SPENDX"*), subtitle `14px` Secondary (*"Log in to your financial intelligence hub"*).
- **Primary Actions:** One-tap OAuth buttons (Google/Apple) in Glass Secondary, followed by email/password submission CTA in Primary Blue (`#718FE8`).
- **Navigation Behavior:** Standalone authentication view; main navigation is hidden.
- **Mobile Layout:** Full-height flex container with input fields centered vertically, avoiding mobile virtual keyboard overlap.
- **Desktop Layout:** Centered card with decorative ambient glowing gradient orbs in background.

---

### 16.2 Signup
- **Page Background:** Same atmospheric Ice Blue/Lavender gradient.
- **Header:** Minimal top bar with brand mark and "Already have an account? Log In" link.
- **Main Panels:** Multi-step floating Glass Primary card with step indicator (*1. Account*, *2. Security*, *3. Bank Link*).
- **Card Styles:** Glass Primary card with smooth horizontal step transitions.
- **Typography Hierarchy:** Display heading `24px`, step indicator `12px font-semibold text-slate-500`.
- **Primary Actions:** "Create Account" CTA in Primary Blue (`#718FE8`), terms disclaimer in `text-caption`.
- **Navigation Behavior:** Standalone view; main navigation hidden.
- **Mobile Layout:** Single-column layout with fixed bottom action button above keyboard.
- **Desktop Layout:** 2-column split (Left: SPENDX value highlights & animated preview; Right: signup form).

---

### 16.3 Dashboard (`/dashboard`)
- **Page Background:** Standard ambient gradient.
- **Header:** Mobile: Greeting (*"Good morning, Alex"*), notification bell, profile pill. Desktop: Topbar with global search and "+ Add Transaction".
- **Main Panels:**
  - *Hero Balance Panel:* Total net worth displayed in tabular figures (`36px` desktop / `28px` mobile), month-to-date delta badge.
  - *Income & Expense Cluster:* 2 adjacent Glass Primary stat cards.
  - *Quick Action Carousel:* Horizontal scrollable pill buttons (*Add Expense*, *Transfer*, *Set Budget*, *Ask AI*).
  - *Recent Activity Feed:* 5 latest transactions with category icons and direct tap-to-inspect.
  - *AI Recommendation Banner:* Single-line predictive insight card with lavender sparkle badge.
- **Card Styles:** Glass Primary for metrics, Glass Interactive for clickable transaction rows.
- **Typography Hierarchy:** Hero Balance `text-display`, section headers `text-section-title`, stat values `text-card-title font-semibold tabular-nums`.
- **Primary Actions:** Floating Action Button (FAB) on mobile; "+ Add Transaction" in topbar on desktop.
- **Navigation Behavior:** Mobile: Tab 1 ("Home") active in bottom nav. Desktop: "Dashboard" highlighted in sidebar.
- **Mobile Layout:** Vertically stacked single column: Hero Balance $\to$ Income/Expense Split $\to$ Quick Actions $\to$ Recent Activity $\to$ AI Banner.
- **Desktop Layout:** 3-column asymmetric grid: Hero Balance + Stat Cards (Span 2 cols), AI Coach Quick Widget (Span 1 col), Charts & Ledger below.

---

### 16.4 Transactions Ledger (`/transactions`)
- **Page Background:** Standard ambient gradient.
- **Header:** Sticky search input bar with category filter chips (*All*, *Income*, *Expenses*, *Subscriptions*, *Transfers*).
- **Main Panels:** Chronological transaction ledger grouped by date (*Today*, *Yesterday*, *Earlier This Month*).
- **Card Styles:** Glass Primary outer container; individual rows use Glass Interactive with smooth hover states.
- **Typography Hierarchy:** Date dividers `text-caption uppercase tracking-wider`, merchant titles `text-body font-medium`, amounts `text-body font-semibold tabular-nums`.
- **Primary Actions:** "+ Add Transaction", CSV Export button, Filter toggle.
- **Navigation Behavior:** Mobile: Tab 2 ("Activity") active. Desktop: "Transactions" highlighted in sidebar.
- **Mobile Layout:** Edge-to-edge scrollable feed; tapping a row opens a bottom sheet with receipt attachment, category picker, and notes.
- **Desktop Layout:** Ledger table with sorting columns (Date, Merchant, Category, Account, Amount), side-drawer detail view upon row click.

---

### 16.5 Budgets (`/budgets`)
- **Page Background:** Standard ambient gradient.
- **Header:** Page title *"Monthly Budgets"*, month picker dropdown (*"November 2026"*), overall burn rate dial.
- **Main Panels:**
  - *Budget Overview Dial:* Donut summary showing total allocated vs total spent.
  - *Category Envelope Cards:* Individual cards for Dining, Housing, Transport, Entertainment, Utilities.
- **Card Styles:** Glass Primary cards containing category icon, amount spent / cap, and a colored progress bar (Green, Amber, Rose).
- **Typography Hierarchy:** Spent amounts `text-card-title tabular-nums`, remaining amounts `text-caption font-medium`.
- **Primary Actions:** "+ Create Budget Envelope", "Auto-Adjust with AI".
- **Navigation Behavior:** Mobile: Tab 4 ("Wallet") active. Desktop: "Budgets" highlighted in sidebar.
- **Mobile Layout:** Vertical stack of budget cards with touch-friendly progress sliders.
- **Desktop Layout:** 2-column or 3-column grid of budget envelopes with summary chart in left rail.

---

### 16.6 Analytics (`/analytics`)
- **Page Background:** Standard ambient gradient.
- **Header:** Timeframe segmented control pill (`1W`, `1M`, `3M`, `YTD`, `1Y`, `ALL`).
- **Main Panels:**
  - *Cash Flow Area Chart:* Smooth spline gradient area chart showing Income vs Expenses.
  - *Category Breakdown:* Donut chart and ranked spending list with percentage shares.
  - *Recurring Subscriptions Audit:* Dedicated card highlighting monthly recurring liabilities.
- **Card Styles:** Glass Primary containers with custom glass tooltip overlays.
- **Typography Hierarchy:** Chart values in `text-body-sm font-semibold tabular-nums`.
- **Primary Actions:** "Download Financial Report (PDF)", "AI Spending Audit".
- **Navigation Behavior:** Mobile: Accessible via "More" menu. Desktop: "Analytics" highlighted in sidebar.
- **Mobile Layout:** Single-column stacked charts with touch scrubber tooltips.
- **Desktop Layout:** 2-column split (Cash Flow Area chart left, Category breakdown and Subscriptions right).

---

### 16.7 AI Financial Coach (`/ai-coach`)
The AI Coach features a distinct, futuristic soft-purple visual identity.
- **Page Background:** Ambient gradient infused with extra lavender and pale-purple radial glows.
- **Header:** Header displaying AI Coach persona with glowing sparkle badge (*"SPENDX Intelligence — Online"*).
- **Main Panels:**
  - *Suggested Prompt Carousel:* Horizontal pill suggestions (*"Analyze weekend spend"*, *"Can I afford dinner tonight?"*, *"Find unused subscriptions"*).
  - *Conversation Thread:* Scrollable chat stream.
    - *Assistant Messages:* Glass Primary cards with lavender border (`rgba(128,102,204,0.3)`), white fill in light mode, purple sparkle icon.
    - *User Messages:* Solid Primary Blue fill (`#718FE8`) with white text, aligned to the right.
  - *Floating Input Bar:* Sticky bottom glass bar with microphone, attachment icon, and send button.
- **Card Styles:** Soft-purple tinted glass (`rgba(237, 228, 255, 0.40)`).
- **Typography Hierarchy:** Conversational body copy `text-body (14px/1.5)`, suggested prompt pills `text-caption font-medium`.
- **Primary Actions:** Send message, tap suggestion pill, apply AI recommended budget fix.
- **Navigation Behavior:** Mobile: Tab 3 ("AI") active with glowing lavender indicator. Desktop: "AI Coach" highlighted in sidebar.
- **Mobile Layout:** Full-height conversation container with sticky bottom input above keyboard and floating bottom nav.
- **Desktop Layout:** Centered chat stream (`max-w-3xl mx-auto`) with auxiliary sidebar showing historical insight topics.

---

### 16.8 Savings Goals (`/savings`)
- **Page Background:** Standard ambient gradient.
- **Header:** Total savings balance hero, milestone completion forecast.
- **Main Panels:** Grid of goal cards (*"Emergency Fund"*, *"Japan Trip 2027"*, *"New Car Downpayment"*).
- **Card Styles:** Glass Primary with circular progress ring, saved amount vs target, and automated round-up status chip.
- **Typography Hierarchy:** Goal title `text-card-title`, target balance `text-body font-semibold tabular-nums`.
- **Primary Actions:** "+ New Savings Goal", "Transfer to Goal", "Configure Smart Round-Ups".
- **Navigation Behavior:** Mobile: Accessible via "More" menu. Desktop: "Savings" highlighted in sidebar.
- **Mobile Layout:** Single-column vertical goal cards.
- **Desktop Layout:** 3-column grid of goal cards with overall wealth progress meter at the top.

---

### 16.9 Settings & Security (`/settings`)
- **Page Background:** Standard ambient gradient.
- **Header:** Page title *"Account & Preferences"*, user avatar summary card.
- **Main Panels:**
  - *Appearance:* 3-way theme toggle segmented pill (*Light*, *Dark*, *System*).
  - *Security & Biometrics:* FaceID/Biometrics toggle, 2FA setup, PIN configuration.
  - *Connected Accounts:* Bank feeds (Plaid/Open Banking) with synchronization health indicators.
  - *Data & Privacy:* Export ledger (CSV/JSON), delete account action.
- **Card Styles:** Grouped list cards in Glass Primary with hairline dividers.
- **Typography Hierarchy:** Section headers `text-section-title`, setting labels `text-body font-medium`, hints `text-caption text-slate-400`.
- **Primary Actions:** "Save Changes", "Disconnect Bank", "Logout".
- **Navigation Behavior:** Mobile: Tab 5 ("More") active. Desktop: "Settings" pinned at bottom of sidebar.
- **Mobile Layout:** Grouped list view with iOS-style navigation arrows.
- **Desktop Layout:** Left-tabbed settings navigation with right-side preference panels.

---

## 17. Charts and Data Visualization

SPENDX uses **Recharts** with calibrated color tokens.

### 17.1 Chart Palette Tokens
| Series Role | Token Name | HEX Value | Visual Meaning |
|---|---|---|---|
| **Primary Series** | `--chart-primary` | `#718FE8` | Overall spending balance, net worth trajectory |
| **Secondary Series** | `--chart-secondary`| `#8B72D6` | Prior period comparison, projected trajectory |
| **Tertiary Series** | `--chart-tertiary` | `#60B5D8` | Investment allocations, secondary categories |
| **Income Series** | `--chart-income` | `#12866E` | Inflow bars, credit area charts |
| **Expense Series** | `--chart-expense` | `#DC5579` | Outflow bars, debit area charts |
| **Neutral Gridlines**| `--chart-grid` | `rgba(100, 116, 139, 0.12)` | Subtle horizontal reference guides |

---

### 17.2 Chart Styling Standards
- **Grid Lines:** Render only horizontal grid lines (`strokeDasharray="3 3"`). Vertical grid lines must be disabled to minimize visual clutter.
- **Axis Labels:** Font size `11px`, fill `#94A3B8`, tabular numerals.
- **Chart Backgrounds:** Transparent (`fill="none"`) so the underlying frosted glass card shows through.
- **Tooltips:** Custom glassmorphic tooltip card:
  ```html
  <div class="rounded-xl bg-white/90 dark:bg-[#17243C]/95 backdrop-blur-md 
              border border-white/80 dark:border-white/10 p-3 shadow-lg">
    <p class="text-xs font-medium text-slate-500">Nov 14, 2026</p>
    <p class="text-sm font-bold text-slate-800 dark:text-white tabular-nums">$3,420.50</p>
  </div>
  ```
- **Mobile Chart Sizing:** Constrain chart container height to `180px` to `220px` on mobile viewports.
- **Multi-Series Differentiation:** Do not rely on color alone. Use distinct stroke styles (e.g., solid for current period, dashed for previous period) and explicit legend text.
- **Empty Chart States:** Display a subtle dashed grid with centered icon and text (*"No transaction data for this timeframe"*).

---

## 18. Animation and Interaction System

SPENDX utilizes **Motion for React** (`motion`) for fluid, physics-based micro-interactions.

### 18.1 Timing & Duration Tiers
| Tier | Duration Range | Easing Curve | Use Cases |
|---|---|---|---|
| **Micro-Interactions** | `150ms – 200ms` | `easeOut` / `[0.16, 1, 0.3, 1]` | Button presses, toggle switches, tab pill shifts, checkbox toggles |
| **Standard Transitions**| `200ms – 300ms` | `easeInOut` / `[0.25, 0.1, 0.25, 1]`| Card hover expansion, accordion open, dropdown reveal |
| **Page / Layout Shifts**| `250ms – 350ms` | `[0.32, 0.72, 0, 1]` (Spring feel) | Modal popups, bottom sheet slide-in, route transitions |

---

### 18.2 Animation Recipes (Motion for React)

```typescript
// Standard Spring Physics for Bottom Sheets & Modals
export const sheetSpringTransition = {
  type: "spring",
  damping: 28,
  stiffness: 300,
  mass: 0.8
};

// Interactive Card Hover Configuration
export const cardHoverMotion = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } }
};

// Tab Indicator Layout Transition
export const tabIndicatorTransition = {
  type: "spring",
  stiffness: 500,
  damping: 35
};

// Dropdown / Popover Entrance
export const popoverMotion = {
  initial: { opacity: 0, scale: 0.95, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -4 },
  transition: { duration: 0.15, ease: "easeOut" }
};
```

---

### 18.3 Reduced Motion Compliance
All motion animations must respect user OS preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 19. Accessibility Standards (WCAG 2.2 AA)

1. **Color Contrast:** All body text maintains $\ge 4.5:1$ contrast against light glass surfaces. Display headers maintain $\ge 3:1$.
2. **Keyboard Focus Ring:** Every focusable control must show a crisp, high-visibility focus ring:
   ```css
   :focus-visible {
     outline: 2px solid #718FE8;
     outline-offset: 2px;
   }
   ```
3. **Touch Targets:** No interactive button, chip, tab, or menu trigger may have a hit target smaller than **$44 \times 44\text{px}$** on touch devices.
4. **Accessible Financial Status:** When displaying account status, never rely on green/red alone. Provide icon indicators and text labels (`"Income"`, `"Expense"`).
5. **Screen Reader Live Regions:** Dynamic AI chat responses and balance refreshes must update inside `aria-live="polite"` containers.
6. **Semantic HTML:** Use proper landmark elements (`<nav>`, `<main>`, `<header>`, `<aside>`, `<section>`).

---

## 20. Mobile Performance & Low-End Device Fallbacks

To ensure smooth 60fps performance across budget Android devices and older iPhones:

1. **Backdrop Filter Limit:** Never use blur radii greater than `24px`. Limit blurred elements on a single screen to high-level structural containers (Navigation bar and active modal).
2. **GPU Acceleration:** Apply `transform: translateZ(0)` or `will-change: transform` only to elements currently animating (e.g., active bottom sheet).
3. **Prevent Horizontal Overflows:** Constrain body with `overflow-x: hidden` and test wide charts at `320px` viewport widths.
4. **Safe-Area Inset Handling:**
   ```css
   .safe-area-bottom {
     padding-bottom: max(16px, env(safe-area-inset-bottom));
   }
   .safe-area-top {
     padding-top: max(12px, env(safe-area-inset-top));
   }
   ```
5. **Backdrop Filter Fallback:**
   ```css
   @supports not (backdrop-filter: blur(20px)) {
     .glass-panel {
       background-color: rgba(255, 255, 255, 0.95) !important;
     }
     .dark .glass-panel {
       background-color: #17243C !important;
     }
   }
   ```

---

## 21. CSS and Tailwind Implementation

SPENDX is built using **Tailwind CSS v4** with CSS variables and custom utility classes.

### 21.1 Core Tailwind v4 Configuration (`frontend/src/index.css`)

```css
@import "tailwindcss";

@layer base {
  :root {
    /* Background Canvas */
    --background: #EBF3FC;
    --foreground: #263653;

    /* Brand Foundation */
    --brand-primary: #718FE8;
    --brand-secondary: #8B72D6;
    --brand-ai: #8066CC;
    --brand-ice: #DDF5FF;
    --brand-sky: #C9E5FF;
    --brand-lavender: #DCD9FF;
    --brand-soft-purple: #EDE4FF;
    --brand-deep-indigo: #5368A2;

    /* Text */
    --text-primary: #263653;
    --text-secondary: #64748B;
    --text-muted: #94A3B8;
    --text-disabled: #A8B3C7;
    --text-inverse: #FFFFFF;

    /* Financial Semantics */
    --income: #12866E;
    --income-tint: rgba(18, 134, 110, 0.10);
    --expense: #DC5579;
    --expense-tint: rgba(220, 85, 121, 0.10);
    --warning: #C48620;
    --warning-tint: rgba(196, 134, 32, 0.10);
    --info: #4779C9;
    --info-tint: rgba(71, 121, 201, 0.10);
    --success: #168B83;
    --success-tint: rgba(22, 139, 131, 0.10);
    --error: #D94B65;
    --error-tint: rgba(217, 75, 101, 0.10);

    /* Glass Surfaces */
    --glass-bg: rgba(255, 255, 255, 0.62);
    --glass-border: rgba(255, 255, 255, 0.80);
    --glass-nav-bg: rgba(255, 255, 255, 0.70);
    --glass-nav-border: rgba(255, 255, 255, 0.85);
    --glass-modal-bg: rgba(255, 255, 255, 0.88);
    --glass-modal-border: rgba(255, 255, 255, 1.00);
    --glass-input-bg: rgba(255, 255, 255, 0.50);
    --glass-input-border: rgba(255, 255, 255, 0.80);

    /* Shadows */
    --shadow-glass: 0 10px 32px -4px rgba(83, 104, 162, 0.08), 0 4px 12px -2px rgba(83, 104, 162, 0.04);
    --shadow-nav: 0 12px 36px -4px rgba(83, 104, 162, 0.14), 0 2px 8px -1px rgba(83, 104, 162, 0.06);

    /* Geometry */
    --radius-card: 20px;
    --radius-control: 12px;
    --radius-pill: 9999px;
  }

  .dark {
    --background: #101827;
    --foreground: #F1F5FF;

    --brand-primary: #A5BFFF;
    --brand-secondary: #B9A4FF;
    --brand-ai: #A285FF;

    --text-primary: #F1F5FF;
    --text-secondary: #A8B5CC;
    --text-muted: #71829E;
    --text-disabled: #4B5975;
    --text-inverse: #101827;

    --income: #34D399;
    --income-tint: rgba(52, 211, 153, 0.15);
    --expense: #FB7185;
    --expense-tint: rgba(251, 113, 133, 0.15);
    --warning: #FBBF24;
    --warning-tint: rgba(251, 191, 36, 0.15);
    --info: #60A5FA;
    --info-tint: rgba(96, 165, 250, 0.15);
    --success: #34D399;
    --success-tint: rgba(52, 211, 153, 0.15);
    --error: #FB7185;
    --error-tint: rgba(251, 113, 133, 0.15);

    --glass-bg: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.14);
    --glass-nav-bg: rgba(23, 36, 60, 0.85);
    --glass-nav-border: rgba(255, 255, 255, 0.16);
    --glass-modal-bg: rgba(23, 36, 60, 0.94);
    --glass-modal-border: rgba(255, 255, 255, 0.20);
    --glass-input-bg: rgba(255, 255, 255, 0.06);
    --glass-input-border: rgba(255, 255, 255, 0.16);

    --shadow-glass: 0 10px 32px -4px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.25);
    --shadow-nav: 0 12px 36px -4px rgba(0, 0, 0, 0.50), 0 2px 8px -1px rgba(0, 0, 0, 0.30);
  }
}

@theme {
  --color-brand-primary: var(--brand-primary);
  --color-brand-secondary: var(--brand-secondary);
  --color-brand-ai: var(--brand-ai);
  --color-brand-ice: var(--brand-ice);
  --color-brand-sky: var(--brand-sky);
  --color-brand-lavender: var(--brand-lavender);
  --color-brand-soft-purple: var(--brand-soft-purple);
  --color-brand-deep-indigo: var(--brand-deep-indigo);

  --color-income: var(--income);
  --color-expense: var(--expense);
  --color-warning: var(--warning);
  --color-info: var(--info);
  --color-success: var(--success);
  --color-error: var(--error);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Reusable Glass Utility Classes */
@utility glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  border-radius: var(--radius-card);
}

@utility glass-interactive {
  background: var(--glass-bg);
  backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
  border-radius: var(--radius-card);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

@utility glass-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px -4px rgba(83, 104, 162, 0.16);
}

@utility glass-nav {
  background: var(--glass-nav-bg);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--glass-nav-border);
  box-shadow: var(--shadow-nav);
}

@utility glass-input {
  background: var(--glass-input-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--glass-input-border);
  border-radius: var(--radius-control);
  color: var(--text-primary);
}

@utility glass-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 2px rgba(113, 143, 232, 0.25);
}
```

---

### 21.2 shadcn/ui Component Overrides
When installing or configuring shadcn/ui components in SPENDX, apply these specific overrides to match the glassmorphic theme:

```typescript
// Button Override: Rounded-xl, font-semibold, high-contrast states
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#718FE8] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#718FE8] text-white shadow-sm hover:bg-[#5E7CD5] active:scale-[0.98]",
        destructive: "bg-[#DC5579] text-white shadow-sm hover:bg-[#C43F62] active:scale-[0.98]",
        outline: "border border-[#718FE8] text-[#718FE8] bg-transparent hover:bg-[#718FE8]/10",
        secondary: "bg-white/70 dark:bg-white/10 text-[#263653] dark:text-white border border-white/80 dark:border-white/20 hover:bg-white/90 shadow-sm",
        ghost: "hover:bg-white/40 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300",
        link: "text-[#718FE8] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Card Override: Frosted glass panel with rounded-2xl
// components/ui/card.tsx
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-white/80 dark:border-white/14 bg-white/62 dark:bg-white/8 backdrop-blur-xl shadow-[0_10px_32px_-4px_rgba(83,104,162,0.08)] text-[#263653] dark:text-[#F1F5FF]",
        className
      )}
      {...props}
    />
  )
);
```

---

## 22. Design Token Quick Reference

### 22.1 Color Tokens
```
--color-brand-primary:      #718FE8 (Dark: #A5BFFF)
--color-brand-secondary:    #8B72D6 (Dark: #B9A4FF)
--color-brand-ai:           #8066CC (Dark: #A285FF)
--color-brand-ice:          #DDF5FF
--color-brand-sky:          #C9E5FF
--color-brand-lavender:     #DCD9FF
--color-brand-soft-purple:  #EDE4FF
--color-brand-deep-indigo:  #5368A2
--color-income:             #12866E (Dark: #34D399)
--color-expense:            #DC5579 (Dark: #FB7185)
--color-warning:            #C48620 (Dark: #FBBF24)
--color-info:               #4779C9 (Dark: #60A5FA)
--color-success:            #168B83 (Dark: #34D399)
--color-error:              #D94B65 (Dark: #FB7185)
```

### 22.2 Shadow Tokens
```
--shadow-glass-sm:   0 4px 16px -2px rgba(83, 104, 162, 0.06);
--shadow-glass-base: 0 10px 32px -4px rgba(83, 104, 162, 0.08), 0 4px 12px -2px rgba(83, 104, 162, 0.04);
--shadow-glass-lg:   0 16px 40px -6px rgba(83, 104, 162, 0.14), 0 6px 16px -3px rgba(83, 104, 162, 0.08);
--shadow-glass-nav:  0 12px 36px -4px rgba(83, 104, 162, 0.14), 0 2px 8px -1px rgba(83, 104, 162, 0.06);
```

### 22.3 Corner Radius Tokens
```
--radius-sm:      8px   (Small badges, inner tags)
--radius-md:     12px   (Buttons, form inputs, chips)
--radius-lg:     16px   (Nested cards, list items)
--radius-xl:     20px   (Standard floating glass cards, panels)
--radius-2xl:    24px   (Top-level containers, modals)
--radius-pill: 9999px   (Pill badges, bottom nav bar, floating FAB)
```

---

## 23. Design Consistency Rules

All contributors must respect the following **14 Non-Negotiable Consistency Rules**:

1. **Zero Arbitrary Colors:** Never introduce off-palette hex codes (e.g., `#23a1d2`, `#3b82f6`). Use the designated token system exclusively.
2. **Deterministic Glass Tokens:** Every translucent surface must reference a documented glass variant. Do not write ad-hoc `backdrop-blur-[17px]` or `bg-white/43`.
3. **Card Radius Uniformity:** Main glass cards are always `rounded-2xl` (`20px`). Inner controls are `rounded-xl` (`12px`).
4. **Spacing Scale Rigidity:** Spacing must only use approved 4-point increments (`4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px`).
5. **Tabular Numerals Mandate:** All monetary figures, percentage calculations, and numerical dates must implement `.tabular-nums`.
6. **Accessible Semantic Pairings:** Financial statuses (Income, Expense, Warning) must combine color with a clear semantic icon and textual label.
7. **Mobile Touch Target Floor:** Interactive elements on mobile must measure at least **$44\times 44\text{px}$** (recommended $48\times 48\text{px}$).
8. **No Stacking Glass Surfaces:** Never place a blurred card inside another blurred container. Use subtle or solid fills for nested sub-panels.
9. **No Full-Page Blurs on Mobile:** The global canvas gradient must remain static with `background-attachment: fixed` to prevent mobile GPU frame-drops.
10. **Respect Reduced Motion:** Always honor `prefers-reduced-motion` with zero-duration transitions.
11. **No Next.js Assumptions:** SPENDX is built with **React 19 + Vite + TypeScript**. Do not reference Next.js routing, server components, or `@next/font`.
12. **Light and Dark Parity:** No component may be committed without complete light and dark mode implementations.
13. **Safe-Area Inset Protection:** All fixed floating navigation components must incorporate `env(safe-area-inset-bottom)`.
14. **High-Contrast Text Guarantee:** Primary body text must achieve a minimum contrast of $4.5:1$ against its immediate glass background.

---

## 24. Future Design Evolution & Recommended Architecture

### 24.1 Recommended Frontend File Architecture
To organize styles and components cleanly as the SPENDX codebase evolves, the following folder organization is recommended:

```
frontend/
└── src/
    ├── styles/
    │   ├── globals.css         # Base Tailwind v4 entry and global canvas resets
    │   ├── themes.css          # Light and Dark mode CSS custom property definitions
    │   ├── tokens.css          # Primitive design tokens (colors, spacing, shadows, radius)
    │   └── animations.css      # Motion keyframes, timing curves, reduced motion rules
    ├── components/
    │   ├── ui/                 # Headless & primitive UI controls (Button, Input, Badge, Dialog)
    │   ├── glass/              # Polymorphic glass wrappers (GlassCard, GlassPanel, GlassSheet)
    │   ├── layout/             # Structural shells (AppLayout, Sidebar, Topbar, BottomNav)
    │   └── common/             # Shared fintech widgets (AmountDisplay, TransactionItem, StatCard)
    ├── features/
    │   ├── dashboard/          # Dashboard overview widgets and metrics
    │   ├── transactions/       # Transaction ledger, filter pills, search
    │   ├── budgets/            # Spending envelopes and progress dials
    │   ├── ai-coach/           # AI conversation interface, message bubbles, prompts
    │   ├── analytics/          # Recharts graphs, cash flow timelines, reports
    │   └── savings/            # Target goal cards and milestone meters
    └── stores/
        └── themeStore.ts       # Zustand theme state management ('light' | 'dark' | 'system')
```

#### Folder Responsibilities:
- `styles/globals.css`: Imports Tailwind v4, configures `@theme`, and sets up HTML/body defaults.
- `styles/themes.css`: Houses `:root` and `.dark` variable definitions.
- `styles/tokens.css`: Declares raw color, typography, shadow, and radius tokens.
- `styles/animations.css`: Encapsulates physics curves, sheet spring parameters, and accessibility fallbacks.
- `components/ui/`: Contains atomic UI controls based on Radix UI primitives with custom glass overrides.
- `components/glass/`: Encapsulates backdrop-blur, specular highlight, and border styles into reusable React containers.
- `components/layout/`: Orchestrates mobile bottom navigation bar vs desktop floating sidebar and topbar.
- `components/common/`: Houses ubiquitous financial UI patterns (e.g., currency formatters with tabular figures).

---

### 24.2 Governance & Version Cadence
1. **Token Change Approval:** Any modification to color tokens, glass opacity, or spacing scales requires a version bump in `THEME.md` (e.g., `1.0.0` $\to$ `1.1.0`).
2. **Pull Request Design Checklist:** Every UI pull request must be verified against:
   - [ ] Light & Dark mode contrast validation (APCA / WCAG 2.2 AA).
   - [ ] iPhone SE (`375px`) and standard desktop (`1440px`) visual parity.
   - [ ] Verified tabular figures (`.tabular-nums`) on all monetary displays.
   - [ ] Safe-area inset adherence on mobile navigation controls.
   - [ ] Touch target dimensions $\ge 44\times 44\text{px}$ on all interactive buttons.
