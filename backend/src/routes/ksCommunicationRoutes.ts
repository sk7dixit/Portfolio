import { Router } from 'express';
import {
  getKSContactCMS,
  upsertKSContactCMS,
  getKSMessages,
  createKSMessage,
  updateKSMessageStatus,
  deleteKSMessage
} from '../controllers/ksCommunicationController';
import { protect } from '../middleware/auth';

const router = Router();

// Contact CMS Config Endpoints
router.get('/contact-cms', getKSContactCMS);
router.post('/contact-cms', protect, upsertKSContactCMS);

// Inbound Messaging Endpoints
router.get('/messages', protect, getKSMessages);
router.post('/messages', createKSMessage); // Public form submission
router.put('/messages/:id', protect, updateKSMessageStatus);
router.delete('/messages/:id', protect, deleteKSMessage);

export default router;
