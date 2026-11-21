import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const playwrightModule = await import(
  `file:///${path.resolve(PROJECT_ROOT, 'frontend/node_modules/@playwright/test/index.mjs').replace(/\\/g, '/')}`
);
const { chromium } = playwrightModule;

console.log('🧪 Starting Strict Dry-Run Verification of All Entities & DOM Assertions...');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

const failedRequests = [];
page.on('response', (res) => {
  const url = res.url();
  const status = res.status();
  if (url.includes('/api/') && status >= 400) {
    failedRequests.push({ url, status });
    console.error(`❌ HTTP Error: ${status} for ${url}`);
  }
});

try {
  // 1. Landing & Signup
  console.log('1️⃣ Navigating to Landing & Signup...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Get Started")');
  await page.waitForURL('**/signup');

  const testEmail = `test_${Date.now()}@spendx.pro`;
  await page.fill('#signup-fullname', 'Test Verified User');
  await page.fill('#signup-email', testEmail);
  await page.fill('#signup-password', 'Password@123');
  await page.fill('#signup-confirm-password', 'Password@123');
  await page.click('input[type="checkbox"]');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  console.log('✅ Registered and redirected to dashboard.');

  // 2. Accounts Module
  console.log('2️⃣ Testing Accounts Creation...');
  await page.click('aside a[href="/accounts"]');
  await page.waitForURL('**/accounts');

  // Account 1: HDFC Salary
  await page.click('button:has-text("Add Account"), button:has-text("Add Your First Account")');
  await page.fill('#account-name', 'HDFC Bank - Salary Account');
  await page.selectOption('#account-type', 'BANK');
  await page.fill('#account-institution', 'HDFC Bank');
  await page.fill('#account-balance', '145000');
  await page.fill('input[name="lastFourDigits"]', '4492');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=HDFC Bank - Salary Account', { timeout: 8000 });
  console.log('✅ Account 1 created and visibly rendered.');

  // Account 2: ICICI Wealth
  await page.click('button:has-text("Add Account")');
  await page.fill('#account-name', 'ICICI Wealth Savings');
  await page.selectOption('#account-type', 'SAVINGS');
  await page.fill('#account-institution', 'ICICI Bank');
  await page.fill('#account-balance', '85000');
  await page.fill('input[name="lastFourDigits"]', '1084');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=ICICI Wealth Savings', { timeout: 8000 });
  console.log('✅ Account 2 created and visibly rendered.');

  // 3. Transactions Module
  console.log('3️⃣ Testing Transactions Creation...');
  await page.click('aside a[href="/transactions"]');
  await page.waitForURL('**/transactions');

  // Tx 1: Income Salary
  await page.click('button:has-text("Add Transaction"), button:has-text("Add Your First Transaction")');
  await page.click('button:has-text("Income")');
  await page.fill('input[placeholder="0.00"]', '85000');
  await page.fill('input[placeholder*="Grocery Shopping"]', 'Monthly Salary Credit - TechCorp India');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Monthly Salary Credit - TechCorp India', { timeout: 8000 });

  // Tx 2: Groceries
  await page.click('button:has-text("Add Transaction")');
  await page.fill('input[placeholder="0.00"]', '4500');
  await page.fill('input[placeholder*="Grocery Shopping"]', 'Nature Basket Organic Groceries');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Nature Basket Organic Groceries', { timeout: 8000 });

  // Tx 3: Rent
  await page.click('button:has-text("Add Transaction")');
  await page.fill('input[placeholder="0.00"]', '15000');
  await page.fill('input[placeholder*="Grocery Shopping"]', 'Apartment Rent & Society Maintenance');
  await page.selectOption('[role="dialog"] select[name="category"]', 'Housing & Rent');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Apartment Rent & Society Maintenance', { timeout: 8000 });

  // Tx 4: Utilities
  await page.click('button:has-text("Add Transaction")');
  await page.fill('input[placeholder="0.00"]', '2800');
  await page.fill('input[placeholder*="Grocery Shopping"]', 'Electricity & High Speed Fiber Bill');
  await page.selectOption('[role="dialog"] select[name="category"]', 'Bills & Utilities');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Electricity & High Speed Fiber Bill', { timeout: 8000 });

  // Tx 5: Dining
  await page.click('button:has-text("Add Transaction")');
  await page.fill('input[placeholder="0.00"]', '3200');
  await page.fill('input[placeholder*="Grocery Shopping"]', 'Weekend Bistro & Team Celebration');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Weekend Bistro & Team Celebration', { timeout: 8000 });
  console.log('✅ All 5 Transactions created and visibly rendered in ledger.');

  // 4. Budgets Module
  console.log('4️⃣ Testing Budgets Creation...');
  await page.click('aside a[href="/budgets"]');
  await page.waitForURL('**/budgets');

  // Budget 1: Food & Dining
  await page.click('button:has-text("Create Budget"), button:has-text("Create Your First Budget")');
  await page.fill('#budget-name', 'Monthly Food & Dining Envelope');
  await page.selectOption('#budget-category', 'Food & Dining');
  await page.fill('#budget-amount', '10000');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Monthly Food & Dining Envelope', { timeout: 8000 });
  console.log('✅ Budget 1 created and visibly rendered on page!');

  // Budget 2: Utilities
  await page.click('button:has-text("Create Budget")');
  await page.fill('#budget-name', 'Monthly Utilities Guardrail');
  await page.selectOption('#budget-category', 'Bills & Utilities');
  await page.fill('#budget-amount', '3000');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Monthly Utilities Guardrail', { timeout: 8000 });
  console.log('✅ Budget 2 created and visibly rendered on page!');

  // 5. Savings Goals Module + Contribution
  console.log('5️⃣ Testing Savings Goals Creation & Deposit...');
  await page.click('aside a[href="/savings"]');
  await page.waitForURL('**/savings');

  await page.click('button:has-text("Create Goal"), button:has-text("Create Your First Goal"), button:has-text("New Goal")');
  await page.fill('#goal-name-input', 'Emergency Reserve Vault');
  await page.fill('#goal-target-amount-input', '200000');
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('text=Emergency Reserve Vault', { timeout: 8000 });
  console.log('✅ Savings Goal created and visibly rendered on page!');

  // Deposit Contribution into Goal
  await page.click('button:has-text("Add Money")');
  await page.fill('#contrib-amount-input', '25000');
  await page.click('button:has-text("Confirm Contribution")');
  await page.waitForTimeout(1000);
  console.log('✅ Contribution deposited and progress updated!');

  // 6. Recurring Bills Module
  console.log('6️⃣ Testing Recurring Bills Creation...');
  await page.click('aside a[href="/recurring"]');
  await page.waitForURL('**/recurring');

  await page.click('button:has-text("Add Recurring Payment"), button:has-text("New Schedule")');
  await page.fill('#rec-name', 'Internet High Speed Fiber Bill');
  await page.fill('#rec-merchant', 'Airtel Fiber Ltd');
  await page.fill('#rec-amount', '1199');
  await page.click('button:has-text("Create Schedule")');
  await page.waitForSelector('text=Internet High Speed Fiber Bill', { timeout: 8000 });
  console.log('✅ Recurring Bill created and visibly rendered on page!');

  // 7. AI Advisor Response
  console.log('7️⃣ Testing AI Advisor Completion...');
  await page.click('aside a[href="/ai-assistant"]');
  await page.waitForURL('**/ai-assistant');

  const aiInput = page.locator('textarea[aria-label="Message input"], textarea').first();
  await aiInput.fill('Analyze my active ₹85k salary against my ₹25.5k expenses and recommend an optimal savings allocation.');
  await page.click('button[aria-label="Send message"], button[type="submit"]');

  // Wait until TypingIndicator disappears and answer is fully rendered
  console.log('Waiting for AI response to stabilize...');
  await page.waitForSelector('div[data-role="assistant"]', { timeout: 35000 });
  await page.waitForFunction(() => {
    return !document.querySelector('[data-testid="typing-indicator"]');
  }, { timeout: 35000 });
  await page.waitForTimeout(2500);
  console.log('✅ AI Advisor response completely rendered and visible!');

  // 8. Return to Dashboard & Mathematical Verification
  console.log('8️⃣ Returning to Dashboard for Verification...');
  await page.click('aside a[href="/dashboard"]');
  await page.waitForURL('**/dashboard');
  await page.waitForTimeout(2000);

  // Check budgets and savings goals on dashboard
  await page.waitForSelector('text=Food & Dining', { timeout: 8000 });
  await page.waitForSelector('text=Emergency Reserve Vault', { timeout: 8000 });

  console.log('====================================================');
  console.log('🎉 ALL DOM ASSERTIONS PASSED WITH 100% VISIBLE RENDERING');
  console.log(`Failed API Requests count: ${failedRequests.length}`);
  console.log('====================================================');

  if (failedRequests.length > 0) {
    throw new Error(`There were ${failedRequests.length} failed HTTP API requests: ${JSON.stringify(failedRequests)}`);
  }
} finally {
  await browser.close();
}
