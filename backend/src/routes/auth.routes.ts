import { Router } from 'express';
import { login, getProfile } from '../controllers/auth.controller.js';
import { authenticateMockUser } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/profile', authenticateMockUser, getProfile);

export default router;
