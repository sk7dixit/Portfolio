import { Router } from 'express';
import { 
  getPortfolioBySlug, 
  updateProfile, 
  uploadResume, 
  uploadAvatar,
  uploadHeroImage,
  getResumeBySlug,
  getResumeDynamic,
  uploadProjectImage,
  uploadCertificateImage,
  uploadInternshipImage
} from '../controllers/portfolioController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

router.get('/slug/:slug', getPortfolioBySlug);
router.get('/slug/:slug/resume', getResumeBySlug);
router.get('/resume', getResumeDynamic);
router.patch('/profile', protect, updateProfile);
router.post('/profile/resume', protect, upload.single('resume'), uploadResume);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/profile/hero-image', protect, upload.single('heroImage'), uploadHeroImage);
router.post('/profile/project-image', protect, upload.single('projectImage'), uploadProjectImage);
router.post('/profile/certificate-image', protect, upload.single('certificateImage'), uploadCertificateImage);
router.post('/profile/internship-image', protect, upload.single('internshipImage'), uploadInternshipImage);

export default router;
