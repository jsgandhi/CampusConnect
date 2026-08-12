import { Router } from 'express';
import { getAllCourses, enrollCourse, dropCourse } from '../controllers/courses.controller.js';
import { authenticateMockUser } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllCourses);
router.post('/enroll', authenticateMockUser, enrollCourse);
router.delete('/:courseId', authenticateMockUser, dropCourse);

export default router;
