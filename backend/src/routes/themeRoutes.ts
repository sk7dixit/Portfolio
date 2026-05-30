import { Router } from 'express';
import { getAllThemes, createTheme, selectThemeForUser } from '../controllers/themeController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getAllThemes);
router.post('/', protect, createTheme);
router.patch('/select', protect, selectThemeForUser);

export default router;
