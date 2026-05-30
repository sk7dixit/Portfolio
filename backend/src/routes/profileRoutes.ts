import { Router } from 'express';
import { 
  getProfileByUsername, 
  updateProfile,
  updateIdentity,
  saveDesignSnapshot,
  restoreDesignSnapshot,
  getDesignVersions
} from '../controllers/portfolioController';
import { protect } from '../middleware/auth';

const router = Router();

// Experience Studio Actions (protected)
router.get('/versions', protect, getDesignVersions);
router.post('/snapshot', protect, saveDesignSnapshot);
router.post('/restore', protect, restoreDesignSnapshot);

// GET /api/profile/:username (public)
router.get('/:username', getProfileByUsername);

// PUT /api/profile (protected)
router.put('/', protect, updateProfile);
router.put('/identity', protect, updateIdentity);

export default router;
