import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import { LoginSchema } from '@campusconnect/shared';

const prisma = new PrismaClient();

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      });
      return;
    }

    // Mock validation check for demo mode
    if (password !== 'demo1234' && user.passwordHash !== password) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        },
      });
      return;
    }

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      data: {
        user: safeUser,
        token: `mock-jwt-token-${user.id}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { role: 'STUDENT' }] },
      include: {
        enrollments: { include: { course: true } },
        rsvps: { include: { event: true } },
        appointments: { include: { advisor: true } },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found' },
      });
      return;
    }

    const { passwordHash: _, ...safeUser } = user;

    res.json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
