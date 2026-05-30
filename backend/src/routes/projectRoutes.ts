import { Router } from 'express';
import { 
  getMyProjects, 
  createProject, 
  updateProject, 
  deleteProject, 
  getProjectsByUsername 
} from '../controllers/projectController';
import { protect } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

// GET /api/projects/:username (public)
router.get('/:username', getProjectsByUsername);

// GET /api/projects (protected - fetches logged-in user's projects)
router.get('/', protect, getMyProjects);

// POST /api/projects (protected)
router.post('/', protect, upload.single('thumbnail'), createProject);

// PUT /:id and PATCH /:id (protected)
router.put('/:id', protect, upload.single('thumbnail'), updateProject);
router.patch('/:id', protect, upload.single('thumbnail'), updateProject);

// DELETE /:id (protected)
router.delete('/:id', protect, deleteProject);

export default router;
