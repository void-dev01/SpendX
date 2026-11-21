import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 1. Load Playwright from frontend node_modules
const playwrightModule = await import(
  `file:///${path.resolve(PROJECT_ROOT, 'frontend/node_modules/@playwright/test/index.mjs').replace(/\\/g, '/')}`
);
const { chromium } = playwrightModule;

// Output paths
const DEMO_DIR = path.resolve(PROJECT_ROOT, 'demo-video');
if (fs.existsSync(DEMO_DIR)) {
  for (const f of fs.readdirSync(DEMO_DIR)) {
    if (f.endsWith('.webm') || f.endsWith('.mp4')) {
      try {
        fs.unlinkSync(path.join(DEMO_DIR, f));
      } catch {}
    }
  }
} else {
  fs.mkdirSync(DEMO_DIR, { recursive: true });
}
const FINAL_MP4_PATH = path.resolve(PROJECT_ROOT, 'SpendX_Full_Walkthrough_1080p.mp4');

// 2. Launch Chromium (1920x1080 @ 60fps recording)
console.log('🚀 Launching Chromium (1920x1080) Full-HD Recording Engine...');
const browser = await chromium.launch({
  headless: true,
  args: [
    '--window-size=1920,1080',
    '--disable-gpu-vsync',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--hide-scrollbars=false',
    '--force-device-scale-factor=1',
  ],
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: {
    dir: DEMO_DIR,
    size: { width: 1920, height: 1080 },
  },
});

const page = await context.newPage();
page.__mousePos = { x: 960, y: 540 };

// 3. Inject Visual Presenter HUD & Glowing Cursor (Presenter overlays only)
await context.addInitScript(() => {
  window.addEventListener('DOMContentLoaded', () => {
    // A. Glowing Neon Green Cursor Dot & Ring
    const dot = document.createElement('div');
    dot.id = '__spendx_cur_dot';
    dot.style.cssText =
      'position:fixed;width:10px;height:10px;background:#A5F12B;border-radius:50%;pointer-events:none;z-index:99999999;transform:translate(-50%,-50%);box-shadow:0 0 12px #A5F12B;transition:transform 0.08s ease;';

    const ring = document.createElement('div');
    ring.id = '__spendx_cur_ring';
    ring.style.cssText =
      'position:fixed;width:40px;height:40px;border:2.5px solid #A5F12B;border-radius:50%;pointer-events:none;z-index:99999998;transform:translate(-50%,-50%);transition:left 0.1s ease-out,top 0.1s ease-out,transform 0.18s ease;box-shadow:0 0 20px rgba(165,241,43,0.35);';

    document.documentElement.appendChild(dot);
    document.documentElement.appendChild(ring);

    window.addEventListener('mousemove', (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    });

    window.addEventListener('mousedown', (e) => {
      ring.style.transform = 'translate(-50%,-50%) scale(0.7)';
      ring.style.borderColor = '#10B981';
      dot.style.transform = 'translate(-50%,-50%) scale(1.5)';

      const rip = document.createElement('div');
      rip.style.cssText =
        'position:fixed;left:' +
        e.clientX +
        'px;top:' +
        e.clientY +
        'px;width:12px;height:12px;border:2.5px solid #A5F12B;border-radius:50%;pointer-events:none;z-index:99999997;transform:translate(-50%,-50%) scale(1);opacity:0.9;transition:transform 0.5s cubic-bezier(0,0,0.2,1),opacity 0.5s ease-out;';
      document.documentElement.appendChild(rip);
      requestAnimationFrame(() => {
        rip.style.transform = 'translate(-50%,-50%) scale(4.5)';
        rip.style.opacity = '0';
      });
      setTimeout(() => rip.remove(), 550);
    });

    window.addEventListener('mouseup', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = '#A5F12B';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });

    // B. Floating Presenter Glass HUD Banner
    const hud = document.createElement('div');
    hud.id = '__spendx_presenter_hud';
    hud.style.cssText =
      'position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99999990;display:flex;align-items:center;gap:18px;padding:12px 28px;border-radius:9999px;background:rgba(12,16,12,0.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1.5px solid rgba(165,241,43,0.35);box-shadow:0 20px 50px rgba(0,0,0,0.7),0 0 35px rgba(165,241,43,0.2);font-family:system-ui,-apple-system,sans-serif;pointer-events:none;min-width:760px;max-width:960px;justify-content:space-between;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);';

    hud.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="display:flex;align-items:center;gap:7px;background:rgba(165,241,43,0.15);padding:5px 12px;border-radius:9999px;border:1px solid rgba(165,241,43,0.4);">
          <div style="width:8px;height:8px;border-radius:50%;background:#A5F12B;box-shadow:0 0 10px #A5F12B;"></div>
          <span style="color:#A5F12B;font-size:11px;font-weight:900;letter-spacing:0.1em;font-family:monospace;">SPENDX OS</span>
        </div>
        <div id="__spendx_hud_badge" style="color:#A5F12B;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:0.06em;background:rgba(255,255,255,0.06);padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);">CH 01/10 • LANDING</div>
      </div>
      <div style="flex:1;text-align:center;padding:0 12px;">
        <div id="__spendx_hud_title" style="color:#FFFFFF;font-size:13.5px;font-weight:700;line-height:1.3;letter-spacing:0.01em;">Autonomous FinTech & Personal Wealth Operating System</div>
        <div id="__spendx_hud_subtitle" style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:500;margin-top:2px;">Full-HD 1080p Real-Time Walkthrough (Zero Demo Data Mode)</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="color:#EF4444;font-size:10px;font-weight:900;letter-spacing:0.06em;display:flex;align-items:center;gap:5px;">
          <span style="display:inline-block;width:7px;height:7px;background:#EF4444;border-radius:50%;box-shadow:0 0 6px #EF4444;"></span> LIVE
        </span>
        <span id="__spendx_hud_time" style="color:rgba(255,255,255,0.9);font-size:11.5px;font-family:monospace;font-weight:700;background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;">00:00</span>
      </div>
    `;

    document.documentElement.appendChild(hud);

    const startTime = Date.now();
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      const timeEl = document.getElementById('__spendx_hud_time');
      if (timeEl) timeEl.innerText = `${m}:${s}`;
    }, 1000);

    window.__spendx_hud = {
      update(badge, title, subtitle) {
        const badgeEl = document.getElementById('__spendx_hud_badge');
        const titleEl = document.getElementById('__spendx_hud_title');
        const subEl = document.getElementById('__spendx_hud_subtitle');
        if (badgeEl && badge) badgeEl.innerText = badge;
        if (titleEl && title) titleEl.innerText = title;
        if (subEl && subtitle) subEl.innerText = subtitle;
      },
    };
  });
});

// Pacing & Interaction Helpers
async function setHUD(badge, title, subtitle = '') {
  await page.evaluate(
    ({ badge, title, subtitle }) => {
      if (window.__spendx_hud) {
        window.__spendx_hud.update(badge, title, subtitle);
      }
    },
    { badge, title, subtitle }
  );
}

async function smoothMove(targetX, targetY, steps = 28) {
  const cur = page.__mousePos || { x: 960, y: 540 };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const cx = Math.round(cur.x + (targetX - cur.x) * ease);
    const cy = Math.round(cur.y + (targetY - cur.y) * ease);
    await page.mouse.move(cx, cy);
    await page.waitForTimeout(14);
  }
  page.__mousePos = { x: targetX, y: targetY };
}

async function smoothScroll(deltaY, durationMs = 1200) {
  const steps = Math.max(15, Math.round(durationMs / 25));
  const stepDelta = deltaY / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepDelta);
    await page.waitForTimeout(22);
  }
}

async function humanClick(selector, options = {}) {
  const loc = typeof selector === 'string' ? page.locator(selector).first() : selector;
  await loc.waitFor({ state: 'visible', timeout: 14000 });
  const box = await loc.boundingBox();
  if (box) {
    const targetX = Math.round(box.x + box.width / 2);
    const targetY = Math.round(box.y + box.height / 2);
    await smoothMove(targetX, targetY, 22);
    await page.waitForTimeout(180);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(250);
  } else {
    await loc.click(options);
  }
}

async function humanType(selector, text, delayMs = 65) {
  await humanClick(selector);
  const loc = typeof selector === 'string' ? page.locator(selector).first() : selector;
  await loc.fill('');
  for (const char of text) {
    await loc.pressSequentially(char, { delay: delayMs });
  }
  await page.waitForTimeout(200);
}

async function activeReadingPause(ms = 3500) {
  const cycles = Math.max(1, Math.round(ms / 900));
  const cur = page.__mousePos || { x: 960, y: 540 };
  for (let i = 0; i < cycles; i++) {
    const offsetX = (Math.random() - 0.5) * 60;
    const offsetY = (Math.random() - 0.5) * 35;
    await smoothMove(Math.round(cur.x + offsetX), Math.round(cur.y + offsetY), 18);
    await page.waitForTimeout(650);
  }
}

// ============================================================================
// MASTER RECORDING SCENARIO (Target: 320+ Seconds, Full-HD 1080p60)
// ============================================================================
console.log('🎬 Starting 10-Chapter Master Walkthrough (Real User & Clean State)...');
const startTime = Date.now();

// ----------------------------------------------------------------------------
// CHAPTER 1: LANDING & SYSTEM INTRODUCTION (~25s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 1: Landing Experience...');
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

await setHUD(
  'CH 01/10 • LANDING EXPERIENCE',
  'Autonomous Personal Wealth Operating System & High-Performance Telemetry',
  'Real-Time Ledger Audits, Reactive Envelopes & Bank-Grade Security'
);

await smoothMove(960, 420, 25);
await activeReadingPause(4000);

// Smooth scroll through landing sections
await smoothScroll(650, 1600);
await smoothMove(720, 520, 20);
await activeReadingPause(3200);

await smoothScroll(750, 1600);
await smoothMove(960, 480, 22);
await activeReadingPause(3500);

await smoothScroll(-1400, 1800);
await smoothMove(1080, 60, 25);
await activeReadingPause(2500);

// Click Log In in Navbar
await humanClick('a:has-text("Log In"), button:has-text("Log In")');
await page.waitForURL('**/login', { timeout: 10000 }).catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});

// ----------------------------------------------------------------------------
// CHAPTER 2: REAL USER ONBOARDING & SECURE AUTHENTICATION (~30s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 2: Real User Authentication...');
await setHUD(
  'CH 02/10 • ONBOARDING & AUTHENTICATION',
  'Logging into Verified SPENDX Account: Priyam Prajapati (priyam@spendx.pro)',
  'Zero Demo Data Mode • Multi-Tenant Ledger Isolation & Cryptographic Session'
);

await smoothMove(960, 340, 22);
await activeReadingPause(2500);

// Fill login credentials with human typing
await humanType('input[type="email"]', 'priyam@spendx.pro', 65);
await humanType('input[type="password"]', 'Password@123', 65);
await activeReadingPause(2500);

// Submit Sign In
await humanClick('button[type="submit"]');
await page.waitForURL('**/dashboard', { timeout: 12000 }).catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});

// ----------------------------------------------------------------------------
// CHAPTER 3: CENTRAL COMMAND DASHBOARD (WORKSPACE TELEMETRY) (~28s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 3: Central Command Dashboard...');
await setHUD(
  'CH 03/10 • CENTRAL DASHBOARD',
  'High-Performance FinTech Cockpit: Real-Time Cashflow & Runway Velocity',
  'Dynamic Net Worth Telemetry, Liquidity Health & Live Ledger Stream'
);

await smoothMove(960, 280, 25);
await activeReadingPause(3500);

// Hover across the 4 key metrics
await smoothMove(420, 240, 22); // Net Worth
await activeReadingPause(2500);
await smoothMove(780, 240, 22); // Inflow
await activeReadingPause(2500);
await smoothMove(1140, 240, 22); // Outflow
await activeReadingPause(2500);
await smoothMove(1500, 240, 22); // Savings Rate
await activeReadingPause(2500);

// Scroll down to review activity stream
await smoothScroll(500, 1200);
await smoothMove(960, 520, 20);
await activeReadingPause(3000);
await smoothScroll(-500, 1000);
await activeReadingPause(2000);

// ----------------------------------------------------------------------------
// CHAPTER 4: CONNECTING REAL BANK ACCOUNTS (~45s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 4: Connecting Real Accounts...');
await page.goto('http://127.0.0.1:5173/accounts', { waitUntil: 'networkidle' });
await setHUD(
  'CH 04/10 • BANK & VAULT INTEGRATION',
  'Connecting Primary Salary Checking & High-Yield Savings Accounts',
  'Multi-Institution Liquidity Aggregation & Encrypted Account Masking'
);

await smoothMove(960, 360, 25);
await activeReadingPause(3000);

// 1. Add HDFC Salary Account
await humanClick('button:has-text("Add Account"), button:has-text("Add Your First Account")');
await page.waitForTimeout(600);
await humanType('#account-name', 'HDFC Bank - Salary Account', 60);
await page.selectOption('#account-type', 'BANK');
await humanType('#account-institution', 'HDFC Bank', 60);
await humanType('#account-balance', '145000', 70);
await humanType('input[name="lastFourDigits"]', '4492', 70);
await activeReadingPause(2000);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1500);

// 2. Add ICICI Wealth Savings
await humanClick('button:has-text("Add Account"), button:has-text("Add Your First Account")');
await page.waitForTimeout(600);
await humanType('#account-name', 'ICICI Wealth Savings', 60);
await page.selectOption('#account-type', 'SAVINGS');
await humanType('#account-institution', 'ICICI Bank', 60);
await humanType('#account-balance', '85000', 70);
await humanType('input[name="lastFourDigits"]', '1084', 70);
await activeReadingPause(2000);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1500);

// Admire aggregated account cards (₹2,30,000 total balance)
await smoothMove(960, 360, 22);
await activeReadingPause(4500);

// ----------------------------------------------------------------------------
// CHAPTER 5: RECORDING REAL TRANSACTIONS & CASH FLOW (~65s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 5: Recording Real Transactions...');
await page.goto('http://127.0.0.1:5173/transactions', { waitUntil: 'networkidle' });
await setHUD(
  'CH 05/10 • REAL TRANSACTIONS & AUDIT',
  'Recording Live Income & Classified Outflows via Accessible Modal Forms',
  'Live Category Envelopes, Search Filtering & Instant Ledger Balance Updates'
);

await smoothMove(960, 320, 25);
await activeReadingPause(3000);

// 1. Add Monthly Salary Income (₹85,000)
await humanClick('button:has-text("Add Transaction"), button:has-text("Add Your First Transaction")');
await page.waitForTimeout(600);
await humanClick('button:has-text("Income")');
await page.waitForTimeout(300);
await humanType('input[placeholder="0.00"]', '85000', 70);
await humanType('input[placeholder*="Grocery Shopping"]', 'Monthly Salary Credit - TechCorp India', 60);
await activeReadingPause(1800);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1400);

// 2. Add Groceries Expense (₹4,500)
await humanClick('button:has-text("Add Transaction"), button:has-text("Add Your First Transaction")');
await page.waitForTimeout(600);
await humanType('input[placeholder="0.00"]', '4500', 70);
await humanType('input[placeholder*="Grocery Shopping"]', 'Nature Basket Organic Groceries', 60);
await activeReadingPause(1800);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1400);

// 3. Add Rent Expense (₹15,000)
await humanClick('button:has-text("Add Transaction"), button:has-text("Add Your First Transaction")');
await page.waitForTimeout(600);
await humanType('input[placeholder="0.00"]', '15000', 70);
await humanType('input[placeholder*="Grocery Shopping"]', 'Apartment Rent & Society Maintenance', 60);
await page.selectOption('[role="dialog"] select[name="category"]', 'Housing & Rent');
await activeReadingPause(1800);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1400);

// 4. Add Bills & Utilities Expense (₹2,800)
await humanClick('button:has-text("Add Transaction"), button:has-text("Add Your First Transaction")');
await page.waitForTimeout(600);
await humanType('input[placeholder="0.00"]', '2800', 70);
await humanType('input[placeholder*="Grocery Shopping"]', 'Electricity & High Speed Fiber Bill', 60);
await page.selectOption('[role="dialog"] select[name="category"]', 'Bills & Utilities');
await activeReadingPause(1800);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1400);

// Test Search Filter
const searchInput = page.locator('input[placeholder*="Search transactions"], input[placeholder*="Search"]').first();
if (await searchInput.isVisible()) {
  await humanType(searchInput, 'Groceries', 70);
  await activeReadingPause(2800);
  const clearSearchBtn = page.locator('button[aria-label="Clear search text"]').first();
  if (await clearSearchBtn.isVisible()) {
    await clearSearchBtn.click();
  } else {
    await searchInput.fill('');
  }
}
await activeReadingPause(2500);

// Hover across summary cards
await smoothMove(600, 240, 20); // Income
await activeReadingPause(3000);
await smoothMove(960, 240, 20); // Expense
await activeReadingPause(3000);

// ----------------------------------------------------------------------------
// CHAPTER 6: SMART BUDGETING & THRESHOLD ALERTS (~35s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 6: Smart Budgets...');
await page.goto('http://127.0.0.1:5173/budgets', { waitUntil: 'networkidle' });
await setHUD(
  'CH 06/10 • SMART BUDGET ENVELOPES',
  'Creating Category Spending Limit & Reconciling Live Outflows',
  'Proactive Overspending Prevention • 80% Utilization Alert Thresholds'
);

await smoothMove(960, 340, 25);
await activeReadingPause(3000);

// Create Food & Dining Budget
await humanClick('button:has-text("Create Budget"), button:has-text("Create Your First Budget")');
await page.waitForTimeout(600);
await humanType('#budget-name', 'Monthly Food & Dining Envelope', 60);
await page.selectOption('#budget-category', 'Food & Dining');
await humanType('#budget-amount', '10000', 70);
await activeReadingPause(2000);
await humanClick('[role="dialog"] button[type="submit"]');
await page.waitForTimeout(1500);

// Admire reconciled budget card (₹4,500 spent of ₹10,000 = 45% utilized)
await smoothMove(960, 420, 22);
await activeReadingPause(4500);

// ----------------------------------------------------------------------------
// CHAPTER 7: SAVINGS GOALS & WEALTH VAULTS (~32s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 7: Savings Goals & Vaults...');
await page.goto('http://127.0.0.1:5173/savings', { waitUntil: 'networkidle' });
await setHUD(
  'CH 07/10 • WEALTH GOALS & VAULTS',
  'Long-Term Capital Milestones & Emergency Reserve Vaults',
  'Compound Growth Projections & Milestone Contribution Envelopes'
);

await smoothMove(960, 360, 25);
await activeReadingPause(3000);

const createGoalBtn = page
  .locator('button:has-text("Create Goal"), button:has-text("Create Your First Goal"), button:has-text("New Goal")')
  .first();
if (await createGoalBtn.isVisible()) {
  await humanClick(createGoalBtn);
  await page.waitForTimeout(600);
  await humanType('#goal-name-input', 'Emergency Reserve Fund', 60);
  await humanType('#goal-target-amount-input', '200000', 70);
  await activeReadingPause(2000);
  await humanClick('[role="dialog"] button[type="submit"]');
  await page.waitForTimeout(1500);
}

await smoothMove(960, 420, 22);
await activeReadingPause(4000);

// ----------------------------------------------------------------------------
// CHAPTER 8: RECURRING BILLS & UTILITIES (~30s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 8: Recurring Payments & Bills...');
await page.goto('http://127.0.0.1:5173/recurring', { waitUntil: 'networkidle' });
await setHUD(
  'CH 08/10 • RECURRING BILLS & AUDIT',
  'Subscription Telemetry, Fixed Overheads & Upcoming Payment Schedules',
  'Zero Unmonitored Cash Outflows & Early Due Date Reminders'
);

await smoothMove(960, 380, 25);
await activeReadingPause(3500);

// Smooth scroll to inspect recurring timeline
await smoothScroll(400, 1200);
await smoothMove(960, 520, 20);
await activeReadingPause(3500);
await smoothScroll(-400, 1000);
await activeReadingPause(2500);

// ----------------------------------------------------------------------------
// CHAPTER 9: ANALYTICS & AI FINANCIAL INTELLIGENCE (~48s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 9: Analytics & AI Assistant...');
await page.goto('http://127.0.0.1:5173/analytics', { waitUntil: 'networkidle' });
await setHUD(
  'CH 09/10 • DEEP FINANCIAL ANALYTICS',
  'Mathematical Outflow Distribution, Velocity & Savings Efficiency',
  'Live Categorical Breakdown Calculated From Real Active User Data'
);

await smoothMove(640, 460, 25);
await activeReadingPause(4000);
await smoothMove(1280, 460, 25);
await activeReadingPause(4000);

// Smooth scroll through analytics telemetry
await smoothScroll(500, 1400);
await smoothMove(960, 540, 22);
await activeReadingPause(4000);

// Switch to AI Assistant / AI Coach
await page.goto('http://127.0.0.1:5173/ai-assistant', { waitUntil: 'networkidle' });
await setHUD(
  'CH 09/10 • AI FINANCIAL ADVISOR',
  'Proactive Intelligence, Spending Optimization & 200/Day Rate Limiter',
  'Daily Usage Telemetry • Queueing For Tomorrow & Context-Aware Telemetry'
);

await smoothMove(960, 320, 25);
await activeReadingPause(3200);

// Type prompt to AI Assistant
const aiInput = page.locator('textarea, input[placeholder*="Ask"]').first();
if (await aiInput.isVisible()) {
  await humanType(aiInput, 'Analyze my current ₹85k salary against my ₹22.3k expenses and suggest an optimal allocation.', 50);
  await activeReadingPause(2000);
  const sendBtn = page.locator('button[type="submit"], button:has-text("Send")').first();
  if (await sendBtn.isVisible()) {
    await humanClick(sendBtn);
  }
}
await activeReadingPause(5000);

// ----------------------------------------------------------------------------
// CHAPTER 10: REPORTS, NOTIFICATIONS, PWA & SETTINGS (~45s)
// ----------------------------------------------------------------------------
console.log('📌 Executing Chapter 10: Reports, Notifications & Settings...');

// Reports Page
await page.goto('http://127.0.0.1:5173/reports', { waitUntil: 'networkidle' });
await setHUD(
  'CH 10/10 • FINANCIAL REPORTS & EXPORT',
  'One-Click Auditable Statements, Tax Summaries & Formatted CSV Exports',
  'Tamper-Proof Financial Accounting For Indian Financial Years'
);
await smoothMove(960, 380, 25);
await activeReadingPause(3500);

// Notifications Page (Responsive Drawer)
await page.goto('http://127.0.0.1:5173/notifications', { waitUntil: 'networkidle' });
await setHUD(
  'CH 10/10 • NOTIFICATION CENTER',
  'Mobile-Responsive Alerts, System Audits & Threshold Warning Logs',
  'Zero Horizontal Overflow • Clean Responsive Presentation Across All Devices'
);
await smoothMove(960, 400, 25);
await activeReadingPause(3500);

// Settings Page (Theme Toggles, Currency & Standardized Red Destructive Buttons)
await page.goto('http://127.0.0.1:5173/settings', { waitUntil: 'networkidle' });
await setHUD(
  'CH 10/10 • SETTINGS & DANGER ZONE',
  'INR (₹) Currency Customization, PWA Manifest & Standardized Red Actions',
  'Zero Browser Alert Overrides • Custom Accessible Dialogs & Secure Encryption'
);
await smoothMove(960, 400, 25);
await activeReadingPause(3500);

// Smooth scroll to inspect Red Destructive Buttons (Danger Zone)
await smoothScroll(550, 1300);
await smoothMove(960, 560, 22);
await activeReadingPause(3500);

// Return to Dashboard for the Grand Finale
await page.goto('http://127.0.0.1:5173/dashboard', { waitUntil: 'networkidle' });
await setHUD(
  'SPENDX MASTER PRODUCT TOUR COMPLETE',
  'All 10 Core Modules Verified In Real-Time With 100% Real Live User Data',
  'Next-Gen FinTech Architecture • Exceptional Smoothness, Speed & Security'
);
await smoothMove(960, 360, 25);
await activeReadingPause(5000);

const totalElapsedSec = Math.round((Date.now() - startTime) / 1000);
console.log(`⏱ Total walkthrough recording elapsed time: ${totalElapsedSec}s`);

// Close context to finalize video writing
console.log('💾 Finalizing video container...');
await page.close();
await context.close();
await browser.close();

// Find recorded video in demo-video/
const files = fs
  .readdirSync(DEMO_DIR)
  .filter((f) => f.endsWith('.webm'))
  .map((f) => ({ name: f, time: fs.statSync(path.join(DEMO_DIR, f)).mtimeMs }))
  .sort((a, b) => b.time - a.time);

if (files.length === 0) {
  throw new Error('❌ No video file recorded in demo-video/');
}
const recordedWebm = path.resolve(DEMO_DIR, files[0].name);
console.log(`📹 Raw WebM saved: ${recordedWebm}`);

// 4. Convert to High-Quality 1080p60 H.264 MP4 with ffmpeg
console.log('🔄 Transcoding to crystal-clear 1080p60 H.264 MP4...');
const ffmpegCmd = `ffmpeg -y -i "${recordedWebm}" -c:v libx264 -pix_fmt yuv420p -r 60 -preset medium -crf 18 -an "${FINAL_MP4_PATH}"`;
execSync(ffmpegCmd, { stdio: 'inherit' });

// Also copy to demo-video/SpendX_Full_Walkthrough_1080p.mp4 for convenience
const copyDest = path.resolve(DEMO_DIR, 'SpendX_Full_Walkthrough_1080p.mp4');
fs.copyFileSync(FINAL_MP4_PATH, copyDest);

// 5. Measure Final Video Metrics with ffprobe
const durationRaw = execSync(
  `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${FINAL_MP4_PATH}"`,
  { encoding: 'utf-8' }
).trim();
const finalDurationSec = parseFloat(durationRaw);
const finalMinutes = Math.floor(finalDurationSec / 60);
const finalSeconds = Math.round(finalDurationSec % 60);
const finalDurationFormatted = `${String(finalMinutes).padStart(2, '0')}:${String(finalSeconds).padStart(2, '0')}`;

const stats = fs.statSync(FINAL_MP4_PATH);
const finalFileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('================================================================');
console.log('🎉 SPENDX MASTER VIDEO DELIVERABLE GENERATED SUCCESSFULLY');
console.log(`📁 File: ${FINAL_MP4_PATH}`);
console.log(`⏱ Duration: ${finalDurationFormatted} (${finalDurationSec.toFixed(1)}s)`);
console.log(`📐 Resolution: 1920x1080 @ 60fps (Full-HD)`);
console.log(`💾 Size: ${finalFileSizeMB} MB`);
console.log('================================================================');
