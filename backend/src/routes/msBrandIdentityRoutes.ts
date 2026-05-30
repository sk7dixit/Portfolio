import { Router } from 'express';
import {
  getMSBrandIdentity,
  upsertMSBrandIdentity,
  uploadMSBrandMedia
} from '../controllers/msBrandIdentityController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// Public route to fetch configuration
router.get('/', getMSBrandIdentity);

// Protected routes to modify configuration
router.post('/', protect, upsertMSBrandIdentity);
router.post('/upload', protect, upload.single('file'), uploadMSBrandMedia);

export default router;
