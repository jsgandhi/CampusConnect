import { Router } from 'express';
import { resetData } from '../controllers/dev.controller.js';

const router = Router();

router.post('/reset', resetData);

export default router;
