import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { SchedulerService } from '../src/services/scheduler.service.js';
import { NotificationService } from '../src/services/notification.service.js';

describe('Background Automation & Scheduler Jobs', () => {
  const app = createApp();
  const testUserId = 'test-automation-user';
  const authHeader = `Bearer test-token-${testUserId}`;

  beforeEach(() => {
    NotificationService.resetMemory();
  });

  describe('Scheduler Lifecycle', () => {
    it('starts and stops background scheduler cleanly', () => {
      SchedulerService.start(5000);
      expect(SchedulerService.getStatus().isRunning).toBe(true);

      SchedulerService.stop();
      expect(SchedulerService.getStatus().isRunning).toBe(false);
    });
  });

  describe('Recurring Payment Monitor Job', () => {
    it('detects overdue and due payments and generates notifications', async () => {
      const today = new Date().toISOString();
      const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

      const count = await SchedulerService.checkRecurringPayments([
        {
          id: 'rec_1',
          userId: testUserId,
          name: 'Office Broadband',
          amount: 1500,
          nextDueDate: pastDate,
        },
        {
          id: 'rec_2',
          userId: testUserId,
          name: 'Cloud Hosting',
          amount: 3200,
          nextDueDate: today,
        },
      ]);

      expect(count).toBe(2);

      const notifs = await NotificationService.getUserNotifications(testUserId);
      expect(notifs.length).toBe(2);
      expect(notifs.some((n) => n.title.includes('Overdue'))).toBe(true);
      expect(notifs.some((n) => n.title.includes('Due Today'))).toBe(true);
    });
  });

  describe('Budget Consumption Monitor Job', () => {
    it('generates threshold warnings when budgets hit critical or exceeded states', async () => {
      const count = await SchedulerService.checkBudgetThresholds([
        {
          id: 'bgt_1',
          userId: testUserId,
          name: 'Fine Dining',
          allocatedAmount: 5000,
          spentAmount: 5500, // 110% - Exceeded
        },
        {
          id: 'bgt_2',
          userId: testUserId,
          name: 'Groceries',
          allocatedAmount: 10000,
          spentAmount: 9200, // 92% - Critical
        },
        {
          id: 'bgt_3',
          userId: testUserId,
          name: 'Transportation',
          allocatedAmount: 4000,
          spentAmount: 1500, // 37.5% - Normal
        },
      ]);

      expect(count).toBe(2);

      const notifs = await NotificationService.getUserNotifications(testUserId);
      expect(notifs.length).toBe(2);
      expect(notifs.some((n) => n.title.includes('Budget Exceeded'))).toBe(true);
      expect(notifs.some((n) => n.title.includes('Budget Critical'))).toBe(true);
    });
  });

  describe('Savings Goal Milestones Job', () => {
    it('generates celebration notifications on reaching 50% and 100% milestones', async () => {
      const count = await SchedulerService.checkSavingsMilestones([
        {
          id: 'goal_1',
          userId: testUserId,
          name: 'Emergency Fund',
          targetAmount: 100000,
          currentAmount: 100000, // 100%
        },
        {
          id: 'goal_2',
          userId: testUserId,
          name: 'Laptop Upgrade',
          targetAmount: 80000,
          currentAmount: 41000, // 51.25%
        },
        {
          id: 'goal_3',
          userId: testUserId,
          name: 'Japan Vacation',
          targetAmount: 200000,
          currentAmount: 20000, // 10%
        },
      ]);

      expect(count).toBe(2);

      const notifs = await NotificationService.getUserNotifications(testUserId);
      expect(notifs.some((n) => n.title.includes('Goal Achieved'))).toBe(true);
      expect(notifs.some((n) => n.title.includes('Halfway Milestone'))).toBe(true);
    });
  });

  describe('Notification Controller Endpoints', () => {
    it('retrieves user notifications and unread count via GET /api/v1/notifications', async () => {
      await NotificationService.createNotification(
        testUserId,
        'SECURITY_ALERT',
        'New Device Login',
        'A login was detected from Chrome on Windows'
      );

      const res = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notifications.length).toBe(1);
      expect(res.body.data.unreadCount).toBe(1);
    });

    it('marks notification as read via PATCH /api/v1/notifications/:id/read', async () => {
      const notif = await NotificationService.createNotification(
        testUserId,
        'WEEKLY_DIGEST',
        'Weekly Spend Digest',
        'Your spending was down 12% this week.'
      );

      const patchRes = await request(app)
        .patch(`/api/v1/notifications/${notif.id}/read`)
        .set('Authorization', authHeader);

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.success).toBe(true);

      const getRes = await request(app)
        .get('/api/v1/notifications')
        .set('Authorization', authHeader);

      expect(getRes.body.data.unreadCount).toBe(0);
      expect(getRes.body.data.notifications[0].isRead).toBe(true);
    });

    it('rejects unauthenticated notification requests with 401', async () => {
      const res = await request(app).get('/api/v1/notifications');
      expect(res.status).toBe(401);
    });
  });
});
