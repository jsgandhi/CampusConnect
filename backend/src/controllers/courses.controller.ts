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
    const userId = req.user?.id || 'demo-student-id';

    // Find student in DB or fallback to demo student
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
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
    const userId = req.user?.id || 'demo-student-id';

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    }

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Student profile not found' },
      });
      return;
    }

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
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
