import { Router } from 'express';
import { 
  createMessage, 
  getMyMessages, 
  markMessageRead, 
  deleteMessage,
  updateMessageStatus,
  updateMessageNotes,
  createMessageReply
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

// Public: portfolio visitors posting connection signals
router.post('/', createMessage);

// Protected: administrative inbox management
router.get('/', protect, getMyMessages);
router.patch('/:id/read', protect, markMessageRead);
router.patch('/:id/status', protect, updateMessageStatus);
router.patch('/:id/notes', protect, updateMessageNotes);
router.post('/:id/reply', protect, createMessageReply);
router.delete('/:id', protect, deleteMessage);

export default router;
