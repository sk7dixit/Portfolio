import { Router } from 'express';
import { getMyInternships, createInternship, uploadInternshipDocument, deleteInternship } from '../controllers/internshipController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/', protect, getMyInternships);
router.post('/', protect, createInternship);
router.post('/:id/upload', protect, upload.single('document'), uploadInternshipDocument);
router.delete('/:id', protect, deleteInternship);

export default router;
