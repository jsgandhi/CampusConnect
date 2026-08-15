import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { EnrollCourseSchema } from '@campusconnect/shared';
import { mockCourses, mockEnrollments } from '../data/mock-data.js';

export const getAllCourses = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({ success: true, data: mockCourses });
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = EnrollCourseSchema.parse(req.body);
    const userId = req.user?.id || 'demo-student-id';
    const course = mockCourses.find((item) => item.id === courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Course not found' },
      });
      return;
    }

    const existing = mockEnrollments.find((item) => item.userId === userId && item.courseId === courseId);

    if (existing && existing.status === 'ENROLLED') {
      res.status(400).json({
        success: false,
        error: { code: 'ALREADY_ENROLLED', message: 'You are already enrolled in this course' },
      });
      return;
    }

    if (course.enrolledCount >= course.capacity) {
      res.status(400).json({ success: false, error: { code: 'COURSE_FULL', message: 'Course is full' } });
      return;
    }
    const enrollment = { id: `enrollment-${Date.now()}`, userId, courseId, status: 'ENROLLED' as const, enrolledAt: new Date().toISOString(), course };
    mockEnrollments.push(enrollment);
    course.enrolledCount += 1;

    res.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const dropCourse = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id || 'demo-student-id';
    const index = mockEnrollments.findIndex((item) => item.userId === userId && item.courseId === courseId);
    if (index === -1) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Enrollment not found' } });
      return;
    }
    mockEnrollments.splice(index, 1);
    const course = mockCourses.find((item) => item.id === courseId);
    if (course && course.enrolledCount > 0) course.enrolledCount -= 1;

    res.json({
      success: true,
      data: { message: 'Successfully dropped course' },
    });
  } catch (error) {
    next(error);
  }
};
