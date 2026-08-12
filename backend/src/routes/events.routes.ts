import { Router } from 'express';
import { getAllEvents, rsvpEvent, cancelRsvp } from '../controllers/events.controller.js';
import { authenticateMockUser } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllEvents);
router.post('/rsvp', authenticateMockUser, rsvpEvent);
router.delete('/rsvp/:eventId', authenticateMockUser, cancelRsvp);

export default router;
