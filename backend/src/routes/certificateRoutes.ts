import { Router } from 'express';
import { getMyCertificates, createCertificate, uploadCertificateImage, deleteCertificate } from '../controllers/certificateController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/', protect, getMyCertificates);
router.post('/', protect, createCertificate);
router.post('/:id/upload', protect, upload.single('certificate'), uploadCertificateImage);
router.delete('/:id', protect, deleteCertificate);

export default router;
