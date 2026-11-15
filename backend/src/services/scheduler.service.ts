import { NotificationService } from './notification.service.js';
import { logger } from '../utils/logger.js';
import { supabaseClient } from '../config/supabase.js';

export interface RecurringPaymentCheckItem {
  id: string;
  userId: string;
  name: string;
  amount: number;
  nextDueDate: string;
}

export interface BudgetCheckItem {
  id: string;
  userId: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
}

export interface SavingsGoalCheckItem {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export class SchedulerService {
  private static timer: NodeJS.Timeout | null = null;
  private static isRunning: boolean = false;

  /**
   * Evaluates recurring payments and sends due alerts
   */
  public static async checkRecurringPayments(
    mockItems?: RecurringPaymentCheckItem[]
  ): Promise<number> {
    let alertedCount = 0;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const items: RecurringPaymentCheckItem[] = mockItems || [];

    if (!mockItems && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('recurring_payments')
          .select('id, user_id, name, amount, next_due_date')
          .lte('next_due_date', threeDaysFromNow)
          .neq('status', 'PAID')
          .neq('status', 'CANCELLED');

        if (!error && data) {
          items.push(
            ...data.map((d) => ({
              id: d.id,
              userId: d.user_id,
              name: d.name,
              amount: Number(d.amount),
              nextDueDate: d.next_due_date,
            }))
          );
        }
      } catch (err) {
        logger.error({ err }, 'Error querying recurring payments for scheduler');
      }
    }

    for (const item of items) {
      const itemDate = new Date(item.nextDueDate).toISOString().split('T')[0];
      let title = '';
      let message = '';

      if (itemDate < todayStr) {
        title = `Overdue: ${item.name} Payment`;
        message = `Your payment of ₹${item.amount.toLocaleString('en-IN')} was due on ${itemDate}. Please settle to avoid penalties.`;
      } else if (itemDate === todayStr) {
        title = `Due Today: ${item.name}`;
        message = `Reminder: ₹${item.amount.toLocaleString('en-IN')} is scheduled for payment today.`;
      } else {
        title = `Upcoming: ${item.name}`;
        message = `₹${item.amount.toLocaleString('en-IN')} will be due in upcoming days on ${itemDate}.`;
      }

      await NotificationService.createNotification(
        item.userId,
        'RECURRING_DUE',
        title,
        message,
        `/recurring/${item.id}`
      );
      alertedCount++;
    }

    return alertedCount;
  }

  /**
   * Evaluates budget consumption and sends threshold warnings
   */
  public static async checkBudgetThresholds(
    mockBudgets?: BudgetCheckItem[]
  ): Promise<number> {
    let alertedCount = 0;
    const budgets: BudgetCheckItem[] = mockBudgets || [];

    for (const budget of budgets) {
      const ratio = budget.spentAmount / budget.allocatedAmount;

      if (ratio >= 1.0) {
        await NotificationService.createNotification(
          budget.userId,
          'BUDGET_THRESHOLD',
          `Budget Exceeded: ${budget.name}`,
          `You have spent ₹${budget.spentAmount.toLocaleString('en-IN')} (${Math.round(ratio * 100)}%) of your ₹${budget.allocatedAmount.toLocaleString('en-IN')} allocated limit.`,
          '/budgets'
        );
        alertedCount++;
      } else if (ratio >= 0.90) {
        await NotificationService.createNotification(
          budget.userId,
          'BUDGET_THRESHOLD',
          `Budget Critical: ${budget.name}`,
          `You have utilized ${Math.round(ratio * 100)}% of your budget limit. Only ₹${(budget.allocatedAmount - budget.spentAmount).toLocaleString('en-IN')} remaining.`,
          '/budgets'
        );
        alertedCount++;
      }
    }

    return alertedCount;
  }

  /**
   * Evaluates savings goal milestones and sends celebration/progress alerts
   */
  public static async checkSavingsMilestones(
    mockGoals?: SavingsGoalCheckItem[]
  ): Promise<number> {
    let alertedCount = 0;
    const goals: SavingsGoalCheckItem[] = mockGoals || [];

    for (const goal of goals) {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;

      if (percentage >= 100) {
        await NotificationService.createNotification(
          goal.userId,
          'SAVINGS_MILESTONE',
          `Goal Achieved: ${goal.name}! 🎯`,
          `Congratulations! You have reached 100% of your target amount (₹${goal.targetAmount.toLocaleString('en-IN')}).`,
          '/savings'
        );
        alertedCount++;
      } else if (percentage >= 50 && percentage < 55) {
        await NotificationService.createNotification(
          goal.userId,
          'SAVINGS_MILESTONE',
          `Halfway Milestone: ${goal.name} 🚀`,
          `Great progress! You have reached 50% (₹${goal.currentAmount.toLocaleString('en-IN')}) of your savings target.`,
          '/savings'
        );
        alertedCount++;
      }
    }

    return alertedCount;
  }

  /**
   * Run all scheduled jobs in sequence
   */
  public static async runAllJobs(): Promise<{
    recurringAlerts: number;
    budgetAlerts: number;
    savingsMilestones: number;
  }> {
    logger.info('Executing scheduled financial monitoring cycle...');
    const recurringAlerts = await this.checkRecurringPayments();
    const budgetAlerts = await this.checkBudgetThresholds();
    const savingsMilestones = await this.checkSavingsMilestones();

    logger.info({ recurringAlerts, budgetAlerts, savingsMilestones }, 'Scheduler cycle finished');
    return { recurringAlerts, budgetAlerts, savingsMilestones };
  }

  /**
   * Start recurring background timer
   */
  public static start(intervalMs: number = 3600000): void {
    if (this.isRunning) return;
    this.isRunning = true;
    logger.info(`Starting SPENDX background automation scheduler (interval: ${intervalMs}ms)`);

    this.timer = setInterval(() => {
      this.runAllJobs().catch((err) => {
        logger.error({ err }, 'Error during background scheduler execution');
      });
    }, intervalMs);
  }

  /**
   * Gracefully stop the scheduler
   */
  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    logger.info('SPENDX background automation scheduler stopped.');
  }

  public static getStatus(): { isRunning: boolean } {
    return { isRunning: this.isRunning };
  }
}
