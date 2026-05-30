import { Router } from 'express';
import {
  getSDContactCMS,
  upsertSDContactCMS,
  getSDMessages,
  createSDMessage,
  updateSDMessageStatus,
  deleteSDMessage
} from '../controllers/sdCommunicationController';
import { protect } from '../middleware/auth';

const router = Router();

// Contact CMS Config Endpoints
router.get('/contact-cms', getSDContactCMS);
router.post('/contact-cms', protect, upsertSDContactCMS);

// Inbound Messaging Endpoints
router.get('/messages', protect, getSDMessages);
router.post('/messages', createSDMessage); // Public form submission
router.put('/messages/:id', protect, updateSDMessageStatus);
router.delete('/messages/:id', protect, deleteSDMessage);

export default router;
