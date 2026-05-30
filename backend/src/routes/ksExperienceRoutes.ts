import { Router } from 'express';
import { 
  getKSExperiences, 
  createKSExperience, 
  updateKSExperience, 
  deleteKSExperience, 
  uploadKSExperienceMedia 
} from '../controllers/ksExperienceController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// GET all experience entries for KS (public)
router.get('/', getKSExperiences);

// Protected editing endpoints
router.post('/', protect, createKSExperience);
router.put('/:id', protect, updateKSExperience);
router.delete('/:id', protect, deleteKSExperience);

// Media upload endpoint (expects file in field name 'image')
router.post('/upload', protect, upload.single('image'), uploadKSExperienceMedia);

export default router;
