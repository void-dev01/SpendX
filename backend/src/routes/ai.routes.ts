import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAIStatus,
  getEligibleModels,
  getInsights,
  bookmarkInsight,
  dismissInsight,
  askCoach,
  getSessions,
  getSessionMessages,
  deleteSession,
} from '../controllers/ai.controller.js';
import {
  getAIQuota,
  queueAIMessage,
  getQueuedMessages,
  updateQueuedMessage,
  cancelQueuedMessage,
} from '../controllers/aiQuota.controller.js';

const router = Router();

// Public telemetry
router.get('/status', getAIStatus);
router.get('/models', getEligibleModels);

// Daily Quota & Next-Day Scheduling Queue
router.get('/quota', requireAuth, getAIQuota);
router.post('/queue', requireAuth, queueAIMessage);
router.get('/queue', requireAuth, getQueuedMessages);
router.patch('/queue/:id', requireAuth, updateQueuedMessage);
router.delete('/queue/:id', requireAuth, cancelQueuedMessage);

// Authenticated AI capabilities
router.get('/insights', requireAuth, getInsights);
router.patch('/insights/:id/bookmark', requireAuth, bookmarkInsight);
router.patch('/insights/:id/dismiss', requireAuth, dismissInsight);
router.post('/coach', requireAuth, askCoach);

// Persistent Chat Sessions
router.get('/sessions', requireAuth, getSessions);
router.get('/sessions/:id/messages', requireAuth, getSessionMessages);
router.delete('/sessions/:id', requireAuth, deleteSession);

export default router;
