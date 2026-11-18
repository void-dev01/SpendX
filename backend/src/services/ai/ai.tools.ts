import { FinancialCalculationService } from '../financial.service.js';
import { AccountService } from '../account.service.js';
import { TransactionService } from '../transaction.service.js';
import { BudgetService } from '../budget.service.js';
import { SavingsService } from '../savings.service.js';
import { RecurringService } from '../recurring.service.js';
import { logger } from '../../utils/logger.js';

export interface FinancialToolDefinition {
  name: string;
  description: string;
  execute: (userId: string, args: Record<string, any>) => Promise<any>;
}

export class FinancialToolsService {
  private static tools: Map<string, FinancialToolDefinition> = new Map([
    [
      'get_financial_overview',
      {
        name: 'get_financial_overview',
        description: 'Retrieves current authoritative net worth, assets, liabilities, total income, expenses, and cash flow',
        execute: async (userId, args) => {
          const period = args.period || 'this_month';
          return await FinancialCalculationService.calculateFinancialOverview(userId, period);
        },
      },
    ],
    [
      'get_account_balances',
      {
        name: 'get_account_balances',
        description: 'Retrieves active linked bank, savings, cash, and credit card accounts with current balances',
        execute: async (userId) => {
          const accounts = await AccountService.getAccounts(userId);
          return accounts.map((a: any) => ({
            name: a.name,
            type: a.type,
            balance: Number(a.balance),
            currency: a.currency,
          }));
        },
      },
    ],
    [
      'get_transactions',
      {
        name: 'get_transactions',
        description: 'Searches and retrieves recent transactions with category, amount, and date filters',
        execute: async (userId, args) => {
          const res = await TransactionService.getTransactions(userId, {
            limit: args.limit || 8,
            type: args.type,
            category: args.category,
            search: args.search,
          });
          return res.items.map((t) => ({
            description: t.description,
            amount: t.amount,
            type: t.type,
            category: t.category,
            date: t.date,
          }));
        },
      },
    ],
    [
      'get_category_spending',
      {
        name: 'get_category_spending',
        description: 'Calculates breakdown of expenses grouped by category with amounts and percentages',
        execute: async (userId, args) => {
          const period = args.period || 'this_month';
          return await FinancialCalculationService.calculateCategoryBreakdown(userId, period);
        },
      },
    ],
    [
      'get_budget_status',
      {
        name: 'get_budget_status',
        description: 'Retrieves monthly budgets, allocated limits, actual spent amount, and utilization percentages',
        execute: async (userId) => {
          const budgets = await BudgetService.getBudgets(userId);
          return budgets.map((b) => ({
            category: b.category,
            allocatedAmount: b.allocatedAmount,
            spent: b.spent,
            remaining: b.remaining,
            utilizationPercentage: b.utilizationPercentage,
            status: b.status,
          }));
        },
      },
    ],
    [
      'get_savings_progress',
      {
        name: 'get_savings_progress',
        description: 'Retrieves active savings goals with target amount, saved balance, and completion percentage',
        execute: async (userId) => {
          const goals = await SavingsService.getGoals(userId);
          return goals.map((g) => ({
            name: g.name,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            progressPercentage: g.progressPercentage,
            remainingAmount: g.remainingAmount,
          }));
        },
      },
    ],
    [
      'get_recurring_payments',
      {
        name: 'get_recurring_payments',
        description: 'Lists upcoming recurring subscriptions and bills with due dates',
        execute: async (userId) => {
          const rec = await RecurringService.getRecurringPayments(userId);
          return rec.map((r) => ({
            name: r.name,
            merchant: r.merchant,
            amount: r.amount,
            nextDueDate: r.nextDueDate,
            frequency: r.frequency,
            status: r.status,
          }));
        },
      },
    ],
    [
      'compare_financial_periods',
      {
        name: 'compare_financial_periods',
        description: 'Compares total income, expenses, and savings between this month and last month',
        execute: async (userId) => {
          const thisMonth = await FinancialCalculationService.calculateFinancialOverview(userId, 'this_month');
          const lastMonth = await FinancialCalculationService.calculateFinancialOverview(userId, 'last_month');
          return {
            thisMonth: {
              income: thisMonth.totalIncome,
              expenses: thisMonth.totalExpenses,
              net: thisMonth.netCashFlow,
            },
            lastMonth: {
              income: lastMonth.totalIncome,
              expenses: lastMonth.totalExpenses,
              net: lastMonth.netCashFlow,
            },
            expenseDifference: thisMonth.totalExpenses - lastMonth.totalExpenses,
          };
        },
      },
    ],
    [
      'get_cash_flow_summary',
      {
        name: 'get_cash_flow_summary',
        description: 'Retrieves net cash flow surplus or deficit analysis for the user',
        execute: async (userId, args) => {
          const period = args.period || 'this_month';
          const ov = await FinancialCalculationService.calculateFinancialOverview(userId, period);
          return {
            period,
            totalIncome: ov.totalIncome,
            totalExpenses: ov.totalExpenses,
            netCashFlow: ov.netCashFlow,
            isSurplus: ov.netCashFlow >= 0,
            savingsRate: ov.savingsRate,
          };
        },
      },
    ],
  ]);

  public static async executeTool(toolName: string, userId: string, args: Record<string, any> = {}): Promise<any> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      logger.warn({ toolName }, 'Requested tool not recognized');
      return null;
    }

    try {
      logger.info({ toolName, userId }, 'Executing authorized financial tool');
      return await tool.execute(userId, args);
    } catch (err) {
      logger.error({ err, toolName, userId }, 'Tool execution failed');
      return null;
    }
  }

  public static detectRequiredTools(query: string): string[] {
    const q = query.toLowerCase();
    const detected: string[] = [];

    if (q.includes('compare') || q.includes('last month') || q.includes('versus') || q.includes('vs')) {
      detected.push('compare_financial_periods');
    }
    if (q.includes('spend') || q.includes('expense') || q.includes('kaha kharch') || q.includes('category')) {
      detected.push('get_category_spending');
    }
    if (q.includes('account') || q.includes('balance') || q.includes('bank') || q.includes('paise')) {
      detected.push('get_account_balances');
    }
    if (q.includes('budget') || q.includes('limit') || q.includes('overspend')) {
      detected.push('get_budget_status');
    }
    if (q.includes('saving') || q.includes('saved') || q.includes('save') || q.includes('goal') || q.includes('bachat')) {
      detected.push('get_savings_progress');
    }
    if (q.includes('recurring') || q.includes('subscription') || q.includes('bill') || q.includes('upcoming')) {
      detected.push('get_recurring_payments');
    }
    if (q.includes('recent') || q.includes('transaction') || q.includes('last purchase')) {
      detected.push('get_transactions');
    }

    // Default overview if nothing specific
    if (detected.length === 0) {
      detected.push('get_financial_overview');
    }

    return detected;
  }
}
