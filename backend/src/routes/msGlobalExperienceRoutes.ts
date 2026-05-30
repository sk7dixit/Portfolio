import { Router } from 'express';
import {
  getMSGlobalExperience,
  upsertMSGlobalExperience,
  uploadMSGlobalExperienceMedia
} from '../controllers/msGlobalExperienceController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// Public route to fetch configuration
router.get('/', getMSGlobalExperience);

// Protected routes to modify configuration
router.post('/', protect, upsertMSGlobalExperience);
router.post('/upload', protect, upload.single('file'), uploadMSGlobalExperienceMedia);

export default router;
