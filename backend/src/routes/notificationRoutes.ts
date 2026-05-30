import { Router } from 'express';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getMyNotifications);
router.patch('/mark-all', protect, markAllNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);
router.delete('/:id', protect, deleteNotification);

export default router;
