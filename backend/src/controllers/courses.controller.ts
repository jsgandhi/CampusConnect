import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { EnrollCourseSchema } from '@campusconnect/shared';

const prisma = new PrismaClient();

export const getAllCourses = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { code: 'asc' },
    });

    res.json({
      success: true,
      data: courses,
    });
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
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Your session is invalid. Please log in again.' },
      });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Course not found' },
      });
      return;
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existing && existing.status === 'ENROLLED') {
      res.status(400).json({
        success: false,
        error: { code: 'ALREADY_ENROLLED', message: 'You are already enrolled in this course' },
      });
      return;
    }

    if (!existing && course.enrolledCount >= course.capacity) {
      res.status(400).json({
        success: false,
        error: { code: 'COURSE_FULL', message: 'This course is at capacity' },
      });
      return;
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      update: { status: 'ENROLLED' },
      create: {
        userId: user.id,
        courseId,
        status: 'ENROLLED',
      },
      include: { course: true },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } },
    });

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
    const userId = req.user!.id;

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!existing || existing.status !== 'ENROLLED') {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'You are not currently enrolled in this course' },
      });
      return;
    }

    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { status: 'DROPPED' },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { decrement: 1 } },
    });

    res.json({
      success: true,
      data: { message: 'Successfully dropped course' },
    });
  } catch (error) {
    next(error);
  }
};
