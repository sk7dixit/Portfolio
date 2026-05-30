import { Router } from 'express';
import { logVisit, getMyAnalytics } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/log', logVisit);
router.get('/my-stats', protect, getMyAnalytics);

export default router;
