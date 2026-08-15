import { Router } from 'express';
import { getAdvisors, getAppointments, scheduleAppointment, cancelAppointment } from '../controllers/appointments.controller.js';
import { authenticateMockUser } from '../middleware/auth.js';

const router = Router();

router.get('/advisors', getAdvisors);
router.get('/', authenticateMockUser, getAppointments);
router.post('/', authenticateMockUser, scheduleAppointment);
router.patch('/:id/cancel', authenticateMockUser, cancelAppointment);

export default router;
