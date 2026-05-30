import { Router } from 'express';
import { 
  getMySkills, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  getSkillsByUsername 
} from '../controllers/skillController';
import { protect } from '../middleware/auth';

const router = Router();

// GET /api/skills/:username (public)
router.get('/:username', getSkillsByUsername);

// GET /api/skills (protected - fetches logged-in user's skills)
router.get('/', protect, getMySkills);

// POST /api/skills (protected)
router.post('/', protect, createSkill);

// PATCH /:id and PUT /:id (protected)
router.patch('/:id', protect, updateSkill);
router.put('/:id', protect, updateSkill);

// DELETE /:id (protected)
router.delete('/:id', protect, deleteSkill);

export default router;
