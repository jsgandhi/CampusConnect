import { Router } from 'express';
import { handleAiChat } from '../controllers/ai.controller.js';
import { authenticateMockUser } from '../middleware/auth.js';

const router = Router();

router.post('/chat', authenticateMockUser, handleAiChat);

export default router;
