import { Router } from 'express';
import {
  getKSCertificates,
  createKSCertificate,
  updateKSCertificate,
  deleteKSCertificate,
  uploadKSCertificateMedia,
  getKSCertificateHero,
  upsertKSCertificateHero,
} from '../controllers/ksCertificateController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// Public GET routes
router.get('/', getKSCertificates);
router.get('/hero', getKSCertificateHero);

// Protected routes
router.post('/', protect, createKSCertificate);
router.put('/:id', protect, updateKSCertificate);
router.delete('/:id', protect, deleteKSCertificate);
router.post('/hero', protect, upsertKSCertificateHero);

// Media upload endpoint (expects file in 'image' field and type param: thumbnails/proofs/modal-images)
router.post('/upload/:type', protect, upload.single('image'), uploadKSCertificateMedia);

export default router;
