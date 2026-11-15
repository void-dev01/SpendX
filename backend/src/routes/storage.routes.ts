import { Router } from 'express';
import {
  getUploadUrl,
  getDownloadUrl,
  registerUploadedDocument,
  listDocuments,
} from '../controllers/storage.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/upload-url', getUploadUrl);
router.post('/download-url', getDownloadUrl);
router.post('/register', registerUploadedDocument);
router.get('/documents', listDocuments);

export default router;
